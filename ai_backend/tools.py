import os
from crewai_tools import SerperDevTool
from insert_in_mongodb_tool import insert_in_mongodb_tool
from take_input_tool import take_input_tool

# Web Search Tool
serper_tool = SerperDevTool(api_key=os.getenv("SERPER_API_KEY"))

# Export tools
TOOLS = {
    "search": serper_tool,
    "insert_in_mongodb_tool": insert_in_mongodb_tool,
    "input": take_input_tool
}
