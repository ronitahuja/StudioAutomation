import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { llm_query } from "../constants/llm-api";
import ModalSelector from "./ModalSelector";

const CodeEditor = ({ transactionRows , connectionRows}) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("python");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(null);
  const [inputValue, setInputvalue] = useState("");
  const [aiCode, setAiCode] = useState("");
  const [isAiResponseVisible, setIsAiResponseVisible] = useState(false);
  const [model, setModel] = useState("llama3.1:8b");
  const [output,setOutput] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputValue.trim()) return;

    setLoading(true);
    setAiCode("");
    setIsAiResponseVisible(true);

    try {

      const response = await fetch(llm_query, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  // ✅ Fixed JSON body serialization
          query: inputValue,
          connectionLevelParamFields: connectionRows,
          transactionLevelParamFields: transactionRows,
          model: model,
        }),
      });
     

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
   

      setAiCode(data.data || "No response received");

    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setLoading(false);
      setInputvalue("");
    }
  };

  const runCode = ()=>{
      try{
        //const result = eval(code);
        setOutput(String(result));
      }
      catch(error){
        setOutput(String(error));
      }
  }

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (editorRef.current) {
          const editor = editorRef.current;
          const selection = editor.getSelection();
          const pos = editor.getScrolledVisiblePosition(selection);
          setPosition(pos);
          setIsModalOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };

  }, []);
  useEffect(() => {
    if (aiCode) {
      setIsModalOpen(false);
    }
  }, [aiCode])
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="fixed top-[80px] right-[25px] p-5 border rounded-lg shadow-lg bg-white w-2/5 h-4/5 flex flex-col">
      {/* Code Editor */}

      <div className="p-6">
        <ModalSelector onSelect={setModel} />

      </div>

      <div className="border rounded flex-grow overflow-hidden relative">
        <div className="flex justify-end mt-2 space-x-2">
          {/* <button
            onClick={runCode}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
          >
            Run Code
          </button> */}
        </div>
        <Editor
          height="100%"
          theme="light"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{ minimap: { enabled: false } }}
        />

        {/* In-Editor Modal */}
        {isModalOpen && position && (
          <div
            className="absolute bg-white p-3 rounded-lg shadow-lg border w-96 left-78px"
            style={{
              top: position.top + 20,
              left: position.left,
            }}
          >
            <h2 className="text-sm font-bold mb-2">Write a Query</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                type="text"
                value={inputValue}
                onChange={(e) => setInputvalue(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Type your question..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 bg-gray-300 rounded text-sm"
                >
                  Close
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm" type="submit" disabled={loading}> {loading ? "Loading..." : "Generate"}
                </button>
              </div>
            </form>

          </div>
        )}
      </div>
      {isAiResponseVisible && (
        <div className="mt-4 p-3 border rounded-lg shadow-lg max-h-[300px] bg-gray-100 w-full overflow-auto relative">
          <h2 className="text-sm font-bold mb-2">AI Response</h2>
          <pre className="bg-gray-800 text-green-400 p-2 rounded-lg overflow-auto relative">
            {aiCode || (loading ? "Generating code..." : "No response yet.")}
          </pre>
          {aiCode && (
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  if (editorRef.current) {
                    editorRef.current.setValue(aiCode); // Insert AI-generated code into the editor
                    setIsAiResponseVisible(false); // Hide AI response after accepting
                  }
                }}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                Accept
              </button>

              <button
                onClick={() => {
                  setAiCode(""); // Clear AI response
                  setIsAiResponseVisible(false); // Hide AI response section
                }}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(aiCode);
                  alert("Code copied!");
                }}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
              >
                Copy
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default CodeEditor;
