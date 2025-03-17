from scrapegraphai.graphs import SmartScraperGraph
import os
from dotenv import load_dotenv
import sys
import json
# Add `/src` folder to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from constants.prompt_config import get_prompt

# Load .env file
load_dotenv()

# Check if API key is set
api_key = os.getenv("MY_GROQ_API_KEY")
if not api_key:
    print(json.dumps({"status": "error", "message": "Missing DARWIN_GROQ_API_KEY"}))
    sys.exit(1)

if len(sys.argv) < 2:
    print(json.dumps({"status": "error", "message": "No JSON data received"}))
    sys.exit(1)

try:
    data = json.loads(sys.argv[1])  # Parse JSON
    model = data.get("model", "").strip()
    link = data.get("link", "").strip()
    query = data.get("query", "").strip()
    
    print(model, link, query)
    if not model or not link or not query:
        print(json.dumps({"status": "error", "message": "Missing required parameters"}))
        sys.exit(1)

    print(json.dumps({"status": "info", "message": "Received inputs", "model": model, "link": link, "query": query}))

except json.JSONDecodeError:
    print(json.dumps({"status": "error", "message": "Invalid JSON format"}))
    sys.exit(1)

# Define the configuration for the scraping pipeline
graph_config = {
   "llm": {
       "api_key": api_key,
       "model": model,
       "temperature": 0.2
   },
   "verbose": True,
   "headless": False,
}

# Create the SmartScraperGraph instance
smart_scraper_graph = SmartScraperGraph(prompt=get_prompt(query), source=link, config=graph_config)

def scrape():
    try:
        result = smart_scraper_graph.run()
        print(json.dumps({"status": "success", "data": result}, indent=4))
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))

scrape()

