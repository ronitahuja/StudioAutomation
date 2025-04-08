from crewai import Task
from agents import AGENTS


# Task to take user input **only if needed**
input_task = Task(
    description="Collect missing MongoDB credentials and user query details, if not already provided.",
    agent=AGENTS["input"],
    expected_output="User input successfully collected or skipped if already available.",

)


# Task to fetch news
search_task = Task(
    description="Fetch and summarize the latest news based on user input.",
    agent=AGENTS["search"],
    expected_output="A clear and concise news summary.",
)

# Task to store news in MongoDB
store_task = Task(
    description="Store data into MongoDB.",
    agent=AGENTS["mongodb"],
    expected_output="Articles successfully stored in MongoDB.",
   
)

# Export tasks
TASKS = {
    "input": input_task,
    "search": search_task,
    "store": store_task
}
