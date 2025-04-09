from crewai.tools import tool
import pymongo

@tool("Fetch Data from MongoDB Tool")
def fetch_from_mongodb_tool(mongodb_uri:str) -> str:
    """Tool for inserting data into MongoDB."""
    
    if not mongodb_uri:
        return "MongoDB details are required."

    client = pymongo.MongoClient(mongo_uri)
    db = client['learn']
    collection = db[orders]

    if not title or not summary:
        return "Title and summary are required."
        article = {"title": title, "summary": summary}
        collection.insert_one(article)
        return f"News article '{title}' stored successfully!"

    return "Invalid action. Use 'store' or 'retrieve'."
