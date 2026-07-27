import pandas as pd 
import numpy as np 
from nltk.tokenize import sent_tokenize 
import itertools
import re
from typing import List, Dict, Set
import nltk 
nltk.download('punkt') 
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize 
from sentence_transformers import SentenceTransformer 
import numpy as np 
import torch 

def embed_df(model, tokenizer, df, max_tokens=256):
    document_embs = {}
    for doc_id, doc_text in df.items():
        paragraphs = split_document_into_paragraphs(doc_text, max_tokens, tokenizer)
        emb = embed_paragraphs(model, tokenizer, paragraphs)
        document_embs[doc_id] = emb
    return document_embs

def merge_dicts_mean(*dicts):
    """
    Merge multiple dictionaries with identical keys by calculating element-wise mean of lists.
    
    Args:
        *dicts: Variable number of dictionaries with identical keys
    
    Returns:
        Dictionary with same keys, values are element-wise means of numpy arrays
    """
    if not dicts:
        return {}
    
    # Use first dict to get keys (all dicts have same keys)
    keys = dicts[0].keys()
    
    result = {}
    
    for key in keys:
        # Extract all lists for this key from all dictionaries
        all_lists = [d[key] for d in dicts]
        
        # Calculate element-wise mean
        # zip(*all_lists) transposes the lists so we get tuples of values at each position
        mean_list = [sum(values) / len(values) for values in zip(*all_lists)]
        
        result[key] = np.array(mean_list)

    return result 

def split_document_into_paragraphs(doc: str, max_tokens: int, tokenizer):
    sentences = sent_tokenize(doc)
    
    paragraphs = []
    current = []

    def num_tokens(text):
        return len(tokenizer.encode(text, add_special_tokens=False))

    for s in sentences:
        joined = " ".join(current + [s])
        if num_tokens(joined) <= max_tokens:
            current.append(s)
        else:
            paragraphs.append(" ".join(current))
            current = [s]

    if current:
        paragraphs.append(" ".join(current))

    return paragraphs

def embed_paragraphs(model, tokenizer, paragraphs):
    if len(paragraphs) == 0:
        return np.zeros(model.get_sentence_embedding_dimension())
    
    embeddings = model.encode(paragraphs, convert_to_numpy=True, normalize=True)
    return np.mean(embeddings, axis=0)

def embed_paragraphs2(model, tokenizer, paragraphs):
    if len(paragraphs) == 0:
        return np.zeros(model.get_sentence_embedding_dimension())
    else: 
        paragraphs = [normalize(paragraph) for paragraph in paragraphs]
    
    embeddings = model.encode(paragraphs, convert_to_numpy=True, normalize_embeddings=False)
    return np.mean(embeddings, axis=0)

def split_sentences(text): 
    sentences = re.split(r'\.\s+(?=[A-Z])', text)
    
    # Re-add the period to each sentence (except maybe last if you want)
    sentences = [s.strip() + '.' for s in sentences if s]
    
    #for s in sentences:
      #  print(s)
    return sentences 

# Now, we format the TKS-D of our ECSF dataset in a similar way so they can be matched 
def embed_ECSF_single(nr, DS_tasks, tokenizer,model, types='Knowledge'):
    single_job = DS_tasks[nr]
    single_dict = {}
    for ii,ele in enumerate(single_job.splitlines()): 
        if types == 'Knowledge':
            bb = ele.replace('Knowledge of ','')
            single_dict[ii] = normalize(bb)
        if types == 'Skills': 
            bb = ele.replace('Skill in ','')
            single_dict[ii] = normalize(bb)
        if types == 'Tasks' or types == 'Description': 
            single_dict[ii] = normalize(ele)
    
    df_unique_KD = pd.DataFrame(single_dict.values())
    unique_KD_embs = embed_df(model,tokenizer, df_unique_KD[0]) 
    return np.array(list(unique_KD_embs.values())) #, KD_encodings

def embed_ECSF_d(single_job, tokenizer,model, types='Knowledge'):
    single_dict = {} 
    description = normalize(single_job)
    single_dict[0] = description 
    df_unique_KD = pd.DataFrame(single_dict.values())
    unique_KD_embs = embed_df(model,tokenizer, df_unique_KD[0]) 
    return np.array(list(unique_KD_embs.values())) #, KD_encodings

