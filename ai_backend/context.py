# from flask_socketio import SocketIO
# from threading import Event

# user_answer = None
# waiting_event = Event()
# socketio: SocketIO = None

# context.py
from threading import Event

user_answer = None
waiting_event = Event()
