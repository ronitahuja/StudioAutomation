import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const ApplicationAIAgent = ({ setData, sendData }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  const [currQuestion, setCurrentQuestion] = useState("");

  useEffect(() => {}, [currQuestion]);

  useEffect(() => {
    socketRef.current = io("http://localhost:8000");

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    socketRef.current.on("agent_question", (data) => {
      console.log("Received from server:", data);
      setCurrentQuestion(data.question);
      setShowSidebar(true);
      setLoading(false);
    });

    socketRef.current.on("crew_completed", (data) => {
      console.log("Received from server:", data["output"]);
      setFirstTime(false);
      setShowSidebar(false);
      setLoading(false);
      setData(data["output"]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSend = async () => {
    if (!prompt.trim()) return alert("Please enter a prompt");
    setLoading(true);
    try {
      console.log(prompt);
      if (!firstTime) {
        const payload = {
          prompt,
          currState: {
            appName: localStorage.getItem("appName"),
            authenticationType: localStorage.getItem("authenticationType"),
            appDescription: localStorage.getItem("appDescription"),
            appCategory: localStorage.getItem("appCategory"),
            connectionLevelParamFields: localStorage.getItem(
              "ConnectionLevelParamFields"
            ),
            transactionLevelParamFields: localStorage.getItem(
              "TransactionLevelParamFields"
            ),
          },
        };
        socketRef.current.emit("start_crew", payload);
        setFirstTime(true);
      } else {
        const currState={
            appName: localStorage.getItem("appName"),
            authenticationType: localStorage.getItem("authenticationType"),
            appDescription: localStorage.getItem("appDescription"),
            appCategory: localStorage.getItem("appCategory"),
            connectionLevelParamFields: localStorage.getItem(
              "ConnectionLevelParamFields"
            ),
            transactionLevelParamFields: localStorage.getItem(
              "TransactionLevelParamFields"
            ),
          }
        socketRef.current.emit("provide_answer", {
          answer: {prompt,currState}
        });
      }
      setPrompt("");
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-10 w-[400px] h-screen ">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-full  bg-gray-800 text-white p-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">App Builder</h2>
            <button
              className="text-gray-300 hover:text-white"
              onClick={() => setShowSidebar(false)}
            >
              ✖
            </button>
          </div>
          {currQuestion && (
            <p className=" border-2 rounded p-2  bg-blue-1000 mb-4 text-white">
              {currQuestion}
            </p>
          )}
          <textarea
            className="w-full h-64 p-3 rounded-md text-black resize-none"
            placeholder="Enter prompt to create application..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button
            onClick={handleSend}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      )}

      {!showSidebar && (
        <div className="flex-1  p-2 absolute ">
          <button
            className=" bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
            onClick={() => setShowSidebar(true)}
          >
            ☰ Show Sidebar
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationAIAgent;
