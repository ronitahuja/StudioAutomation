# crew.py
from crewai import Crew
from agents import AGENTS
from tasks import TASKS

def crew_builder(get_input_func, tools, session_id):
    agents = list(AGENTS.values())
    tasks = list(TASKS.values())

    # Inject input function if needed in your agents or tools
    for agent in agents:
        agent.get_input_func = get_input_func

    crew = Crew(
        agents=agents,
        tasks=tasks,
        verbose=True,
        tools=list(tools.values())
    )
    return crew
