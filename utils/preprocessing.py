import os
import json
def find_json_files(directory_path, recursive=True):
    """Find all JSON files in the specified directory."""
    json_files = []
    
    if not os.path.exists(directory_path):
        print(f"Error: Directory '{directory_path}' does not exist")
        return json_files
    
    try:
        if recursive:
            for root, dirs, files in os.walk(directory_path):
                for file in files:
                    if file.lower().endswith('.json'):
                        full_path = os.path.join(root, file)
                        json_files.append(full_path)
        else:
            for item in os.listdir(directory_path):
                item_path = os.path.join(directory_path, item)
                if os.path.isfile(item_path) and item.lower().endswith('.json'):
                    json_files.append(item_path)
    except Exception as e:
        print(f"Error searching for JSON files: {e}")
    
    return json_files

def load_json_file(file_path):
    """Load and parse a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data
    except json.JSONDecodeError as e:
        print(f"JSON decode error in {file_path}: {e}")
        return None
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None