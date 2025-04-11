# from crewai import Task
# from agents import AGENTS
# from crewai.tasks.task_output import TaskOutput


# def is_app_absent(task_outputs):
#     fetch_result = task_outputs.get("fetch_app_from_mongodb_task", {})
#     print(f"DEBUG: Fetch App Result - {fetch_result}")
#     return not fetch_result.get("exists", False)

# segregate_params_task = Task(
#     description=(
#         "{query} The input may contain a curl request, a user query, or both. Segregate Connection-level parameters and Transaction-level parameters from the curl request."
#         "Connection-level parameters are those that are required to establish a connection with the app, while Transaction-level parameters are those that are used to perform specific transactions or operations within the app."
#         "if any url is present in the request , then check whether the connection level and transaction level parameters are present in the url or not."
#         "Extract app name, app category, authentication type and description  from the request...generally its present in the request "
#         "If any of these parameters are missing, ask the user for input. Check the query properly and then only ask for input."
#     ),
#     agent=AGENTS["segregate_params_agent"],
#     human_input=True,
#     expected_output="""{
#         "connection_level_parameters": {
#             "param1": "value1"
#         },
#         "transaction_level_parameters": {
#             "param2": "value2"
#         },
#         "app_name": "example_app",
#         "app_category": "example_category(it must belong to (payroll,finance,travel,retail))",
#         "authentication_type": "example_authentication",
#         "description": "example_description"
#     }""",
# )

# fetch_app_from_mongodb_task = Task(
#     description="Fetch app data from MongoDB based on app name and app category.",
#     agent=AGENTS["fetch_app_from_mongodb_agent"],  
#     expected_output="""{
#         "exists": true/false
#     }""",
#     output_key="fetch_app_from_mongodb_task" 
# )

# return_new_app_details_task = Task(
#     description=(
#         "If the app is not present in MongoDB, build the app details from the request and return them. "
#         "If anything is missing, ask the user for the missing details."
#         "No need to create the app if it exists(means exists:true). If it exists just dont return anything and end your task."
#         "To create the app, you will get details conneection_level_parameters, transaction_level_parameters, app_name, app_category, authentication_type and description from the previous task."
#         "Now you need to divide each connection_level_parameters and transaction_level_parameters into \"paramName\": \"value1\",\"paramType\": \"Text/Number/Boolean\",\"mandatory\": true/false,\"sensitive\": true/false,\"description\": \"Parameter description\",\"variableName\": \"variable_name\""
#         "then return the app details in the following format:"
#         """
#         {
#         "appName": "example_app",
#         "appCategory": "example_category",
#         "authenticationType": "example_authentication",
#         "appDescription": "example_description",
#         "connectionLevelParamFields": [
#             {
#                 "paramName": "value1",
#                 "paramType": "Text/Number/Boolean",
#                 "mandatory": true/false,
#                 "sensitive": true/false,
#                 "description": "Parameter description",
#                 "variableName": "variable_name"
#             }
#         ],
#         "transcationLevelParamFields": [
#             {
#                "paramName": "value1",
#                 "paramType": "Text/Number/Boolean",
#                 "mandatory": true/false,
#                 "sensitive": true/false,
#                 "description": "Parameter description",
#                 "variableName": "variable_name"
#             }
#         ]
#     }
#         """
#     ),
#     agent=AGENTS["return_new_app_details_agent"],

#     condition=is_app_absent,
#     expected_output="""{
#         "appName": "example_app",
#         "appCategory": "example_category",
#         "authenticationType": "example_authentication",
#         "appDescription": "example_description",
#         "connectionLevelParamFields": [
#             {
#                 "paramName": "value1",
#                 "paramType": "Text/Number/Boolean",
#                 "mandatory": true/false,
#                 "sensitive": true/false,
#                 "description": "Parameter description",
#                 "variableName": "variable_name"
#             }
#         ],
#         "transcationLevelParamFields": [
#             {
#                "paramName": "value1",
#                 "paramType": "Text/Number/Boolean",
#                 "mandatory": true/false,
#                 "sensitive": true/false,
#                 "description": "Parameter description",
#                 "variableName": "variable_name"
#             }
#         ]
#     }""",
#     human_input=True,
#     dependency=[segregate_params_task,fetch_app_from_mongodb_task], 
#     context=[segregate_params_task,fetch_app_from_mongodb_task],
# )

