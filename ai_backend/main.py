# # from crewai import Crew, Process, LLM
# # from tasks import TASKS
# # from agents import AGENTS
# # from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource


# # from flask import Flask, request, jsonify
# # from flask_cors import CORS
# # from dotenv import load_dotenv
# # import os
# # import asyncio
# # import json
# # from flask import render_template # type: ignore
# # from flask_socketio import SocketIO,send,emit # type: ignore
# # from tools import WaitForInputException,WebSocketInputTool
# # import threading
# # import traceback


# # load_dotenv()

# # app = Flask(__name__)

# # app.config['SECRET_KEY'] = 'secret!'
# # socketio = SocketIO(app,cors_allowed_origins="*") # type: ignore

# # CORS(app)

# # # Ensure OpenAI API key exists
# # os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")

# # content = "we have to accompolish a task where we will get some input in the form of curl request or user query. the user query may contain curl request or user query or both. we have to segregate the connection level parameters and transaction level parameters from the curl request. we have to extract app name, app category, authentication type and description from the request. if any of these parameters are missing we will ask the user for input. then we will fetch the app data from mongodb based on app name and app category. if the app is not present in mongodb we will build the app details from the request and return them. if anything is missing we will ask the user for the missing details." 
# # string_source = StringKnowledgeSource(content=content)

# # active_crews = {} # Dictionary to store active crews

# # def create_crew(session_id):
# #     """Create a new crew instance for a session"""
# #     def patched_input(prompt):
# #         from tools import get_user_input
# #         print("I am inside tis create crew")
# #         return get_user_input(prompt, session_id)
    
# #     # Get the agent instances
# #     agent_instances = list(AGENTS.values())
# #     print("-----------------agent instances------------------")
# #     print(agent_instances)
# #     # Patch the input function for each agent before creating the crew
# #     for agent in agent_instances:
# #         # agent.human_input = True 
        
# #         agent._input = patched_input
# #         print(f"_input set for {agent.role}: {hasattr(agent, '_input')}")
# #     #creae the crew with the patched input 
# #     crew=Crew(
# #         agents=list(AGENTS.values()), 
# #         tasks=list(TASKS.values()),
# #         memory=True,
# #         cache=True,
# #         share_crew=True,
# #         knowledge_sources=[string_source],
# #         # Uncomment if needed:
# #         # manager_llm="groq/llama-3.3-70b-specdec",
# #         # process=Process.hierarchical
# #         inputs = {"session_id": session_id},
# #     )
# #     print("-----------------crew------------------")
# #     print(type(crew))
# #     print(crew.agents)
# #     # for agent in crew.agents:
# #     #     print("--------------agent-----------------")
# #     #     print(agent)
# #     #     agent._input = patched_input

# #     return crew





# # @socketio.on('connect')  #registers an event handler for connect event
# # def handle_connect():
# #     print('Client connected')
# #     emit('system_message',{'messsage':'Connected to agent server.How can I help you?'})

# # @socketio.on('disconnect')
# # def handle_disconnect():
# #     print('Client disconnected')

# # @socketio.on('user_message')
# # def handle_user_message(data):
# #     print("---------data----------")
# #     print(data)
# #     session_id = request.sid
# #     message = data.get('message','')
# #     print(f"Received message from {session_id}: {message}")

# #     #stream a thinking message to the client
# #     emit('agent_thinking',{'message':'Agent is thinking...'})

# #     print("-----------------active crews------------------")
# #     print(active_crews)
# #     try:
# #         #create or get existing crew for this session
# #         if session_id not in active_crews:
            
# #             active_crews[session_id] = create_crew(session_id)
# #             print("Creating new crew for session:", session_id)
# #             print(active_crews[session_id])
# #         crew = active_crews[session_id]

# #         #start a background task thread to run the crew
# #         def run_crew():
# #             try:
# #                 print("---------------------------Starting crewAI work-----------------------------")
# #                 result = crew.kickoff(inputs ={"query": message,"session_id": session_id})
# #                 print("---------------------------CrewAI work completed-----------------------------")
# #                 print(result)
# #                 if isinstance(result.raw, str):
# #                     try:
# #                         json_result = json.loads(result.raw)
# #                         socketio.emit('agent_response',{
# #                             'message': 'Here are the details I extracted:',
# #                             'data': json_result
# #                         }, to=session_id)
# #                     except json.JSONDecodeError:
# #                         socketio.emit('agent_response', {'message': result.raw}, to=session_id)
# #                 else:
# #                     socketio.emit('agent_response', {'message': str(result)}, to=session_id)
# #             except WaitForInputException as e:
# #                 socketio.emit('agent_prompt', {'prompt': e.prompt}, to=session_id)

