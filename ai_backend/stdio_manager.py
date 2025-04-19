import re
import io
from socket_manager import socketio

ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')

class StreamToSocket(io.StringIO):
    def write(self, msg):
        clean_msg = ansi_escape.sub('', msg)
        if clean_msg.strip():
            socketio.emit('agent_thought', {'message': clean_msg})
        super().write(msg)
