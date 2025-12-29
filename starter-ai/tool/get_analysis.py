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

def get_stock_list(page=1):
    """Fetch the list of stock analyses with pagination."""
    url = f"{BASE_URL}/analysis?page={page}"
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
    
    all_items = []
    page = 1
    
    while True:
        list_response = get_stock_list(page)
        if not list_response:
            break

        # Navigate to the array of items based on the provided JSON structure
        # response -> data -> data -> [items]
        try:
            items = list_response["data"]["data"]
            meta = list_response["data"].get("meta", {})
        except (KeyError, TypeError) as e:
            print(f"[!] Unexpected list response structure: {e}")
            print(json.dumps(list_response, indent=2)[:500]) # Print snippet
            break
            
        if not items:
            print("[*] No more items found.")
            break

        print(f"[*] Page {page}: Found {len(items)} items.")
        
        # Save Page Response
        page_filename = f"tool/analysis/page-{page:02}.json"
        try:
            with open(page_filename, "w", encoding="utf-8") as f:
                json.dump(list_response, f, indent=2, ensure_ascii=False)
        except IOError as e:
            print(f"[!] Error saving {page_filename}: {e}")
            
        for item in items:
            page_data = item.get("page", {})
            slug = page_data.get("slug")
            
            if not slug:
                continue
                
            # Verification logic removed as per instruction.
            # We trust list_content now.
            list_content_raw = page_data.get("content_json")
            
            # Try to parse content_json so it's not a string in the saved file
            if list_content_raw and isinstance(list_content_raw, str):
                try:
                    page_data["content_json"] = json.loads(list_content_raw)
                except json.JSONDecodeError:
                    pass # Keep as string if parsing fails
            
            # Save to file
            filename = f"tool/analysis/{slug}.json"
            try:
                with open(filename, "w", encoding="utf-8") as f:
                    json.dump(item, f, indent=2, ensure_ascii=False)
            except IOError as e:
                print(f"[!] Error saving {filename}: {e}")

            # storing valid items
            all_items.append({
                "slug": slug,
                "title": page_data.get("title"),
                "content_len": len(str(list_content_raw)) if list_content_raw else 0
            })
            
        # Pagination Check
        # Assuming 'end' and 'total' in meta can help, or just stop when items < limit (20)
        # But robust way is to check items count or meta
        # total = meta.get("total", 0)
        # current_end = meta.get("end", 0) # e.g. 20, 40...
        
        # Simple heuristic: if we got fewer items than 20, we are done
        if len(items) < 20:
             print("[*] Reached last page based on item count.")
             break
             
        # Safety break to avoid infinite loops if API behaves weirdly
        if page > 20: 
             print("[!] Safety limit reached (20 pages). Stopping.")
             break
             
        page += 1

    print("\n" + "="*30)
    print(f"Crawling Complete.")
    print(f"Total Unique Items: {len(all_items)}")
    # print sample
    if all_items:
        print(f"First item: {all_items[0]['slug']} ({all_items[0]['content_len']} chars)")
        print(f"Last item: {all_items[-1]['slug']} ({all_items[-1]['content_len']} chars)")


if __name__ == "__main__":
    main()
