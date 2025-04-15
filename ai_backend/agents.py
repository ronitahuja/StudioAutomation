from crewai import Agent
from tools import TOOLS
import os
from dotenv import load_dotenv

load_dotenv()   

# llm="groq/llama-3.3-70b-versatile"
# api_key = os.getenv("GROQ_API_KEY")
api_key=os.getenv("OPENAI_API_KEY")
llm="openai/gpt-4.1"

input_agent = Agent(
    llm=llm,
    api_key=api_key,
    name="Input Collector",
    role="Gather missing information from the user",
    goal="Ensure all required details are collected before executing tasks",
    tools=[TOOLS["take_input_tool"]],
    backstory="I am responsible for collecting missing credentials and other required details from the user before processing.",
    verbose=True,
    memory=True,
    allow_delegation=True,
    max_iter=2
)

search_agent = Agent(
    llm=llm,
    api_key=api_key,
    name="Search AI",
    role="Fetch relevant news headlines",
    goal="Provide relevant news headlines based on user queries",
    tools=[TOOLS['search_tool']],
    backstory="A search specialist that fetches the latest and most relevant news headlines efficiently.",
    verbose=True,
    memory=True,
    allow_delegation=True,
)

insert_in_mongodb_agent = Agent(
    llm=llm,
    api_key=api_key,
    name="MongoDB Manager",
    role="Insert application details into MongoDB",
    goal="Ensure the app details are inserted correctly into the MongoDB database.",
    tools=[TOOLS['insert_app_in_mongodb_tool']],
    backstory="A database expert specializing in storing application data securely and efficiently.",
    verbose=True,
    memory=True,
    allow_delegation=False,
)

fetch_app_from_mongodb_agent = Agent(
    llm=llm,
    api_key=api_key,
    name="MongoDB Fetcher",
    role="Retrieve application data from MongoDB",
    goal="Fetch application details from MongoDB based on app name and category.",
    tools=[TOOLS['fetch_app_from_mongodb_tool']],
    backstory="A MongoDB specialist who ensures the retrieval of accurate app data when needed.",
    verbose=True,
    memory=True,
    allow_delegation=True,
    max_iter=30
)

segregate_params_agent = Agent(
    llm=llm,
    api_key=api_key,
    name="Segregation Agent",
    role="Extract and categorize request parameters",
    goal="Segregate connection-level and transaction-level parameters from the request and extract relevant app details.",
    # tools=[TOOLS['take_input_tool']],
    backstory=(
        "You are a specialist in analyzing user prompts to create applications on the platform. "
        "You understand natural language descriptions as well as technical inputs like cURL requests. "
        "Your task is to identify and extract all required fields for creating an application, including: "
        "appName, authenticationType, and connectionLevelParamFields. Each connection-level parameter includes: "
        "paramName, paramType, mandatory (True/False), sensitive (True/False), variableName, and description. "
        "You can detect these parameters even if they appear within headers or URLs of cURL requests. "
        "Your output must be a clean, structured JSON object that can be directly used to autofill a UI form without creating the app itself."
        "If you dont know anything , ask user for the input , dont hallucinate and fill the fields with dummy values."
    ),
    verbose=True,
    memory=True,
    allow_delegation=True,
    max_iter=3
)

return_new_app_details_agent = Agent(
    llm=llm,
    api_key=api_key,
    name="App Details Builder",
    role="Construct new app details if they are missing from the database.",
    goal="Return a structured JSON object with all required fields for creating an application.Do not return anything else other than the JSON object.",
    # tools=[TOOLS['take_input_tool']],
    backstory=("An AI assistant responsible for creating app details based on request parameters and user input."
    "You just return the JSON object .you dont do anything more than this. "),
    verbose=True,
    memory=True,
    allow_delegation=False,
    max_iter=3
)

update_agent =  Agent(
    llm=llm,
    api_key=api_key,
    name="Update Agent",
    role="Your role is to update the value in the current state JSON based on the user query.",
    goal="Return the updated state JSON",
    # tools=[TOOLS['take_input_tool']],
    backstory="You are an AI assistant responsible for updating the current state JSON based on user queries.",
    verbose=True,
    memory=True,
    allow_delegation=False,
    max_iter=3
)


# Export agents
AGENTS = {
    "fetch_app_from_mongodb_agent": fetch_app_from_mongodb_agent,
    # "insert_in_mongodb_agent": insert_in_mongodb_agent,
    "input": input_agent,
    # "search": search_agent,
    "segregate_params_agent": segregate_params_agent,
    "return_new_app_details_agent": return_new_app_details_agent,
    # "manager_agent": manager_agent,
    "update_agent": update_agent,
}
