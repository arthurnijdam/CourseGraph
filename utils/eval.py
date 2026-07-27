from sklearn.metrics.pairwise import cosine_similarity
import numpy as np 
import pandas as pd 

def compute_cos_sim(course_embs, course_embsb, course_names, course_namesb): 
    embs = np.array(course_embs) 
    embs_ov = np.array(course_embsb)
    # compute cosine similarity 
    cos_sim = cosine_similarity(embs, embs_ov)
    # create mask 
    mask = np.equal.outer(course_names, course_namesb)
    # mask out same courses 
    cos_sim_masked = np.where(~mask, cos_sim, 0) # set all overlapping values to 0 so they don't get selected
    return cos_sim_masked 

def compute_metrics(th, course_names, course_namesb, cos_sim_masked, df_overlap):
    all_TP = 0
    all_FP = 0
    all_FN = 0
    all_TN = 0
    
    for i in range(len(course_names)): 
        #print('value: ',[x for x in cos_sim_masked[i,:] if x >= th])
        val = [x for x in cos_sim_masked[i,:] if x >= th]
        #print('code: ',[course_namesb[i] for i, x in enumerate(cos_sim_masked[i,:]) if x >= th])
        chosen_code = [course_namesb[i] for i, x in enumerate(cos_sim_masked[i,:]) if x >= th]
    
        result = df_overlap.loc[df_overlap['New_code'] == course_names[i], 'Overlap'] 
        #print(result)
        codes = str(result.iloc[0]).split()
        true_overlap = [code for code in codes if code not in old_codes and code != 'nan']
        #print('label: ',true_overlap)
        
        all_codes = set(course_namesb)
        pred_set = set(chosen_code) 
        gt_set = set(true_overlap) 
        
        # Calculate metrics
        TP = len(gt_set & pred_set)  # Intersection: {'0LVX30'} -> 1
        FP = len(pred_set - gt_set)  # In predicted but not ground truth: {'0LVX20'} -> 1
        FN = len(gt_set - pred_set)  # In ground truth but not predicted: {'0SAB0', 'JBG000'} -> 2
        TN = len(all_codes - (gt_set | pred_set))  # In neither: nothing -> 0
        
        all_TP += TP
        all_FP += FP
        all_FN += FN
        all_TN += TN
        #print('TP: ',TP)
        #print('FP: ',FP)
        #print('FN: ',FN)
        #print('TN: ',TN)
        #break 
    precision = all_TP / (all_TP + all_FP) if (all_TP + all_FP) > 0 else 0
    recall = all_TP / (all_TP + all_FN) if (all_TP + all_FN) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    return precision, recall, f1

def find_best_th_GS(course_names, course_namesb, cos_sim_masked, df_overlap): 
    best_f1 = 0 
    best_th = 0 
    for th in np.arange(0.05, 1, 0.05): 
        precision, recall, f1 = compute_metrics(th, course_names, course_namesb, cos_sim_masked, df_overlap)
        if f1 >= best_f1: 
            best_f1 = f1 
            best_th = th 
    print('best_f1: ',best_f1)
    print('best_th: ',best_th)

# Helper function to map names to indices
def fill_similarity(sim, names, names_b, weight):
    row_map = {name: i for i, name in enumerate(names)}
    col_map = {name: i for i, name in enumerate(names_b)}
    
    for i, name in enumerate(all_names):
        if name in row_map:
            for j, name_b in enumerate(all_names_b):
                if name_b in col_map:
                    combined[i, j] += weight * sim[row_map[name], col_map[name_b]]
                    total_w[i, j] += weight