from crewai import Crew
from tools import get_user_input, WebSocketInputTool, WaitForInputException
from interactive_listener import InteractiveListener
# from my_crew_setup import create_agents_and_tasks  # your custom function
from agents import AGENTS
from tasks import TASKS

# Keep track of sessions and their crews
session_crews = {}

def run_crew_with_websocket(session_id,socketio):
    agents = list(AGENTS.values())
    tasks = list(TASKS.values())
    crew = Crew(agents=agents, tasks=tasks, verbose=True)

    session_crews[session_id] = crew

    try:
        crew.kickoff()
    except WaitForInputException as e:
        print(f"Waiting for input: {e.prompt}")
        socketio.emit("awaiting_input", {"prompt": e.prompt}, to=session_id)

def provide_user_input(session_id, user_input):
    WebSocketInputTool.provide_input(session_id, user_input)
