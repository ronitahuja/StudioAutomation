from crewai.tools import tool
import pymongo
import json

@tool("Insert App Data in MongoDB Tool")
def insert_app_in_mongodb_tool(data) -> str:
    """Tool for inserting data into MongoDB."""
    
    mongo_uri = "mongodb+srv://ronitdarwinbox:12345@cluster0.payf8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    
    client = pymongo.MongoClient(mongo_uri)
    db = client['test']
    collection = db["apps"]

    try:
        if isinstance(data, str):
            data = json.loads(data)  # Convert JSON string to dictionary

        if isinstance(data, dict):  # Convert single dictionary to list
            data = [data]

        if not isinstance(data, list):
            return "Data should be a list of dictionaries."

        collection.insert_many(data)  # Insert into MongoDB

        return f"Inserted {len(data)} documents successfully!"
    
    except json.JSONDecodeError:
        return "Invalid JSON format for MongoDB insertion."
    except Exception as e:
        return f"Error inserting into MongoDB: {str(e)}"