# TASKS = {
#     "segregate_params_task": segregate_params_task,
#     "fetch_app_from_mongodb_task": fetch_app_from_mongodb_task,
#     "return_new_app_details_task": return_new_app_details_task,
# }

from crewai import Task
from agents import AGENTS
from crewai.tasks.task_output import TaskOutput


def is_app_absent(task_outputs):
    fetch_result = task_outputs.get("fetch_app_from_mongodb_task", {})
    print(f"DEBUG: Fetch App Result - {fetch_result}")
    return not fetch_result.get("exists", False)

segregate_params_task = Task(
    description=(
        "{query} The input may contain a curl request, a user query, or both. Segregate Connection-level parameters and Transaction-level parameters from the curl request."
        "Connection-level parameters are those that are required to establish a connection with the app, while Transaction-level parameters are those that are used to perform specific transactions or operations within the app."
        "if any url is present in the request , then check whether the connection level and transaction level parameters are present in the url or not."
        "Extract app name, app category, authentication type and description  from the request...generally its present in the request "
        "If any of these parameters are missing, ask the user for input. Check the query properly and then only ask for input."
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
        "app_category": "example_category(it must belong to (payroll,finance,travel,retail))",
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

# Create a formatted JSON string representation with escaped braces
json_example = (
    'Format example:\\n'
    '{\\n'
    '    "appName": "example_app",\\n'
    '    "appCategory": "example_category",\\n'
    '    "authenticationType": "example_authentication",\\n'
    '    "appDescription": "example_description",\\n'
    '    "connectionLevelParamFields": [\\n'
    '        {\\n'
    '            "paramName": "value1",\\n'
    '            "paramType": "Text/Number/Boolean",\\n'
    '            "mandatory": true/false,\\n'
    '            "sensitive": true/false,\\n'
    '            "description": "Parameter description",\\n'
    '            "variableName": "variable_name"\\n'
    '        }\\n'
    '    ],\\n'
    '    "transcationLevelParamFields": [\\n'
    '        {\\n'
    '           "paramName": "value1",\\n'
    '            "paramType": "Text/Number/Boolean",\\n'
    '            "mandatory": true/false,\\n'
    '            "sensitive": true/false,\\n'
    '            "description": "Parameter description",\\n'
    '            "variableName": "variable_name"\\n'
    '        }\\n'
    '    ]\\n'
    '}\\n'
)

return_new_app_details_task = Task(
    description=(
        "If the app is not present in MongoDB, build the app details from the request and return them. "
        "If anything is missing, ask the user for the missing details. "
        "No need to create the app if it exists(means exists:true). If it exists just dont return anything and end your task. "
        "To create the app, you will get details conneection_level_parameters, transaction_level_parameters, app_name, app_category, authentication_type and description from the previous task. "
        "Now you need to divide each connection_level_parameters and transaction_level_parameters into \"paramName\": \"value1\",\"paramType\": \"Text/Number/Boolean\",\"mandatory\": true/false,\"sensitive\": true/false,\"description\": \"Parameter description\",\"variableName\": \"variable_name\" "
        "then return the app details in the following format: " + json_example
    ),
    agent=AGENTS["return_new_app_details_agent"],
    condition=is_app_absent,
    expected_output="""{
        "appName": "example_app",
        "appCategory": "example_category",
        "authenticationType": "example_authentication",
        "appDescription": "example_description",
        "connectionLevelParamFields": [
            {
                "paramName": "value1",
                "paramType": "Text/Number/Boolean",
                "mandatory": true/false,
                "sensitive": true/false,
                "description": "Parameter description",
                "variableName": "variable_name"
            }
        ],
        "transcationLevelParamFields": [
            {
               "paramName": "value1",
                "paramType": "Text/Number/Boolean",
                "mandatory": true/false,
                "sensitive": true/false,
                "description": "Parameter description",
                "variableName": "variable_name"
            }
        ]
    }""",
    human_input=True,
    dependency=[segregate_params_task,fetch_app_from_mongodb_task], 
    context=[segregate_params_task,fetch_app_from_mongodb_task],
)

TASKS = {
    "segregate_params_task": segregate_params_task,
    "fetch_app_from_mongodb_task": fetch_app_from_mongodb_task,
    "return_new_app_details_task": return_new_app_details_task,
}