# #                 # Wait for input in this thread (will be provided by the user_input_reply handler)
# #                 # This is just to keep this thread alive
# #                 WebSocketInputTool.get_input(session_id)


# #                 # Continue with the crew workflow
# #                 run_crew()  # Recursively continue after input
            
# #             except Exception as e:
# #                 traceback.print_exc()
# #                 socketio.emit('error', {'message': f"Error processing your request: {str(e)}"}, to=session_id)
            
# #         # Start the crew in a separate thread
# #         thread = threading.Thread(target=run_crew)
# #         thread.daemon = True
# #         thread.start()
    
   
# #         # try:
# #         #     print("Starting crewAI work")
# #         #     results = crew.kickoff_for_each(inputs=[{"query": message}])
# #         #     print("CrewAI work completed")
# #         #     result = results[0]

# #         #     if isinstance(result.raw,str):
# #         #         try:
# #         #             json_result = json.loads(result.raw)
# #         #             emit('agent_response',{
# #         #                 'message': 'Here are the details I extracted:',
# #         #                 'data': json_result
# #         #             })
# #         #         except json.JSONDecodeError:
# #         #             emit('agent_response', {'message': result.raw})
# #         #     else:
# #         #         emit('agent_response',{'message':str(result)})
# #         # except WaitForInputException as e:
# #         #     emit('agent_prompt', {'prompt': e.prompt})
# #     except Exception as e:
# #         traceback.print_exc()  # Logs full error traceback
# #         emit('error', {'message': f"Error processing your request: {str(e)}"})

# # # @socketio.on('user_message')
# # # async def handle_user_message(message):
# # #     # Create the crew for this session
# # #     print("i am here ")
# # #     session_id = request.sid
# # #     crew = create_crew(session_id)

# # #     async def run_crew():
# # #         try:
# # #             result = await asyncio.to_thread(
# # #                 crew.kickoff,
# # #                 inputs={"query": message, "session_id": session_id}
# # #             )
# # #             if isinstance(result.raw, str):
# # #                 try:
# # #                     json_result = json.loads(result.raw)
# # #                     await socketio.emit('agent_response', {
# # #                         'message': 'Here are the details I extracted:',
# # #                         'data': json_result
# # #                     }, to=session_id)
# # #                 except json.JSONDecodeError:
# # #                     await socketio.emit('agent_response', {
# # #                         'message': result.raw
# # #                     }, to=session_id)
# # #             else:
# # #                 await socketio.emit('agent_response', {
# # #                     'message': str(result)
# # #                 }, to=session_id)
# # #         except WaitForInputException as e:
# # #             import traceback
# # #             traceback.print_exc()
# # #             await socketio.emit('error', {
# # #                 'message': f"Error processing your request: {str(e)}"
# # #             }, to=session_id)
# # #     await run_crew()


# # @socketio.on('user_prompt')
# # def handle_user_prompt(data):
# #     prompt = data.get("prompt")
# #     print(f"Received user prompt: {prompt}")

# #     #starting crewAI work
# #     try:
# #         result = Crew.kickoff_for_each(inputs=[{"query": prompt}])
# #         emit('result',{'result':result})
# #     except WaitForInputException as e:
# #         emit('waiting_for_input', {'prompt': e.prompt})

# # @socketio.on('user_input_reply')
# # def handle_user_input_reply(data):
# #     print("------------------------User input reply-----------")
# #     print(data)
# #     session_id = request.sid
# #     user_reply = data.get("reply",'')
# #     print(f"Received input reply from {session_id}: {user_reply}")

# #     # Provide the input to the WebSocketInputTool
# #     if WebSocketInputTool.provide_input(session_id, user_reply):
# #         emit('agent_response', {'message': f"Thanks for providing that information. Processing..."})
# #     else:
# #         emit('error', {'message': "No active request waiting for input"})

# # @app.route('/chat')
# # def index():
# #     return render_template('index.html')

# # @socketio.on('message')
# # def handle_message(msg):
# #     print('Message: ' + msg)
# #     send(msg,broadcast=True)

# # @app.route('/', methods=['GET'])
# # def ping():
# #     return jsonify({"message": "Hiii"})

# # @app.route('/api/user_prompt', methods=['POST'])
# # def get_prompt():
# #     try:
# #         data = request.get_json()
# #         prompt = data.get("prompt")

# #         if not prompt:
# #             return jsonify({"error": "Prompt is required"}), 400

# #         user_input = prompt.lower()

