from crewai.tools import tool
import pymongo

@tool("Fetch App Data from MongoDB Tool")
def fetch_app_from_mongodb_tool(app_name:str,app_category:str) -> str:
    """Tool for fetching app data from MongoDB."""

    mongo_uri = "mongodb+srv://ronitdarwinbox:12345@cluster0.payf8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    
    client = pymongo.MongoClient(mongo_uri)
    db = client['test']
    collection = db["apps"]

    if not app_name or not app_category:
        return "app_name and app_category are required."

    print("Fetching data from MongoDB...")
    print(f"app_name: {app_name}, app_category: {app_category}")
    data=collection.find_one({"appName": app_name, "appCategory": app_category})
    print("Data fetched from MongoDB:", data)

    if not data:
        return "No data found for the given app_name and app_category."
    return data
