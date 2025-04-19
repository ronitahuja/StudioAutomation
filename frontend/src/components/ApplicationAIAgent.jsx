import React, { useState, useRef, useEffect, useContext, use } from "react";
import SocketContext from "./socketContext";

const ApplicationAIAgent = () => {
  const socketContext = useContext(SocketContext);

  const socketRef = socketContext.socket;
  const [showSidebar, setShowSidebar] = [
    socketContext.showSidebar,
    socketContext.setShowSidebar,
  ];
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = [
    socketContext.loading,
    socketContext.setLoading,
  ];
  const [isConnected, setIsConnected] = [
    socketContext.isConnected,
    socketContext.setIsConnected,
  ];
  const [firstTime, setFirstTime] = [
    socketContext.firstTime,
    socketContext.setFirstTime,
  ];
  const [currQuestion, setCurrentQuestion] = [
    socketContext.currQuestion,
    socketContext.setCurrentQuestion,
  ];
  const [loader, setLoader] = [socketContext.loader, socketContext.setLoader];

  useEffect(() => {}, [socketContext.currQuestion]);

  const handleSend = async () => {
    if (!prompt.trim()) return alert("Please enter a prompt");
    setLoader(true);
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
          sid: socketRef.current.id,
        };
        socketRef.current.emit("start_crew", payload);
        setFirstTime(true);
      } else {
        const currState = {
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
        };
        socketRef.current.emit("provide_answer", {
          answer: { prompt, currState},
        });
      }
      setPrompt("");
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("frontend_disconnect");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex mt-10 w-[400px]">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-full bg-gray-800 text-white p-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">StudioAutomation</h2>
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
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
            ☰ Chat With DarwinAI
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationAIAgent;
