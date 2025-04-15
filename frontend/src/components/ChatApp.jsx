// // ChatApp.js
// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// // import './ChatApp.css';

// const SOCKET_SERVER_URL = 'http://localhost:8000';

// function ChatApp() {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isConnected, setIsConnected] = useState(false);
//   const [isWaitingForInput, setIsWaitingForInput] = useState(false);
//   const [promptQuestion, setPromptQuestion] = useState('');
//   const [isAgentThinking, setIsAgentThinking] = useState(false);

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     // Initialize socket connection
//     const newSocket = io(SOCKET_SERVER_URL);
//     setSocket(newSocket);

//     // Clean up the socket connection on unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!socket) return;

//     // Connection status events
//     socket.on('connect', () => {
//       console.log('Connected to server');
//       setIsConnected(true);
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//       setIsConnected(false);
//     });

//     // Agent message events
//     socket.on('system_message', (data) => {
//       addMessage('system', data.message);
    
//     });

//     socket.on('agent_response', (data) => {
//       setIsAgentThinking(false);
      
//       if (data.data) {
//         // Handle JSON data
//         addMessage('agent', data.message);
//         addMessage('agent-data', data.data);
//       } else {
//         // Handle plain text
//         addMessage('agent', data.message);
//       }
//     });

//     socket.on('agent_thinking', (data) => {
//       setIsAgentThinking(true);
//       addMessage('agent-thinking', data.message);
//     });

//     socket.on('agent_prompt', (data) => {
//       setIsWaitingForInput(true);
//       setPromptQuestion(data.prompt);
//       addMessage('agent-prompt', data.prompt);
//     });

//     socket.on('error', (data) => {
//       addMessage('error', data.message);
//     });

//     return () => {
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.off('system_message');
//       socket.off('agent_response');
//       socket.off('agent_thinking');
//       socket.off('agent_prompt');
//       socket.off('error');
//     };
//   }, [socket]);

//   // Auto-scroll to bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const addMessage = (type, content) => {
//     setMessages((prevMessages) => [...prevMessages, { type, content, timestamp: new Date() }]);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const messageText = input;
//     setInput('');

//     // Add user message to chat
//     addMessage('user', messageText);

//     // Send message to server
//     if (isWaitingForInput) {
//       socket.emit('user_input_reply', { reply: messageText });
//       setIsWaitingForInput(false);
//       setPromptQuestion('');
//     } else {
//       socket.emit('user_message', { message: messageText });
//     }
//   };

//   const formatJSONOutput = (data) => {
//     try {
//       return (
//         <pre className="json-output">
//           {JSON.stringify(data, null, 2)}
//         </pre>
//       );
//     } catch (error) {
//       return <span>{String(data)}</span>;
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <h2>Agent Chat</h2>
//         <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
//           {isConnected ? 'Connected' : 'Disconnected'}
//         </div>
//       </div>
      
//       <div className="messages-container">
//         {messages.map((message, index) => (
//           <div 
//             key={index} 
//             className={`message ${message.type}`}
//           >
//             {message.type === 'agent-data' ? (
//               formatJSONOutput(message.content)
//             ) : (
//               <p>{message.content}</p>
//             )}
//             <span className="timestamp">
//               {message.timestamp.toLocaleTimeString()}
//             </span>
//           </div>
//         ))}
//         {isAgentThinking && (
//           <div className="thinking-indicator">
//             <span>.</span><span>.</span><span>.</span>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
      
//       <form onSubmit={handleSubmit} className="input-form">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder={isWaitingForInput ? promptQuestion : "Type your message..."}
//           className={isWaitingForInput ? 'input-required' : ''}
//           disabled={!isConnected}
//         />
//         <button type="submit" disabled={!isConnected || !input.trim()}>
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ChatApp;

// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// const SOCKET_SERVER_URL = 'http://localhost:5000'; // Update to match your Flask server

// function ChatApp() {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isConnected, setIsConnected] = useState(false);
//   const [isWaitingForInput, setIsWaitingForInput] = useState(false);
//   const [promptQuestion, setPromptQuestion] = useState('');
//   const [isAgentThinking, setIsAgentThinking] = useState(false);

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     // Initialize socket connection
//     const newSocket = io(SOCKET_SERVER_URL);
//     setSocket(newSocket);

//     // Clean up the socket connection on unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!socket) return;

//     // Connection status events
//     socket.on('connect', () => {
//       console.log('Connected to server');
//       setIsConnected(true);
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//       setIsConnected(false);
//     });

//     // Agent message events
//     socket.on('system_message', (data) => {
//       addMessage('system', data.message);
//     });

//     socket.on('agent_response', (data) => {
//       setIsAgentThinking(false);

