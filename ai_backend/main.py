from crewai import Crew, Process, LLM
from tasks import TASKS
from agents import AGENTS
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource


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

content = "we have to accompolish a task where we will get some input in the form of curl request or user query. the user query may contain curl request or user query or both. we have to segregate the connection level parameters and transaction level parameters from the curl request. we have to extract app name, app category, authentication type and description from the request. if any of these parameters are missing we will ask the user for input. then we will fetch the app data from mongodb based on app name and app category. if the app is not present in mongodb we will build the app details from the request and return them. if anything is missing we will ask the user for the missing details." 
string_source = StringKnowledgeSource(
    content=content,
)

@app.route('/', methods=['GET'])
def ping():
    return jsonify({"message": "Hiii"})

@app.route('/api/user_prompt', methods=['POST'])
def get_prompt():
    try:
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
            knowledge_sources=[string_source],
            # manager_llm="groq/llama-3.3-70b-specdec",
            # process=Process.hierarchical
        )

        results = crew.kickoff_for_each(inputs=[{"query": user_input}])

        return jsonify({"message": "Execution complete", "results": str(results)}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()  # Logs full error traceback
        return jsonify({"error": str(e)}), 500

# def get_prompt():

#     data = request.get_json()
#     prompt = data.get("prompt")

#     if not prompt:
#         return jsonify({"error": "Prompt is required"}), 400

#     user_input = prompt.lower()

#     crew = Crew(
#         agents=list(AGENTS.values()), 
#         tasks=list(TASKS.values()),
#         memory=True,
#         cache=True,
#         share_crew=True,
#         manager_llm="groq/llama-3.3-70b-specdec",
#         process=Process.hierarchical
#     )

#     results = crew.kickoff(inputs={"query": user_input})
#     return 1

    


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
