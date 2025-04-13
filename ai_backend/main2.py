
# from flask import Flask, render_template
# from flask_socketio import SocketIO, emit
# from crewai import Crew, Agent, Task,Process

# from agents import AGENTS
# from tasks import TASKS

# app = Flask(__name__)
# socketio = SocketIO(app)
# global_socketio=socketio

# @app.route('/')
# def index():
#     return render_template('index.html')

# input_received = False
# user_input = None



# agents = list(AGENTS.values())
# tasks = list(TASKS.values())
# print(type(agents))
# print("----------------------")
# print(type(tasks[0]))
# print(type(agents[0]))

# def run_crew():
#     global input_received, user_input
#     crew = Crew(
#         agents=[agents[0], agents[1], agents[2], agents[3], agents[4], agents[5]],
#         tasks=[tasks[0], tasks[1], tasks[2]],
#         process=Process.sequential,
#         verbose=True,
#         event_listeners=[InteractiveListener()]
#     )
#     print('hehhhhhhhhhhhhhhhh')
#     print(crew.tasks)
#     # Request input for each task
#     for task in crew.tasks:
#         print(f"Task type: {type(task)}")
#         socketio.emit('request_input', {'message': f"Input needed for task: {task.description}"})
        
#         while not input_received:
#             socketio.sleep(1)
        
#         input_received = False
#         # task.context = user_input
#         print("idharrrrrrrrrrrrrrrr")
#         # print(task.context)
#         user_input = None

#     # Execute all tasks
#     result = crew.kickoff()

#     return result

# @socketio.on('provide_answer')
# def handle_answer(data):
#     import context
#     context.user_answer = data['answer']
#     context.waiting_event.set()

# if __name__ == '__main__':
#     socketio.start_background_task(run_crew)
#     socketio.run(app, debug=True)

# from flask import Flask, render_template
# from flask_socketio import SocketIO, emit
# from crewai import Crew, Process

# from agents import AGENTS
# from tasks import TASKS
# from context import user_answer, waiting_event

# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins='*')
# global_socketio = socketio  # Used inside take_input_tool

# # Store globally for reuse in take_input_tool
# agents = list(AGENTS.values())
# tasks = list(TASKS.values())

# @app.route('/')
# def index():
#     return render_template('index.html')


# @socketio.on('start_crew')
# def handle_start_crew():
#     socketio.start_background_task(run_crew)


# @socketio.on('provide_answer')
# def handle_answer(data):
#     from context import waiting_event, user_answer
#     user_answer = data['answer']
#     waiting_event.set()


# def run_crew():
#     crew = Crew(
#         agents=agents[:6],            # Adjust number as per your setup
#         tasks=tasks[:3],              # Adjust number as per your setup
#         process=Process.sequential,
#         verbose=True,
#     )

#     try:
#         result = crew.kickoff()
#         socketio.emit('crew_completed', {'output': result})
#     except Exception as e:
#         socketio.emit('crew_error', {'error': str(e)})


# if __name__ == '__main__':
#     socketio.run(app, debug=True)


from flask import Flask, render_template
from socket_manager import socketio  # import socketio from here
from crewai import Crew, Process

from agents import AGENTS
from tasks import TASKS


app = Flask(__name__)
socketio.init_app(app, cors_allowed_origins='*')  # initialize with app


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('start_crew')
def handle_start_crew():
    socketio.start_background_task(run_crew)


@socketio.on('provide_answer')
def handle_answer(data):
    print(f"Received answer from frontend: {data['answer']}")
    print("comingggggg hereeeee")
    import context
    context.user_answer = data['answer']
    print(f"Setting user_answer to: {context.user_answer}")
    context.waiting_event.set()


def run_crew():
    agents = list(AGENTS.values())
    tasks = list(TASKS.values())
    crew = Crew(
        agents=agents[:6],
        tasks=tasks[:3],
        process=Process.sequential,
        verbose=True,
    )

    try:
        for task in crew.tasks:
            print(f"[TASK] Description: {task.description}")
            print(f"[TASK] Context: {task.context}")
        result = crew.kickoff()
        socketio.emit('crew_completed', {'output': result})
    except Exception as e:
        socketio.emit('crew_error', {'error': str(e)})


if __name__ == '__main__':
    socketio.run(app, debug=True)
