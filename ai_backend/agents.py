# import os
# from crewai import Agent
# from tools import TOOLS
# from dotenv import load_dotenv


# load_dotenv()

# # Input Agent (Asks for missing info)
# llm="groq/llama-3.3-70b-specdec"
# api_key=os.getenv("GROQ_API_KEY")
# input_agent = Agent(
#     llm=llm,
#     api_key=api_key,
#     name="Input Collector",
#     role="Gather missing information from the user",
#     goal="Ensure all required details are collected before executing tasks",
#     tools=[TOOLS["take_input_tool"]],
#     backstory="A helpful assistant that asks for missing credentials or details before proceeding.",
#     verbose=True,
#     memory=True,
#     allow_delegation=True,
# )

# # Search Agent
# search_agent = Agent(
#     llm=llm,
#     api_key=api_key,
#     name="Search AI",
#     role="Fetch relevant news headlines",
#     goal="Provide relevant news headlines based on user queries",
#     tools=[TOOLS['search_tool']],
#     backstory="An AI researcher who specializes in fetching anews headlines.",
#     verbose=True,
#     memory=True,
#     allow_delegation=True,
# )

# #insert_in_mongodb_agent
# insert_in_mongodb_agent = Agent(
#     llm=llm,
#     api_key=api_key,
#     name="MongoDB Manager",
#     role="Interact with insert_in_mongodb_tool and store data.",
#     goal="insert data in MongoDB",
#     tools=[TOOLS['insert_app_in_mongodb_tool']],
#     backstory=(
#         "A database expert skilled in inserting data into MongoDB. "
#         "All tools are already hardcoded with credentials. "
#         "The insert_in_mongodb_tool expects data in the format of [{{'key': 'value'}}, {{'key': 'value'}}]. "
#         "Ensure JSON validity before insertion. Handle errors gracefully and log failures."
#     ),
#     verbose=True,
#     memory=True,
#     allow_delegation=False,
#     # max_iter
# )

# fetch_app_from_mongodb_agent = Agent(
#     llm=llm,
#     api_key=api_key,
#     name="MongoDB Manager",
#     role="Interact with fetch_app_from_mongodb_tool and retrieve data.",
#     goal="Fetch data from MongoDB",
#     tools=[TOOLS['fetch_app_from_mongodb_tool']],
#     backstory=(
#         "A database expert skilled in fetching data from MongoDB. "
#         "All tools are already hardcoded with credentials. "
#         "The fetch_app_from_mongodb_tool expects data in the format of [{{'key': 'value'}}, {{'key': 'value'}}]. "
#         "Ensure JSON validity before fetching. Handle errors gracefully and log failures."
#     ),
#     verbose=True,
#     memory=True,
#     allow_delegation=True,
# )

# segregate_params_agent = Agent(
#     llm=llm,
#     api_key=api_key,
#     name="Segregate Params Agent",
#     role="The input may contain a curl request, a user query, or both. Segregate Connection-level parameters and Transaction-level parameters from the curl request. Extract app name, app category, authentication type, and description from the request. If any of these parameters are missing, ask the user for input.",
#     goal="""expected output==>
#     {
#         "connection_level_parameters": {
#             "param1": "value1"
#         },
#         "transaction_level_parameters": {
#             "param2": "value2"
#         },
#         "app_name": "example_app",
#         "app_category": "example_category",
#         "authentication_type": "example_authentication",
#         "description": "example_description"
#     }""",
#     backstory=(
#         "A helpful assistant that segregates connection-level and transaction-level parameters from a curl request. "
#         "If any of these parameters are missing, ask the user for input."
#     ),
#     verbose=True,
#     tools=[TOOLS['take_input_tool']],
#     memory=True,
#     allow_delegation=True,
# )

