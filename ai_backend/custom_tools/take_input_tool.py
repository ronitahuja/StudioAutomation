# # from crewai.tools import tool

# # @tool("Take Input Tool")
# # def take_input_tool(prompt: str) -> str:
# #     """Prompts the user for input and returns their response."""
# #     print(f"Taking input: {prompt}")
    
# #     user_response = input(f"{prompt}: ")
    
# #     print(f"Collected input: {user_response}")
    
# #     return user_response  

# # from crewai.tools import tool
# # from context import socketio, user_answer, waiting_for_answer
# # import time

# # @tool("Take Input Tool")
# # def take_input_tool(prompt: str) -> str:
# #     """
# #     Emits a prompt to the frontend using SocketIO, waits for the user's response, and returns it as a string.
# #     """
# #     global user_answer, waiting_for_answer
# #     print(f"[TOOL] Asking: {prompt}")
# #     socketio.emit('agent_question', {'question': prompt})

# #     waiting_for_answer = True
# #     user_answer = None
# #     while waiting_for_answer:
# #         time.sleep(0.5)

# #     print(f"[TOOL] Got: {user_answer}")
# #     return user_answer

# from crewai.tools import tool
# from context import socketio, user_answer, waiting_event

# @tool("Take Input Tool")
# def take_input_tool(prompt: str) -> str:
#     """
#     Emits a prompt to the frontend and waits for user's input via socket.
#     """
#     print(f"[TOOL] Asking: {prompt}")
#     socketio.emit('agent_question', {'question': prompt})

#     waiting_event.clear()
#     waiting_event.wait()  # This blocks until .set() is called

#     print(f"[TOOL] Got: {user_answer}")
#     return user_answer

# from crewai.tools import tool
# from context import waiting_event, user_answer
# from main2 import global_socketio  # Make sure this doesn't cause circular import

# @tool("Take Input Tool")
# def take_input_tool(prompt: str) -> str:
#     """Prompts the user for input and waits for the response via frontend."""
#     global_socketio.emit('agent_question', {'question': prompt})
    
#     waiting_event.clear()
#     waiting_event.wait()  # Wait until frontend submits the answer
    
#     return user_answer


from crewai.tools import tool
import context
from socket_manager import socketio  # no circular import

@tool("Take Input Tool")
def take_input_tool(prompt: str) -> str:
    """Prompts the user for input and waits for the response via frontend."""
    print(f"[TOOL] Asking user: {prompt}")  # Debug print
    socketio.emit('agent_question', {'question': prompt})

    context.waiting_event.clear()
    context.waiting_event.wait()  # Pauses until frontend responds

    print(f"[TOOL] User responded: {context.user_answer}") 

    return context.user_answer if context.user_answer else "No answer received"
