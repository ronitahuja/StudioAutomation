from crewai import Crew, Process, LLM,Agent
from tasks import TASKS
from agents import AGENTS
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv
import os
import asyncio
import json
from contextlib import redirect_stdout

from socket_manager import socketio 
from stdio_manager import StreamToSocket

load_dotenv()
app = Flask(__name__)
CORS(app)

socketio.init_app(app, cors_allowed_origins='*')


os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")

content = """we have to accompolish a task where we will get some input in the form of curl request or user query. the prompt may contain curl request , user query or both. The user query willl also contain the current state of the application.

U have access to different agents that you can call to perform the task.

Situation-1: If the request is to create application then follow these steps:
->we have to segregate the connection level parameters and transaction level parameters from the curl request. 
->we have to extract app name, app category, authentication type , description,connection level parameters , transaction level parameters from the request. ->If any of these parameters are missing we will ask the user for input. 
->Then we will fetch the app data from mongodb based on appName and appCategory. 
->If there is no entry present in mongodb with respect to appName and appCategory ,we will need to return new app details . 
->If anything is missing we will ask the user for the missing details.

Situation-2: If the request is to update application then follow these steps:
-> You will have access to the current State JSON , you need to change the value of the current state JSON based on the user query.
-> Return the newly updated JSON.

The end ouput of any sitution will be a JSON object. Dont add any extra text or explanation.
""" 
string_source = StringKnowledgeSource(
    content=content,
)
api_key=os.getenv("OPENAI_API_KEY")
llm="openai/gpt-4.1"
manager = Agent(
    llm=llm,
    api_key=api_key,
    name="Input Collector",
    role="Senior Manager",
    goal="Delegate tasks to different agents based on the requirements of the input request.",
    backstory="I am responsible to delegate tasks to different agents by understanding the input request and its requirements.",
    # verbose=True,
    # memory=True,
    allow_delegation=True,
    # max_iter=2 
)

@app.route('/', methods=['GET'])
def ping():
    return jsonify({"message": "Hiii"})

@socketio.on('frontend_disconnect')
def handle_disconnect():
    print("Frontend disconnected")

@socketio.on('start_crew')
def start_crew(data):
    try:
        prompt = data.get("prompt")
        curr_state = data.get("currState")
        sid = data.get("sid")
        import context
        context.sid = sid

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        user_input = prompt.lower()+" currect State: "+json.dumps(curr_state)

        crew = Crew(
            agents=list(AGENTS.values()), 
            tasks=list(TASKS.values()),
            memory=True,
            cache=True,
            share_crew=True,
            knowledge_sources=[string_source],
            # manager_llm=llm,
            # process=Process.hierarchical,
            # planning=True
        )

        # results = crew.kickoff_for_each(inputs=[{"query": user_input}])
        buffer = StreamToSocket()
        with redirect_stdout(buffer):
            results = crew.kickoff_for_each(inputs=[{"query": user_input}])
        results=results[0]
        print(results)
        if isinstance(results.raw,str):
            results=results.raw
            substr=results[results.find('{') : results.rfind('}') + 1]
            json_result = json.loads(substr)
            print(json_result)
            socketio.emit('crew_completed', {'output': json_result})
        else:
            json_result = results.raw

    

    except Exception as e:
        import traceback
        traceback.print_exc()  
        return jsonify({"error": str(e)}), 500


@socketio.on('provide_answer')
def handle_answer(data):
    prompt = data.get("answer").get("prompt")
    curr_state = data.get("answer").get("currState")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    user_input = prompt.lower()+" currect State: "+json.dumps(curr_state)
    import context
    context.user_answer = user_input
    context.waiting_event.set()  

if __name__ == '__main__':
    socketio.run(app,host="0.0.0.0", port=8000, debug=True)