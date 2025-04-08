from crewai.tools import tool
import pymongo

@tool("MongoDB Tool")
def mongodb_tool(action: str, mongo_uri: str, db_name: str, collection_name: str, title: str = "", summary: str = "") -> str:
    """Tool for interacting with MongoDB dynamically based on user input."""
    
    if not mongo_uri or not db_name or not collection_name:
        return "MongoDB details are required."

    client = pymongo.MongoClient(mongo_uri)
    db = client[db_name]
    collection = db[collection_name]

    if action == "store":
        if not title or not summary:
            return "Title and summary are required."
        article = {"title": title, "summary": summary}
        collection.insert_one(article)
        return f"News article '{title}' stored successfully!"
    
    elif action == "retrieve":
        if not title:
            return "Title is required."
        article = collection.find_one({"title": title})
        return f"📰 {article['title']}\n{article['summary']}" if article else "No article found."

    return "Invalid action. Use 'store' or 'retrieve'."