# return_new_app_details_agent = Agent(
#     llm=llm,
#     api_key=api_key,
#     name="Return New App Details Agent",
#     role="build the app details from the request and return them. If anything is missing, ask the user for the missing details.",
#     goal="""expected output==>
#     {
#         "app_name": "example_app",
#         "app_category": "example_category",
#         "authentication_type": "example_authentication",
#         "description": "example_description",
#         "connection_level_parameters": [
#             {
#                 "param_name": "value1",
#                 "param_type": "Text/Number/Boolean",
#                 "mandatory": true/false,
#                 "sensitive": true/false,
#                 "description": "Parameter description",
#                 "variable_name": "variable_name"
#             },
#             {
#                 "param_name": "value2",
#                 "param_type": "Text/Number/Boolean",
#                 "mandatory": true/false,
#                 "sensitive": true/false,
#                 "description": "Parameter description",
#                 "variable_name": "variable_name"
#             }
#         ]
#     }""",
#     backstory=(
#         'A helpful assistant that builds app details from a request. '
#         'If anything is missing, ask the user for the missing details.'
#     ),
#     verbose=True,
#     tools=[TOOLS['take_input_tool']],
#     memory=True,
#     allow_delegation=False,
# )

# Export agents
# AGENTS = {
#     "fetch_app_from_mongodb_agent": fetch_app_from_mongodb_agent,
#     "insert_in_mongodb_agent": insert_in_mongodb_agent,
#     "input": input_agent,
#     "search": search_agent,
#     "segregate_params_agent": segregate_params_agent,
#     "return_new_app_details_agent": return_new_app_details_agent,
# }

from crewai import Agent
from tools import TOOLS
import os
from dotenv import load_dotenv

load_dotenv()

llm = "groq/llama-3.3-70b-specdec"
api_key = os.getenv("GROQ_API_KEY")

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
    human_input=True,
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
    human_input=True,
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
    human_input=True,
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
    human_input=True,
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
    human_input=True,
    allow_delegation=True,
    max_iter=3
)

return_new_app_details_agent = Agent(
    llm=llm,
    api_key=api_key,
    name="App Details Builder",
    role="Construct new app details if they are missing from the database.",
    goal="Build comprehensive app details and request missing information from the user if necessary.",
    # tools=[TOOLS['take_input_tool']],
    backstory="An AI assistant responsible for creating app details based on request parameters and user input.",
    verbose=True,
    memory=True,
    human_input=True,
    allow_delegation=False,
    max_iter=3
)

# Export agents
AGENTS = {
    "fetch_app_from_mongodb_agent": fetch_app_from_mongodb_agent,
    "insert_in_mongodb_agent": insert_in_mongodb_agent,
    "input": input_agent,
    "search": search_agent,
    "segregate_params_agent": segregate_params_agent,
    "return_new_app_details_agent": return_new_app_details_agent,
}




# import os
# from crewai import Agent
# from tools import TOOLS
# from dotenv import load_dotenv
# import litellm
# from crewai import LLM

# llm = LLM(model="ollama/llama3.1:8b", base_url="http://localhost:11434")

# load_dotenv()

# # Ensure OpenAI API key exists (even if it's not used)
# os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "dummy_key")


# input_agent = Agent(
#     llm=llm,
#     name="Input Collector",
#     role="Gather missing information from the user",
#     goal="Ensure all required details are collected before executing tasks",
#     tools=[TOOLS["input"]],
#     backstory="A helpful assistant that asks for missing credentials or details before proceeding.",
#     verbose=True,
#     memory=True,
#     allow_delegation=True,
# )

# search_agent = Agent(
#     llm=llm,
#     name="Search AI",
#     role="Fetch relevant news and summarize",
#     goal="Provide summarized news based on user queries",
#     tools=[TOOLS["search"]],
#     backstory="An AI researcher who specializes in fetching and summarizing news.",
#     verbose=True,
#     memory=True,
#     allow_delegation=True,
# )

# mongo_agent = Agent(
#     llm=llm,
#     name="MongoDB Manager",
#     role="Interact with MongoDB to store and retrieve data",
#     goal="Manage MongoDB operations efficiently",
#     tools=[TOOLS["mongodb"]],
#     backstory="A database expert skilled in handling MongoDB operations.",
#     verbose=True,
#     memory=True,
#     allow_delegation=True,
# )

# # Export agents
# AGENTS = {
#     "input": input_agent,
#     "search": search_agent,
#     "mongodb": mongo_agent
# }
