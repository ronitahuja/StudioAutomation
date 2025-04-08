# import os
# from crewai import Agent
# from tools import TOOLS
# from dotenv import load_dotenv


# load_dotenv()

# # Input Agent (Asks for missing info)
# input_agent = Agent(
#     llm="groq/llama-3.3-70b-specdec",
#     api_key=os.getenv("GROQ_API_KEY"),
#     name="Input Collector",
#     role="Gather missing information from the user",
#     goal="Ensure all required details are collected before executing tasks",
#     tools=[TOOLS["input"]],
#     backstory="A helpful assistant that asks for missing credentials or details before proceeding."
# )

# # Search Agent
# search_agent = Agent(
#     llm="groq/llama-3.3-70b-specdec",
#     api_key=os.getenv("GROQ_API_KEY"),
#     name="Search AI",
#     role="Fetch relevant news and summarize",
#     goal="Provide summarized news based on user queries",
#     tools=[TOOLS['search']],
#     backstory="An AI researcher who specializes in fetching and summarizing news."
# )

# # MongoDB Agent
# mongo_agent = Agent(
#     llm="groq/llama-3.3-70b-specdec",
#     api_key=os.getenv("GROQ_API_KEY"),
#     name="MongoDB Manager",
#     role="Interact with MongoDB to store and retrieve data",
#     goal="Manage MongoDB operations efficiently",
#     tools=[TOOLS['mongo']],
#     backstory="A database expert skilled in handling MongoDB operations."
# )

# # Export agents
# AGENTS = {
#     # "input": input_agent,
#     "search": search_agent,
#     "mongo": mongo_agent
# }





import os
from crewai import Agent
from tools import TOOLS
from dotenv import load_dotenv
import litellm
from crewai import LLM

llm = LLM(model="ollama/llama3.1:8b", base_url="http://localhost:11434")

load_dotenv()

# Ensure OpenAI API key exists (even if it's not used)
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "dummy_key")


input_agent = Agent(
    llm=llm,
    name="Input Collector",
    role="Gather missing information from the user",
    goal="Ensure all required details are collected before executing tasks",
    tools=[TOOLS["input"]],
    backstory="A helpful assistant that asks for missing credentials or details before proceeding.",
    
)

search_agent = Agent(
    llm=llm,
    name="Search AI",
    role="Fetch relevant news and summarize",
    goal="Provide summarized news based on user queries",
    tools=[TOOLS["search"]],
    backstory="An AI researcher who specializes in fetching and summarizing news.",
  
)

mongo_agent = Agent(
    llm=llm,
    name="MongoDB Manager",
    role="Interact with MongoDB to store and retrieve data",
    goal="Manage MongoDB operations efficiently",
    tools=[TOOLS["mongodb"]],
    backstory="A database expert skilled in handling MongoDB operations.",
    
)

# Export agents
AGENTS = {
    "input": input_agent,
    "search": search_agent,
    "mongodb": mongo_agent
}