# Extract NICE KD embeddings per work role 
def embed_unique_KDs(unique_KDs, tokenizer, model, types='Knowledge'):
    # gives the sBERT embedding of all unique KDs (572, 768) 
    df_unique_KD = pd.DataFrame(unique_KDs.values())
    if types == 'Knowledge': 
        df_unique_KD['cleaned'] = df_unique_KD[0].apply(lambda x: normalize(x.replace('Knowledge of ','')))
    if types == 'Skills': 
        df_unique_KD['cleaned'] = df_unique_KD[0].apply(lambda x: normalize(x.replace('Skill in ','')))
    if types == 'Tasks' or types == 'Description': 
        df_unique_KD['cleaned'] = df_unique_KD[0].apply(lambda x: normalize(x))
    # print(df_unique_KD.head())
    unique_KD_embs = embed_df(model,tokenizer, df_unique_KD['cleaned']) 
    #print('embs shape: ',np.shape(unique_KD_embs))
    KD_encodings = list(unique_KDs.keys())
    return unique_KD_embs, KD_encodings


def load_model_tokenizer(model_name=None): 
    if model_name == None: 
        model_name = "sentence-transformers/all-mpnet-base-v2"   # sBERT model
    model = SentenceTransformer(model_name)
    tokenizer = model.tokenizer
    max_tokens = 256  # model limit
    return model, tokenizer

def extract_course_info_from_json_prompt(json_file, course_code):
    """
    Extracts course information from a parsed JSON file containing webpage content.
    Returns a dictionary with title, credits, level, description, topics,
    learning_outcomes, prerequisites, and examination_methods. 
    """
    
    base_instructions = (
        "You are an expert curriculum analyst and course information extractor with a specialization in computer science education.\n"
        "Instructions:\n"
        "a. Carefully read the provided parsed JSON content (extracted from a course webpage) and course code.\n"
        "b. Extract the following fields if available FOR THE COURSE CODE SPECIFIED ONLY:\n"
        "   - title: course title\n"
        "   - credits: credit value (e.g., '5 ECTS', '3 credits')\n"
        "   - level: education level (e.g., 'BSc', 'MSc', 'PhD', 'Advanced', 'Intermediate')\n"
        "   - description: course description text\n"
        "   - topics: list of main topics covered (infer from syllabus, content list, or description)\n"
        "   - learning_outcomes: list of learning outcomes (infer from 'learning objectives', 'students will be able to', or course goals)\n"
        "   - prerequisites: list of required prior knowledge/courses (may be labeled as 'prerequisites', 'required knowledge', 'entry requirements', 'prior knowledge')\n"
        "   - examination_methods: list of assessment methods (may be labeled as 'assessment', 'examination', 'evaluation', 'grading')\n"
        "c. If a field is not explicitly present or cannot be inferred for this course code, leave it as empty string (for single fields) or empty list (for list fields).\n"
        "d. Be flexible with section headers — the same information may appear under different names.\n"
        "e. Infer learning outcomes from phrases like 'After this course, students will be able to...', 'Upon completion...', or from exam tasks.\n"
        "f. Infer topics from table of contents, syllabus sections, or repeated concepts in the description.\n"
        "g. Do NOT invent information that is not present or reasonably inferable.\n"
        "h. Return ONLY a valid dictionary in the exact format shown below.\n"
        "i. Do NOT include any explanation, commentary, or additional text outside the dictionary.\n"
    )
    
    output_format = {
        "title": "",
        "credits": "",
        "level": "",
        "description": "",
        "topics": [],
        "learning_outcomes": [],
        "prerequisites": [],
        "examination_methods": []
    }
    
    extraction_prompt = [
        {"role": "system", "content": base_instructions},
        {"role": "user", "content": 
         f"# Webpage content (JSON format):\n{json_file}\n\n"
         f"# Extract course information and return as JSON matching this structure:\n"
         f"{output_format}\n\n"
         f"# Rules:\n"
         f"- Use empty string '' for missing single-value fields\n"
         f"- Use empty list [] for missing multi-value fields\n"
         f"- For 'level', standardize to 'BSc', 'MSc', 'PhD', 'Bachelor', 'Master', etc.\n"
         f"- For 'topics', extract as list of strings\n"
         f"- For 'learning_outcomes', extract as list of strings\n"
         f"- For 'prerequisites', extract as list of strings\n"
         f"- For 'examination_methods', extract as list of strings (e.g., 'written exam', 'oral presentation', 'project', 'homework')\n"
         f"- Return ONLY the JSON, no other text."}
    ]
    
    return extraction_prompt 

def normalize(title: str) -> str:
    """Normalize text"""
    if pd.isna(title):
        return ""
    
    title = str(title)
    title = title.lower() # Convert to lowercase
    title = title.replace('&', 'and') # Replace '&' with 'and'
    title = re.sub(r'[^\w\s-]', ' ', title) # Remove special characters but keep spaces and hyphens
    title = re.sub(r'\b(and|or|the|of|for|in|to|a|an|with|at|by)\b', ' ', title) # Remove common conjunctions as standalone words
    title = re.sub(r'\s+', ' ', title).strip() # Clean up extra spaces
    title = re.sub(r's\b', '', title) # Remove trailing 's' for plurals 
    return title