//       if (data.data) {
//         // Handle JSON data
//         addMessage('agent', data.message);
//         addMessage('agent-data', data.data);
//       } else {
//         // Handle plain text
//         addMessage('agent', data.message);
//       }
//     });

//     socket.on('agent_thinking', (data) => {
//       setIsAgentThinking(true);
//       addMessage('agent-thinking', data.message);
//     });

//     socket.on('agent_prompt', (data) => {
//       setIsWaitingForInput(true);
//       setPromptQuestion(data.prompt);
//       addMessage('agent-prompt', data.prompt);
//     });

//     socket.on('error', (data) => {
//       addMessage('error', data.message);
//     });

//     return () => {
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.off('system_message');
//       socket.off('agent_response');
//       socket.off('agent_thinking');
//       socket.off('agent_prompt');
//       socket.off('error');
//     };
//   }, [socket]);

//   // Auto-scroll to bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const addMessage = (type, content) => {
//     setMessages((prevMessages) => [...prevMessages, { type, content, timestamp: new Date() }]);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const messageText = input;
//     setInput('');

//     // Add user message to chat
//     addMessage('user', messageText);

//     // Send message to server based on whether we're waiting for input
//     if (isWaitingForInput) {
//       socket.emit('user_input_reply', { reply: messageText });
//       setIsWaitingForInput(false);
//       setPromptQuestion('');
//     } else {
//       socket.emit('user_message', { message: messageText });
//     }
//   };

//   const formatJSONOutput = (data) => {
//     try {
//       return (
//         <pre className="json-output">
//           {JSON.stringify(data, null, 2)}
//         </pre>
//       );
//     } catch (error) {
//       return <span>{String(data)}</span>;
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <h2>Agent Chat</h2>
//         <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
//           {isConnected ? 'Connected' : 'Disconnected'}
//         </div>
//       </div>
      
//       <div className="messages-container">
//         {messages.map((message, index) => (
//           <div 
//             key={index} 
//             className={`message ${message.type}`}
//           >
//             {message.type === 'agent-data' ? (
//               formatJSONOutput(message.content)
//             ) : (
//               <p>{message.content}</p>
//             )}
//             <span className="timestamp">
//               {message.timestamp.toLocaleTimeString()}
//             </span>
//           </div>
//         ))}
//         {isAgentThinking && (
//           <div className="thinking-indicator">
//             <span>.</span><span>.</span><span>.</span>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
      
//       <form onSubmit={handleSubmit} className="input-form">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder={isWaitingForInput ? promptQuestion : "Type your message..."}
//           className={isWaitingForInput ? 'input-required' : ''}
//           disabled={!isConnected}
//         />
//         <button type="submit" disabled={!isConnected || !input.trim()}>
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ChatApp;

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:8000');
    
    // Set up event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });
    
    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });
    
    // Handle messages from AI agents
    socketRef.current.on('agent_message', (data) => {
      setMessages(prevMessages => [...prevMessages, { 
        text: data.message, 
        sender: data.agent_name || 'AI', 
        timestamp: new Date().toISOString() 
      }]);
      setIsLoading(false);
    });
    
    // Clean up on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startCrew = () => {
    setIsLoading(true);
    socketRef.current.emit('start_crew', {});
    setMessages(prevMessages => [...prevMessages, { 
      text: "Starting AI conversation...", 
      sender: "System", 
      timestamp: new Date().toISOString() 
    }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, { 
      text: inputText, 
      sender: 'User', 
      timestamp: new Date().toISOString() 
    }]);
    
    // Send message to server
    socketRef.current.emit('user_input', { input: inputText });
    setInputText('');
    setIsLoading(true);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-gray-50">
      <header className="bg-blue-600 text-white p-4 rounded-t-lg shadow-md">
        <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
        <div className="text-sm mt-1">
          Status: {isConnected ? 
            <span className="text-green-300">Connected</span> : 
            <span className="text-red-300">Disconnected</span>}
        </div>
      </header>
      
      <div className="flex-grow overflow-auto p-4 bg-white rounded-b-lg shadow-md mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="mb-4">No messages yet</p>
            <button 
              onClick={startCrew} 
              disabled={!isConnected || isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              Start Conversation with AI
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-3/4 rounded-lg p-3 ${
                    msg.sender === 'User' 
                      ? 'bg-blue-500 text-white' 
                      : msg.sender === 'System' 
                        ? 'bg-gray-300 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.sender !== 'User' && (
                    <div className="font-bold text-sm mb-1">{msg.sender}</div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className="text-xs mt-1 opacity-70">{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="mr-2">AI is thinking</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '250ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '500ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          disabled={!isConnected || (messages.length === 0 && !isLoading)}
          className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button 
          type="submit" 
          disabled={!isConnected || !inputText.trim() || (messages.length === 0 && !isLoading)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatApp;