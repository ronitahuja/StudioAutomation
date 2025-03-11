def get_prompt(query):
    prompt = f"""
        **TASK:**
        You are an AI scraper designed to extract specific information from the given website. Follow the instructions carefully to ensure accurate and predictable results.

        **INPUT:**
        The provided website may contain the following information:
        - Authentication Type (e.g., 'No Auth', 'OAuth 2.0', 'Basic Auth')
        - App Description
        - Connection Level Params (structured details about connection parameters)

        The provided query contains the following:
        - Application Name
        - Application Category

        **EXPECTED OUTPUT:**
        Return a **JSON** response with the following structure:
        ```json
        {{
            "data": {{
                "appName": "<applicationName>",
                "appCategory": "<applicationCategory>",
                "authenticationType": "<authenticationType>",
                "appDescription": "<appDescription>",
                "connectionLevelParamFields": [
                    {{
                        "paramName": "<paramName>",
                        "paramType": "<paramType>",
                        "mandatory": <true/false>,
                        "sensitive": <true/false>,
                        "variableName": "<variableName>",
                        "description": "<description>"
                    }}
                ]
            }}
        }}
        ```
        **INSTRUCTIONS:**
        1. Extract data **exactly** as presented on the website. If a field is missing, exclude it from the response.
        2. Maintain the **JSON structure** strictly as provided above — no extra fields or modifications.
        3. Ensure **connection_parameters** strictly follows the format mentioned — no extra fields should be added.
        4. If a required value is missing or unavailable, exclude it from the output (do not provide null or empty values).
        5. The JSON response should contain **no explanations**, comments, or extra text — just the structured JSON output.
        
        **QUERY DETAILS:**
        {query}
    """
    return prompt
