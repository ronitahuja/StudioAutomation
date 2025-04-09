from crewai import Task
from agents import AGENTS

# Task to store news in MongoDB
store_task = Task(
    description="Store data into MongoDB. All credentials are hardcoded.",
    agent=AGENTS["insert_in_mongodb_agent"],
    expected_output="Articles successfully stored in MongoDB.",
    # dependencies=[search_task],
)

# Task to take user input **only if needed**
# input_task = Task(
#     description="Take user input if and only if required. Mostly everything is provided.",
#     agent=AGENTS["input"],
#     expected_output="User input successfully collected or skipped if already available.",  
# )


# Task to fetch news
search_task = Task(
    description="Fetch latest news headlines based on user input.",
    agent=AGENTS["search"],
    expected_output="A clear and concise news headlines.",
    # dependencies=[input_task],
)

# # Task to store news in MongoDB
# store_task = Task(
#     description="Store data into MongoDB. All credentials are hardcoded.",
#     agent=AGENTS["insert_in_mongodb_agent"],
#     expected_output="Articles successfully stored in MongoDB.",
#     # dependencies=[search_task],
# )

# Export tasks
TASKS = {
    # "input": input_task,
    "search": search_task,
    "store": store_task
}
