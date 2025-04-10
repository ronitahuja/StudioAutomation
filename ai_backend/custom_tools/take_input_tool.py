from crewai.tools import tool

@tool("Take Input Tool")
def take_input_tool(prompt: str) -> str:
    """Prompts the user for input and returns their response."""
    print(f"Taking input: {prompt}")
    
    user_response = input(f"{prompt}: ")
    
    print(f"Collected input: {user_response}")
    
    return user_response  
