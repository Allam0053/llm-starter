import json
import glob
import os
import re

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("BeautifulSoup4 not found. Please install it using: pip install beautifulsoup4")
    exit(1)

def html_to_markdown(html_content):
    if not html_content:
        return ""
    
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Simple conversion for specific tags
    for h2 in soup.find_all("h2"):
        h2.string = f"## {h2.get_text().strip()}"
        h2.unwrap()
        
    for b in soup.find_all(["b", "strong"]):
        b.string = f"**{b.get_text().strip()}**"
        b.unwrap()
        
    for i in soup.find_all(["i", "em"]):
        # Skip icon classes like fa-user-circle if they are empty or just icons
        if "fa" in i.get("class", []):
            i.decompose()
        else:
            i.string = f"*{i.get_text().strip()}*"
            i.unwrap()

    # Handle paragraphs - just make sure they are separated
    for p in soup.find_all("p"):
        p.insert_after("\n\n")
        p.unwrap()
        
    # Handle line breaks
    for br in soup.find_all("br"):
        br.replace_with("\n")

    # Get text and clean up
    text = soup.get_text()
    
    # Remove excessive whitespace
    lines = [line.strip() for line in text.splitlines()]
    # Remove empty lines that might have been created by div wrappers
    cleaned_lines = [line for line in lines if line]
    
    return "\n\n".join(cleaned_lines)

def render_markdown(data):
    markdown_output = []
    
    # Title
    page = data.get("page", {})
    title = page.get("title")
    slug = page.get("slug")
    
    if title:
        markdown_output.append(f"# {title}\n")
        
    content_json = data.get("content_json") or page.get("content_json")
    
    if not content_json:
        return ""
        
    # If it's a string (it shouldn't be if parsed correctly by previous step, but just in case)
    if isinstance(content_json, str):
        try:
            content_json = json.loads(content_json)
        except json.JSONDecodeError:
            return content_json # Return raw if optional

    if not isinstance(content_json, list):
        return str(content_json)

    for block in content_json:
        block_type = block.get("type")
        
        if block_type == "text":
            html_text = block.get("text", "")
            md_text = html_to_markdown(html_text)
            markdown_output.append(md_text)
            
        elif block_type == "image":
            image_url = block.get("imageUrl")
            alt_text = block.get("altText", "Image")
            if image_url:
                markdown_output.append(f"![{alt_text}]({image_url})")
                
        elif block_type == "spacer":
            continue
            
    return "\n\n".join(markdown_output)

def main():
    analysis_dir = "tool/analysis"
    json_dir = os.path.join(analysis_dir, "json")
    md_dir = os.path.join(analysis_dir, "md")
    
    # Ensure output dir exists
    os.makedirs(md_dir, exist_ok=True)
    
    files = glob.glob(os.path.join(json_dir, "*.json"))
    
    count = 0
    for filepath in files:
        filename = os.path.basename(filepath)
        
        # Skip page-xx.json files
        if filename.startswith("page-"):
            continue
            
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                print(f"[!] Error decoding {filename}")
                continue
                
        markdown_content = render_markdown(data)
        
        slug = data.get("slug") or data.get("page", {}).get("slug", filename.replace(".json", ""))
        output_file = os.path.join(md_dir, f"{slug}.md")
        
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(markdown_content)
            
        count += 1
        # print(f"[+] Rendered {slug}.md")

    print(f"[*] Successfully rendered {count} markdown files in {md_dir}")

if __name__ == "__main__":
    main()
