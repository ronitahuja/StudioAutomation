from crewai.tools import tool
import pymongo
import json

@tool("Insert Data in MongoDB Tool")
def insert_in_mongodb_tool(data) -> str:
    """Tool for inserting data into MongoDB."""
    
    mongo_uri="mongodb+srv://ronitdarwinbox:12345@cluster0.payf8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    client = pymongo.MongoClient(mongo_uri)
    db = client['learn']
    collection = db["orders"]

    # print("............................................"+data+"........................................................................................")
    # collection.insert_one(data)
    # return f"News article '{title}' stored successfully!"
    # if isinstance(data, str):
    #     try:
    #         data = json.loads(data)  # Convert JSON string to dictionary
    #     except json.JSONDecodeError:
    #         return "Invalid JSON format for MongoDB insertion."

    # Insert the data into MongoDB
    collection.insert_many(data)

    # # Extract title if available
    # title = data.get("title", "Untitled News Article")

    return f"News article '{title}' stored successfully!"

