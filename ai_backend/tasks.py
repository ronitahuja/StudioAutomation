from crewai import Task
from agents import AGENTS
from crewai.tasks.task_output import TaskOutput

# def is_app_absent(output: TaskOutput) -> bool:
#     if isinstance(output, str) and "No data found" in output:
#         return True
#     return False

def is_app_absent(task_outputs):
    fetch_result = task_outputs.get("fetch_app_from_mongodb_task", {})
    print(f"DEBUG: Fetch App Result - {fetch_result}")
    return not fetch_result.get("exists", False)

segregate_params_task = Task(
    description=(
        "{query} The input may contain a curl request, a user query, or both. Segregate Connection-level parameters "
        "and Transaction-level parameters from the curl request. Extract app name, app category, authentication type, "
        "and description from the request. If any of these parameters are missing, ask the user for input."
    ),
    agent=AGENTS["segregate_params_agent"],
    human_input=True,
    expected_output="""{
        "connection_level_parameters": {
            "param1": "value1"
        },
        "transaction_level_parameters": {
            "param2": "value2"
        },
        "app_name": "example_app",
        "app_category": "example_category",
        "authentication_type": "example_authentication",
        "description": "example_description"
    }""",
)

fetch_app_from_mongodb_task = Task(
    description="Fetch app data from MongoDB based on app name and app category.",
    agent=AGENTS["fetch_app_from_mongodb_agent"],  
    expected_output="""{
        "exists": true/false
    }""",
    output_key="fetch_app_from_mongodb_task" 
)

return_new_app_details_task = Task(
    description=(
        "If the app is not present in MongoDB, build the app details from the request and return them. "
        "If anything is missing, ask the user for the missing details."
    ),
    agent=AGENTS["return_new_app_details_agent"],

    condition=lambda task_outputs: print(task_outputs),
    expected_output="""{
        "app_name": "example_app",
        "app_category": "example_category",
        "authentication_type": "example_authentication",
        "description": "example_description",
        "connection_level_parameters": [
            {
                "param_name": "value1",
                "param_type": "Text/Number/Boolean",
                "mandatory": true/false,
                "sensitive": true/false,
                "description": "Parameter description",
                "variable_name": "variable_name"
            },
            {
                "param_name": "value2",
                "param_type": "Text/Number/Boolean",
                "mandatory": true/false,
                "sensitive": true/false,
                "description": "Parameter description",
                "variable_name": "variable_name"
            }
        ],
        "transaction_level_parameters": [
            {
                "param_name": "value1",
                "param_type": "Text/Number/Boolean",
                "mandatory": true/false,
                "sensitive": true/false,
                "description": "Parameter description",
                "variable_name": "variable_name"
            },
            {
                "param_name": "value2",
                "param_type": "Text/Number/Boolean",
                "mandatory": true/false,
                "sensitive": true/false,
                "description": "Parameter description",
                "variable_name": "variable_name"
            }
        ]
    }""",
    human_input=True,
    dependency=[segregate_params_task,fetch_app_from_mongodb_task], 
)

TASKS = {
    "segregate_params_task": segregate_params_task,
    "fetch_app_from_mongodb_task": fetch_app_from_mongodb_task,
    "return_new_app_details_task": return_new_app_details_task,
}
