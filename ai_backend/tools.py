import os
from crewai_tools import SerperDevTool
from custom_tools.insert_app_in_mongodb_tool import insert_app_in_mongodb_tool
from custom_tools.take_input_tool import take_input_tool
from custom_tools.fetch_app_from_mongodb_tool import fetch_app_from_mongodb_tool

serper_tool = SerperDevTool(api_key=os.getenv("SERPER_API_KEY"))

TOOLS = {
    "search_tool": serper_tool,
    "insert_app_in_mongodb_tool": insert_app_in_mongodb_tool,
    "fetch_app_from_mongodb_tool": fetch_app_from_mongodb_tool,
    "take_input_tool": take_input_tool,
}
