import React, { useEffect, useContext, useState } from "react";
import darwin_sense from "../assets/darwin-sense-1-unscreen.gif";
import SocketContext from "./socketContext";

const Loader = () => {
  const socketContext = useContext(SocketContext);
  const socketRef = socketContext.socket;
  const [agentThought, setAgentThought] = useState("");

  useEffect(() => {
    socketRef.current.on("agent_thought", (data) => {
      console.log("Agent Thought", data);
      setAgentThought(data.message);
    });
  }, []);

  console.log("Agent Thought", agentThought);

  return (
    <>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-80 w-screen h-full" />

      <div className="absolute inset-0 flex flex-col justify-center items-center z-100 space-y-6">
        {/* {!agentThought && ( */}
        <div className=" w-64 bg-white rounded-3xl shadow-xl flex items-center justify-center p-4">
          <img
            src={darwin_sense}
            alt="Loading..."
            className=" w-full object-contain"
          />
        </div>
        {!agentThought && (
          <div className="  bg-white rounded-xl px-6 py-4 shadow-md max-w-md text-center">
            <span className="text-blue-500 font-bold">
              
            </span>
          </div>
        )}
        {agentThought && (
          <div className="  bg-white rounded-xl px-6 py-4 shadow-md max-w-md text-center">
            <p className="text-slate-500 text-sm font-medium italic wrap">
              {agentThought}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Loader;
