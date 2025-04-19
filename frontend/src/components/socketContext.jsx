import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { io } from "socket.io-client";

const SocketContext = createContext(null);

export default SocketContext;

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  const [currQuestion, setCurrentQuestion] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [rows, setRows] = useState([]);
  const [appName, setAppName] = useState("");
  const [allCat, setAllCat] = useState([]);
  const [appCategory, setAppCategory] = useState("");
  const [authenticationType, setAuthenticationType] = useState("");
  const [appDescription, setDescription] = useState("");
  const [authTypes, setAuthTypes] = useState([]);
  const [payload, setPayLoad] = useState(null);
  const [aiagentResponse, setAiagentresponse] = useState("");

  const setData = (aiagentResponse) => {
    setAppName(aiagentResponse?.appName || "");
    setAuthenticationType(aiagentResponse?.authenticationType);
    setDescription(aiagentResponse?.appDescription);
    setAppCategory(aiagentResponse?.appCategory);
    setRows(aiagentResponse?.connectionLevelParamFields);

    localStorage.setItem(
      "ConnectionLevelParamFields",
      JSON.stringify(aiagentResponse?.connectionLevelParamFields)
    );
    localStorage.setItem("appName", aiagentResponse?.appName);
    localStorage.setItem(
      "authenticationType",
      aiagentResponse?.authenticationType
    );
    localStorage.setItem("appDescription", aiagentResponse?.appDescription);
    localStorage.setItem("appCategory", aiagentResponse?.appCategory);
    localStorage.setItem(
      "authenticationType",
      aiagentResponse?.authenticationType
    );
    localStorage.setItem(
      "TransactionLevelParamFields",
      JSON.stringify(aiagentResponse?.transactionLevelParamFields)
    );
  };

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
      setLoader(false);
    });

    socketRef.current.on("crew_completed", (data) => {
      console.log("Received from server:", data["output"]);
      setFirstTime(false);
      setShowSidebar(false);
      setLoading(false);
      setLoader(false);
      setData(data["output"]);
      setCurrentQuestion("");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef,
        isConnected,
        setIsConnected,
        loader,
        setLoader,
        loading,
        setLoading,
        firstTime,
        setFirstTime,
        currQuestion,
        setCurrentQuestion,
        showSidebar,
        setShowSidebar,
        rows,
        setRows,
        appName,
        setAppName,
        allCat,
        setAllCat,
        appCategory,
        setAppCategory,
        authenticationType,
        setAuthenticationType,
        appDescription,
        setDescription,
        authTypes,
        setAuthTypes,
        payload,
        setPayLoad,
        aiagentResponse,
        setAiagentresponse,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
