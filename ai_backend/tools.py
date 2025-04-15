# import os
# from crewai_tools import SerperDevTool
# from custom_tools.insert_app_in_mongodb_tool import insert_app_in_mongodb_tool
# from custom_tools.take_input_tool import take_input_tool
# from custom_tools.fetch_app_from_mongodb_tool import fetch_app_from_mongodb_tool
# import threading
# import queue

# # Web Search Tool
# serper_tool = SerperDevTool(api_key=os.getenv("SERPER_API_KEY"))

# # Export tools
# TOOLS = {
#     "search_tool": serper_tool,
#     "insert_app_in_mongodb_tool": insert_app_in_mongodb_tool,
#     "fetch_app_from_mongodb_tool": fetch_app_from_mongodb_tool,
#     "take_input_tool": take_input_tool
# }

# class WaitForInputException(Exception):
#     """Exception raised when waiting for user input via WebSocket"""
#     def __init__(self, prompt):
#         self.prompt = prompt
#         super().__init__(f"Waiting for user input: {prompt}")

# class WebSocketInputTool:
#     """Tool to get input from the user via WebSocket"""
#     _input_queue = {}  # Dictionary to store input queues per session
#     _prompt_event = {}  # Dictionary to store events per session

#     @classmethod
#     def request_input(cls, prompt, session_id):
#         # Create a queue and event for this session if they don't exist
#         if session_id not in cls._input_queue:
#             cls._input_queue[session_id] = queue.Queue()
#             cls._prompt_event[session_id] = threading.Event()
#         while not cls._input_queue[session_id].empty():
#             try:
#                 cls._input_queue[session_id].get_nowait()
#             except queue.Empty:
#                 break
        
#         # Reset the event
#         cls._prompt_event[session_id].clear()
#         raise WaitForInputException(prompt)
    
#     @classmethod
#     def provide_input(cls, session_id, user_input):
#         """Provide input from the user"""
#         if session_id in cls._input_queue:
#             cls._input_queue[session_id].put(user_input)
#             cls._prompt_event[session_id].set()
#             return True
#         return False
    
#     @classmethod
#     def get_input(cls, session_id, timeout=None):
#         """Get input from the queue (used after handling the exception)"""
#         if session_id in cls._input_queue and cls._prompt_event[session_id].wait(timeout):
#             try:
#                 return cls._input_queue[session_id].get(block=False)
#             except queue.Empty:
#                 return None
#         return None
    
# def get_user_input(prompt, session_id=None):
#     """Function to be used by agents to get user input"""
#     print("inside get_user_input")
#     if session_id:
#         return WebSocketInputTool.request_input(prompt, session_id)
#     else:
#         # Fallback to terminal input if no session_id provided
#         return input(prompt)

import os
import threading
import queue
from crewai_tools import SerperDevTool
from custom_tools.insert_app_in_mongodb_tool import insert_app_in_mongodb_tool
from custom_tools.take_input_tool import take_input_tool
from custom_tools.fetch_app_from_mongodb_tool import fetch_app_from_mongodb_tool

serper_tool = SerperDevTool(api_key=os.getenv("SERPER_API_KEY"))

TOOLS = {
    "search_tool": serper_tool,
    "insert_app_in_mongodb_tool": insert_app_in_mongodb_tool,
    "fetch_app_from_mongodb_tool": fetch_app_from_mongodb_tool,
    "take_input_tool": take_input_tool,
}

class WaitForInputException(Exception):
    def __init__(self, prompt):
        self.prompt = prompt
        super().__init__(f"Waiting for user input: {prompt}")

class WebSocketInputTool:
    _input_queue = {}
    _prompt_event = {}

    @classmethod
    def request_input(cls, prompt, session_id):
        if session_id not in cls._input_queue:
            cls._input_queue[session_id] = queue.Queue()
            cls._prompt_event[session_id] = threading.Event()

        while not cls._input_queue[session_id].empty():
            try:
                cls._input_queue[session_id].get_nowait()
            except queue.Empty:
                break

        cls._prompt_event[session_id].clear()
        raise WaitForInputException(prompt)

    @classmethod
    def provide_input(cls, session_id, user_input):
        if session_id in cls._input_queue:
            cls._input_queue[session_id].put(user_input)
            cls._prompt_event[session_id].set()
            return True
        return False

    @classmethod
    def get_input(cls, session_id, timeout=None):
        if session_id in cls._input_queue and cls._prompt_event[session_id].wait(timeout):
            try:
                return cls._input_queue[session_id].get(block=False)
            except queue.Empty:
                return None
        return None

def get_user_input(prompt, session_id=None):
    print("inside get_user_input")
    if session_id:
        return WebSocketInputTool.request_input(prompt, session_id)
    else:
        return input(prompt)
