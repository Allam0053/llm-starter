import json
import os
from datetime import datetime

HISTORY_DIR = "data/history"

def log_chat(prompt: str, response: str, metadata: dict = None):
    # Create dated folder: data/history/2025-12-24/
    date_str = datetime.now().strftime("%Y-%m-%d")
    folder_path = os.path.join(HISTORY_DIR, date_str)
    os.makedirs(folder_path, exist_ok=True)
    
    # Create unique filename
    timestamp = datetime.now().strftime("%H%M%S_%f")
    file_path = os.path.join(folder_path, f"chat_{timestamp}.json")
    
    log_data = {
        "timestamp": datetime.now().isoformat(),
        "prompt": prompt,
        "response": response,
        "metadata": metadata or {}
    }
    
    with open(file_path, "w") as f:
        json.dump(log_data, f, indent=2)