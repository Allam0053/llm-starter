import requests
import json
import os
import sys

# Configuration
# User should fill this or set the environment variable
BEARER_TOKEN = os.getenv("MIDASCUAN_TOKEN", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5taWRhc2N1YW4uaWQvYXV0aC9sb2dpbiIsImlhdCI6MTc2NzAzMjMxMSwiZXhwIjoxNzY3MTE4NzExLCJuYmYiOjE3NjcwMzIzMTEsImp0aSI6IkJTaEhGS3RFZXFIdXlUMHEiLCJzdWIiOiI5NzI1IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.Gw4xySz6_X7_zQLKSMy11lb3251baFXFnmWfKCAOm6A")
BASE_URL = "https://api.midascuan.id"

HEADERS = {
    "Authorization": f"Bearer {BEARER_TOKEN}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def get_stock_list():
    """Fetch the list of stock analyses."""
    url = f"{BASE_URL}/analysis"
    print(f"[*] Fetching stock list from {url}...")
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"[!] Error fetching stock list: {e}")
        return None

def get_stock_detail(slug):
    """Fetch details for a specific stock by slug."""
    url = f"{BASE_URL}/pages/load/{slug}"
    # print(f"[*] Fetching detail for {slug}...") # Verbose
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"[!] Error fetching detail for {slug}: {e}")
        return None

def extract_content(data, source="detail"):
    """
    Helper to extract content_json from various possible structures.
    Top priority is direct access or nested common patterns.
    """
    if not isinstance(data, dict):
        return None
        
    # Pattern 1: Direct key (typical in List items -> page)
    if "content_json" in data:
        return data["content_json"]
    
    # Pattern 2: Nested in 'page' (Common in some detail responses)
    if "page" in data and isinstance(data["page"], dict):
        if "content_json" in data["page"]:
            return data["page"]["content_json"]
            
    # Pattern 3: Nested in 'data' (API wrapper)
    if "data" in data and isinstance(data["data"], dict):
        # Recursively check inside 'data'
        return extract_content(data["data"], source)
        
    return None

def main():
    if BEARER_TOKEN == "PUT_YOUR_BEARER_TOKEN_HERE":
        print("[!] Please update the BEARER_TOKEN variable in the script or set MIDASCUAN_TOKEN env var.")
        # We continue anyway just in case the user wants to see the logic, 
        # but it will likely fail 401.
    
    list_response = get_stock_list()
    if not list_response:
        return

    # Navigate to the array of items based on the provided JSON structure
    # response -> data -> data -> [items]
    try:
        items = list_response["data"]["data"]
    except (KeyError, TypeError) as e:
        print(f"[!] Unexpected list response structure: {e}")
        print(json.dumps(list_response, indent=2)[:500]) # Print snippet
        return

    print(f"[*] Found {len(items)} items. Starting verification...")
    
    if "meta" in list_response["data"]:
        print(f"[*] Metadata: {json.dumps(list_response['data']['meta'], indent=2)}")
    
    match_count = 0
    diff_count = 0
    error_count = 0

    for item in items:
        page = item.get("page", {})
        slug = page.get("slug")
        
        if not slug:
            print("[?] Item found without slug, skipping.")
            continue
            
        list_content = page.get("content_json")
        
        # specific check: if content_json is a string in the list but object in detail?
        # The sample shows it's a stringified JSON.
        
        detail_response = get_stock_detail(slug)
        if not detail_response:
            error_count += 1
            continue
            
        detail_content = extract_content(detail_response, source="detail")
        
        # Normalization for comparison (handle potential string vs obj diffs if parsing is needed)
        # Note: The sample shows `content_json` as a string. We compare raw strings first.
        
        is_match = False
        if list_content == detail_content:
            is_match = True
        
        if is_match:
            print(f"[OK] {slug}: Content matches.")
            match_count += 1
        else:
            print(f"[DIFF] {slug}: Content differs!")
            # print(f"  List content len: {len(str(list_content)) if list_content else 0}")
            # print(f"  Detail content len: {len(str(detail_content)) if detail_content else 0}")
            diff_count += 1

    print("\n" + "="*30)
    print(f"Verification Complete.")
    print(f"Matches: {match_count}")
    print(f"Diffs:   {diff_count}")
    print(f"Errors:  {error_count}")

if __name__ == "__main__":
    main()
