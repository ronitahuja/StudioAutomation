import os
from crewai import Agent
from tools import TOOLS
from dotenv import load_dotenv


load_dotenv()

# Input Agent (Asks for missing info)
llm="groq/meta-llama/llama-4-scout-17b-16e-instruct"
api_key=os.getenv("GROQ_API_KEY")
input_agent = Agent(
    llm=llm,
    api_key=api_key,
    name="Input Collector",
    role="Gather missing information from the user",
    goal="Ensure all required details are collected before executing tasks",
    tools=[TOOLS["input"]],
    backstory="A helpful assistant that asks for missing credentials or details before proceeding.",
    verbose=True,
    memory=True,
    allow_delegation=True,
    max_iter=1
)

# Search Agent
search_agent = Agent(
    llm=llm,
    api_key=api_key,
    name="Search AI",
    role="Fetch relevant news headlines",
    goal="Provide relevant news headlines based on user queries",
    tools=[TOOLS['search']],
    backstory="An AI researcher who specializes in fetching anews headlines.",
    verbose=True,
    memory=True,
    allow_delegation=True,
    max_iter=1
)

#insert_in_mongodb_agent
insert_in_mongodb_agent = Agent(
    llm=llm,
    api_key=api_key,
    name="MongoDB Manager",
    role="Interact with insert_in_mongodb_tool and store data.",
    goal="insert data in MongoDB",
    tools=[TOOLS['insert_in_mongodb_tool']],
    backstory=(
        "A database expert skilled in inserting data into MongoDB. "
        "All tools are already hardcoded with credentials. "
        "The insert_in_mongodb_tool expects data in the format of [{{'key': 'value'}}, {{'key': 'value'}}]. "
        "Ensure JSON validity before insertion. Handle errors gracefully and log failures."
    ),
    verbose=True,
    memory=True,
    allow_delegation=True,
    max_iter=1
)

# Export agents
AGENTS = {
    "input": input_agent,
    "search": search_agent,
    "insert_in_mongodb_agent": insert_in_mongodb_agent
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
