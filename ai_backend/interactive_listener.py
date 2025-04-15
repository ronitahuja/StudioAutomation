from crewai.utilities.events import (
    CrewKickoffStartedEvent,
    AgentExecutionStartedEvent,
    AgentExecutionCompletedEvent,
    CrewKickoffCompletedEvent
)
from crewai.utilities.events.base_event_listener import BaseEventListener

from tools import WebSocketInputTool


class InteractiveListener(BaseEventListener):
    def __init__(self, session_id,socketio):
        self.session_id = session_id  # Save session ID for socket communication
        self.socketio = socketio  # Save socketio instance for emitting events

        
    def setup_listeners(self, crewai_event_bus):
        @crewai_event_bus.on(CrewKickoffStartedEvent)
        def on_crew_started(source, event):
            self.socketio.emit('agent_status', {
                'message': "🚀 Crew execution started. Agents are kicking off..."
            }, to=self.session_id)
        
        @crewai_event_bus.on(AgentExecutionStartedEvent)
        def on_agent_started(source, event):
            # Ask frontend user for additional input if needed
            self.socketio.emit('agent_prompt', {
                'prompt': f"🤖 Agent '{event.agent.role}' is starting task:\n{event.task.description}\nYou can provide more input if you'd like.",
                'agent': event.agent.role,
                'task': event.task.description
            }, to=self.session_id)

        @crewai_event_bus.on(AgentExecutionCompletedEvent)
        def on_agent_completed(source, event):
            # Send agent result to the frontend
            self.socketio.emit('agent_response', {
                'message': f"✅ Agent '{event.agent.role}' completed its task.",
                'result': event.output
            }, to=self.session_id)

        @crewai_event_bus.on(CrewKickoffCompletedEvent)
        def on_crew_completed(source, event):
            self.socketio.emit('agent_status', {
                'message': "🎉 Crew execution completed.",
                'final_output': event.output
            }, to=self.session_id)

