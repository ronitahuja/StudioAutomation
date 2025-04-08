from crewai import Crew,Process,LLM
from tasks import TASKS
from agents import AGENTS

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure OpenAI API key exists (even if it's not used)
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "dummy_key")

@app.get('/')
async def ping():
    return {"message": "Hiii"}


@app.post("/api/user_prompt")
async def get_prompt(request: Request):
    llm = LLM(model="ollama/llama3.1:8b", base_url="http://localhost:11434")

    data = await request.json()
    prompt = data.get("prompt")

    if not prompt:
        return {"error": "Prompt is required"}

    user_input = prompt.lower()


    crew = Crew(
        agents=list(AGENTS.values()), 
        tasks=list(TASKS.values()),
        
    )

    results = crew.kickoff(inputs={"query": user_input})

    return {"app": results}