# #         crew = Crew(
# #             agents=list(AGENTS.values()), 
# #             tasks=list(TASKS.values()),
# #             memory=True,
# #             cache=True,
# #             share_crew=True,
# #             knowledge_sources=[string_source],
# #             # manager_llm="groq/llama-3.3-70b-specdec",
# #             # process=Process.hierarchical
# #         )

# #         results = crew.kickoff_for_each(inputs=[{"query": user_input}])
# #         results=results[0]
# #         print(results)

# #         if isinstance(results.raw,str):
# #             json_result = json.loads(results.raw)
# #             print(json_result)
# #             return jsonify({"message": "Execution complete", "results": json_result}), 200
        
# #         # json_result = {
# #         #     "appName": "example_app",
# #         #     "appCategory": "example_category",
# #         #     "authenticationType": "example_authentication",
# #         #     "appDescription": "example_description",
# #         #     "connectionLevelParamFields": [
# #         #         {
# #         #             "paramName": "value1",
# #         #             "paramType": "Text",
# #         #             "mandatory": True,
# #         #             "sensitive": False,
# #         #             "description": "Parameter description",
# #         #             "variableName": "variable_name"
# #         #         },
# #         #         {
# #         #             "paramName": "value2",
# #         #             "paramType": "Number",
# #         #             "mandatory": False,
# #         #             "sensitive": True,
# #         #             "description": "Parameter description",
# #         #             "variableName": "variable_name"
# #         #         }
# #         #     ],
# #         #     "transactionLevelParamFields": [
# #         #         {
# #         #             "paramName": "value3",
# #         #             "paramType": "Boolean",
# #         #             "mandatory": True,
# #         #             "sensitive": False,
# #         #             "description": "Parameter description",
# #         #             "variableName": "variable_name"
# #         #         },
# #         #         {
# #         #             "paramName": "value4",
# #         #             "paramType": "Text",
# #         #             "mandatory": False,
# #         #             "sensitive": True,
# #         #             "description": "Parameter description",
# #         #             "variableName": "variable_name"
# #         #         }
# #         #     ]
# #         # }
# #         # return jsonify({"message": "Execution complete", "results": json_result}), 200

# #     except Exception as e:
# #         import traceback
# #         traceback.print_exc()  # Logs full error traceback
# #         return jsonify({"error": str(e)}), 500

# # # def get_prompt():

# # #     data = request.get_json()
# # #     prompt = data.get("prompt")

# # #     if not prompt:
# # #         return jsonify({"error": "Prompt is required"}), 400

# # #     user_input = prompt.lower()

# # #     crew = Crew(
# # #         agents=list(AGENTS.values()), 
# # #         tasks=list(TASKS.values()),
# # #         memory=True,
# # #         cache=True,
# # #         share_crew=True,
# # #         manager_llm="groq/llama-3.3-70b-specdec",
# # #         process=Process.hierarchical
# # #     )

# # #     results = crew.kickoff(inputs={"query": user_input})
# # #     return 1

    


# # if __name__ == '__main__':
# #     app.run(host="0.0.0.0", port=8000, debug=True)
# #     socketio.run(app,async_mode="asgi",debug=True)



# from flask import Flask, request, jsonify, render_template
# from flask_cors import CORS
# from flask_socketio import SocketIO, emit
# from dotenv import load_dotenv
# import os, json, threading, traceback
# from crewai import Crew
# from tasks import TASKS
# from agents import AGENTS
# from tools import WaitForInputException, WebSocketInputTool
# from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
# from agent_handler import run_crew_with_websocket, provide_user_input

# # Load environment variables
# load_dotenv()

# # Flask and SocketIO setup
# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'secret!'
# socketio = SocketIO(app, cors_allowed_origins="*")
# CORS(app)

# # OpenAI Key Setup
# os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")

# # Define static knowledge source
# crew_knowledge = StringKnowledgeSource(content="""
# we have to accomplish a task where we will get some input in the form of curl request or user query.
# The user query may contain curl request or user query or both.
# We have to segregate the connection level parameters and transaction level parameters from the curl request.
# We have to extract app name, app category, authentication type and description from the request.
# If any of these parameters are missing we will ask the user for input.
# Then we will fetch the app data from MongoDB based on app name and app category.
# If the app is not present in MongoDB, we will build the app details from the request and return them.
# If anything is missing, we will ask the user for the missing details.
# """)

# # Dictionary to store active crews by session ID
# active_crews = {}

# def create_crew(session_id):
#     def patched_input(prompt):
#         from tools import get_user_input
#         return get_user_input(prompt, session_id)

#     agents = list(AGENTS.values())
#     for agent in agents:
#         agent._input = patched_input

