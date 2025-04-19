from crewai.tools import tool
import context
from socket_manager import socketio  

@tool("Take Input Tool")
def take_input_tool(prompt: str) -> str:
    """Prompts the user for input and waits for the response via frontend."""
    # socketio.emit('agent_question', {'question': prompt})
    socketio.emit('agent_question', {'question': prompt}, to=context.sid)

    context.waiting_event.clear()
    context.waiting_event.wait()  

    print(f"[TOOL] User responded: {context.user_answer}") 

    return context.user_answer if context.user_answer else "No answer received"
