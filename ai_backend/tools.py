import os
from crewai_tools import SerperDevTool
from mongo_tool import mongodb_tool
from take_input_tool import take_input_tool

# Web Search Tool
serper_tool = SerperDevTool(api_key=os.getenv("SERPER_API_KEY"))

# Export tools
TOOLS = {
    "search": serper_tool,
    "mongodb": mongodb_tool,
    "input": take_input_tool
}