#     crew = Crew(
#         agents=agents,
#         tasks=list(TASKS.values()),
#         memory=True,
#         cache=True,
#         share_crew=True,
#         knowledge_sources=[crew_knowledge],
#         inputs={"session_id": session_id},
#     )
#     return crew

# # ---------------------- SOCKET.IO EVENTS ----------------------

# @socketio.on('connect')
# def handle_connect():
#     print("Client connected")
#     emit('system_message', {'message': 'Connected to agent server. How can I help you?'})

# @socketio.on('disconnect')
# def handle_disconnect():
#     print("Client disconnected")

# @socketio.on('user_message')
# def handle_user_message(data):
#     session_id = request.sid
#     message = data.get('message', '')
#     emit('agent_thinking', {'message': 'Agent is thinking...'})

#     if session_id not in active_crews:
#         active_crews[session_id] = create_crew(session_id)

#     crew = active_crews[session_id]

#     def run_crew():
#         try:
#             result = crew.kickoff(inputs={"query": message, "session_id": session_id})
#             if isinstance(result.raw, str):
#                 try:
#                     json_result = json.loads(result.raw)
#                     socketio.emit('agent_response', {
#                         'message': 'Here are the details I extracted:',
#                         'data': json_result
#                     }, to=session_id)
#                 except json.JSONDecodeError:
#                     socketio.emit('agent_response', {'message': result.raw}, to=session_id)
#             else:
#                 socketio.emit('agent_response', {'message': str(result)}, to=session_id)

#         except WaitForInputException as e:
#             socketio.emit('agent_prompt', {'prompt': e.prompt}, to=session_id)
#             WebSocketInputTool.get_input(session_id)
#             run_crew()  # Recursively continue after input

#         except Exception as e:
#             traceback.print_exc()
#             socketio.emit('error', {'message': f"Error: {str(e)}"}, to=session_id)

#     thread = threading.Thread(target=run_crew)
#     thread.daemon = True
#     thread.start()

# @socketio.on('user_input_reply')
# def handle_user_input_reply(data):
#     session_id = request.sid
#     user_reply = data.get("reply", '')
#     print(f"User input reply from {session_id}: {user_reply}")

#     if WebSocketInputTool.provide_input(session_id, user_reply):
#         emit('agent_response', {'message': "Thanks! Continuing..."})
#     else:
#         emit('error', {'message': "No active request waiting for input"})

# # ---------------------- HTTP ROUTES ----------------------

# @app.route('/')
# def ping():
#     return jsonify({"message": "Server is up!"})

# @app.route('/chat')
# def serve_chat():
#     return render_template('index.html')

# @app.route('/api/user_prompt', methods=['POST'])
# def handle_prompt_api():
#     try:
#         data = request.get_json()
#         prompt = data.get("prompt")
#         if not prompt:
#             return jsonify({"error": "Prompt is required"}), 400

#         crew = Crew(
#             agents=list(AGENTS.values()),
#             tasks=list(TASKS.values()),
#             memory=True,
#             cache=True,
#             share_crew=True,
#             knowledge_sources=[crew_knowledge]
#         )

#         results = crew.kickoff_for_each(inputs=[{"query": prompt.lower()}])
#         result = results[0]
#         if isinstance(result.raw, str):
#             try:
#                 json_result = json.loads(result.raw)
#                 return jsonify({"message": "Execution complete", "results": json_result})
#             except json.JSONDecodeError:
#                 return jsonify({"message": result.raw})
#         return jsonify({"message": str(result)})
#     except Exception as e:
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500

# # ---------------------- APP ENTRY ----------------------

# if __name__ == '__main__':
#     socketio.run(app, host="0.0.0.0", port=8000, debug=True)



from flask import Flask, request
from flask_socketio import SocketIO
from agent_handler import run_crew_with_websocket, provide_user_input

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# @socketio.on('connect')  #registers an event handler for connect event
# def handle_connect():
#     print('Client connected')
#     emit('system_message',{'messsage':'Connected to agent server.How can I help you?'})

# @socketio.on('disconnect')
# def handle_disconnect():
#     print('Client disconnected')

@socketio.on('start_crew')
def handle_start_crew(data):
    session_id = request.sid
    print("sesssionnnn iddd--------------")
    run_crew_with_websocket(session_id,socketio)

@socketio.on('user_input')
def handle_user_input(data):
    session_id = request.sid
    user_input = data.get("input")
    provide_user_input(session_id, user_input)
    run_crew_with_websocket(session_id,socketio)  # resume crew after receiving input

if __name__ == '__main__':
    socketio.run(app, port=8000)
