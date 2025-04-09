from crewai import Crew, Process, LLM
from tasks import TASKS
from agents import AGENTS

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()
app = Flask(__name__)
CORS(app)

# Ensure OpenAI API key exists
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")

@app.route('/', methods=['GET'])
def ping():
    return jsonify({"message": "Hiii"})

@app.route('/api/user_prompt', methods=['POST'])
def get_prompt():
    llm = LLM(model="ollama/llama3.1:8b", base_url="http://localhost:11434")

    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    user_input = prompt.lower()

    crew = Crew(
        agents=list(AGENTS.values()), 
        tasks=list(TASKS.values()),
        memory=True,
        cache=True,
        share_crew=True,
        manager_llm="groq/llama-3.3-70b-specdec",
        process=Process.hierarchical
    )

    # Run crew.kickoff() synchronously if it's async
    # try:
    #     results = asyncio.run(crew.kickoff(inputs={"query": user_input}))
    # except RuntimeError:  # Handles case where event loop is already running
    #     loop = asyncio.new_event_loop()
    #     asyncio.set_event_loop(loop)
    results = crew.kickoff(inputs={"query": user_input})

    # return jsonify({"app": results})
    # Convert CrewOutput to a dictionary
    # if hasattr(results, "dict"):  # If CrewOutput has a `dict()` method
    #     results = results.dict()
    # elif hasattr(results, "__dict__"):  # If CrewOutput has `__dict__`
    #     results = results.__dict__

    return 1


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
