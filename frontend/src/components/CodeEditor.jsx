import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import { Brain } from "lucide-react";
import { llm_query } from "../constants/llm-api";
import models from "../constants/models";
import DropDown from "./DropDown";
import themes from "../constants/themes";
import languages from "../constants/languages";
import LikeDislike from "./LikeDislike";
import axios from "axios";
import * as monaco from "monaco-editor";

const CodeEditor = ({
  transactionRows,
  connectionRows,
  appActionName,
  applicationName,
  onCodeChange, // New prop to send code back to parent
  onLanguageChange, // New prop to send language back to parent
}) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null); // Reference for the textarea
  const currentSuggestionRef = useRef(null);
  const [code, setCode] = useState(localStorage.getItem("code") || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(null);
  const [inputValue, setInputvalue] = useState("");
  const [aiCode, setAiCode] = useState("");
  const [isAiResponseVisible, setIsAiResponseVisible] = useState(true);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [decorationIds, setDecorationIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [model, setModel] = useState(() => {
    const storedModel = localStorage.getItem("model");
    if (storedModel) {
      const foundModel = models.find((m) => m.name === storedModel);
      return foundModel;
    }
    return models.find((m) => m.name === "llama-3.3-70b-specdec") || models[0];
  });
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      const foundTheme = themes.find((t) => t.name === storedTheme);
      if (foundTheme) {
        return foundTheme;
      }
    }
    return themes[0] || "";
  });
  const [language, setLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      const foundLanguage = languages.find((l) => l.name === storedLanguage);
      if (foundLanguage) {
        return foundLanguage;
      }
    }
    return languages[0] || "";
  });

  useEffect(() => {
    if (currentSuggestion) {
      currentSuggestionRef.current = currentSuggestion;
    }
  }, [currentSuggestionRef]);

  const getAISuggestions = async (code) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const response = await axios.post(
      "http://localhost:3000/api/v1/autocomplete/query",
      {
        currentCode: code,
        applicationName: applicationName,
        language: language,
        appActionName: appActionName,
      },
      { withCredentials: true }
    );
    return response.data.code;
  };

  const acceptSuggestion = () => {
    if (!editorRef.current || !currentSuggestionRef.current) return;

    const position = editorRef.current.getPosition();
    if (!position) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    editorRef.current.executeEdits("ai-suggestion", [
      {
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        },
        text: currentSuggestionRef.current,
        forceMoveMarkers: true,
      },
    ]);


    clearDecorations();
    setCurrentSuggestion(null);
    currentSuggestionRef.current = null;
  };

  const clearDecorations = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const oldDecorations = decorationIds;
    setDecorationIds(editor.deltaDecorations(oldDecorations, []));
  };

  const debouncedSuggestions = useCallback(
    debounce(async (code, position) => {
      try {
        setIsLoading(true);
  
        // Clear previous suggestion reference before fetching new one
        currentSuggestionRef.current = "";
  
        const suggestion = await getAISuggestions(code, position);
        setCurrentSuggestion(suggestion);
  
        currentSuggestionRef.current = suggestion;
        console.log(currentSuggestionRef.current);
  
        if (!editorRef.current ) return;
  
        const model = editorRef.current.getModel();
        if (!model) return;
  
        // Clear previous decorations
        if (decorationIds.length > 0) {
          setDecorationIds([]);
          editorRef.current.deltaDecorations(decorationIds, []);
        }
  
        // Ensure position values are correct
        const editorPosition = editorRef.current.getPosition();
        if (!editorPosition) return;
  
        const newDecorations = editorRef.current.deltaDecorations(
          [],
          [
            {
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              },
              options: {
                after: {
                  content: currentSuggestionRef.current,
                  inlineClassName: "ai-suggestion",
                },
              },
            },
          ]
        );
  
        setDecorationIds(newDecorations);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1000), 
    [editorRef.current, decorationIds]
  );
  useEffect(()=>{
    currentSuggestionRef.current = "";
  },[])

  // Save state to localStorage
  useEffect(() => {
    if (code !== "") localStorage.setItem("code", code);
  }, [code]);

  useEffect(() => {
    if (model?.name) {
      localStorage.setItem("model", model.name);
    }
  }, [model]);

  useEffect(() => {
    if (theme?.name) {
      localStorage.setItem("theme", theme.name);
    }
  }, [theme]);
  useEffect(() => {
    if (language?.name) {
      localStorage.setItem("language", language.name);
    }
  }, [language]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputValue.trim()) return;

    setLoading(true);
    setAiCode("");
    setIsAiResponseVisible(true);

    try {
      const modelValue = typeof model === "object" ? model.name : model;
      const response = await fetch(llm_query, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          query: inputValue,
          connectionLevelParamFields: connectionRows,
          transactionLevelParamFields: transactionRows,
          model: modelValue,
          language: typeof language === "object" ? language.name : language, // Same for language,
          appActionName: appActionName,
          applicationName: applicationName,
          currentCode: code,
        }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setAiCode(data.data || "No response received");
    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setLoading(false);
      setInputvalue("");
    }
  };

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

  // Focus the textarea when the modal opens
  useEffect(() => {
    if (isModalOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (aiCode) {
      setIsModalOpen(false);
    }
  }, [aiCode]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  
    // Add AI suggestion style
    const style = document.createElement("style");
    style.textContent = `
      .ai-suggestion {
        opacity: 0.4;
        font-style: italic;
        color: #666;
      }
    `;
    document.head.appendChild(style);
  
    editor.addCommand(monaco.KeyCode.Tab, () => {
      if (currentSuggestionRef.current) {
        acceptSuggestion();
        return null;
      }
      return false;
    });
  };
  
  // Handle code changes and propagate to parent component
  const handleEditorChange = (value) => {
    if (value.trim() === "") localStorage.setItem("code", "");
    if (!value || !editorRef.current) return;
  
    // Capture position at the start to ensure accuracy
    const position = editorRef.current.getPosition();
    if (!position) return;
  
    debouncedSuggestions(value, position);
  
    setCode(value || "");
  
    if (onCodeChange) {
      onCodeChange(value || "");
    }
  };
  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage); // Update local state

    // Pass the updated language to parent component
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <div className="top-[80px] right-[25px] p-5 border rounded-lg shadow-lg bg-white w-5/5 h-full flex flex-col">
      {/* Code Editor */}
      <div className="absolute top-[80px] right-2 z-10 flex items-center gap-2 bg-grey-600/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {isLoading && (
          <>
            <Brain className="w-4 h-4 animate-pulse text-blue-500" />
            <span className="text-sm text-gray-600">AI is thinking...</span>
          </>
        )}
        {currentSuggestion && !isLoading && (
          <span className="text-sm text-gray-600">
            Press Tab to accept suggestion
          </span>
        )}
      </div>
      <div className="p-2 border rounded-lg shadow-md bg-gray-100">
        <DropDown
          onSelect={setModel}
          models={models}
          topic={"Model"}
          selected={model}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="py-1 px-2 border rounded-lg shadow-md bg-gray-100 h-auto">
          <DropDown
            onSelect={setTheme}
            models={themes}
            topic={"Theme"}
            selected={theme}
          />
        </div>

        <div className="py-1 px-2 border rounded-lg shadow-md bg-gray-100 h-auto">
          <DropDown
            onSelect={handleLanguageChange}
            models={languages}
            topic={"Language"}
            selected={language}
          />
        </div>
      </div>

      <div className="border rounded flex-grow overflow-hidden relative">
        <Editor
          height="100%"
          theme={theme?.name || theme}
          defaultLanguage={language?.name || language}
          language={language?.name || language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            quickSuggestions: true,
            acceptSuggestionOnEnter: "on",
            autoClosingBrackets: "always",
            snippetSuggestions: "inline",
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 10, bottom: 10 },
            placeholder:
              "Press Ctrl + k to ask DarwinAI to do something. Start typing to dismiss.",
          }}
          className="border rounded-2xl shadow-lg p-2 bg-white w-full h-full max-w-full max-h-full"
        />

        {/* In-Editor Modal */}
        {isModalOpen && position && (
          <div
            className="absolute bg-white p-3 rounded-lg shadow-lg border w-96"
            style={{ top: position.top + 20, left: position.left }}
          >
            <h2 className="text-sm font-bold mb-2">Write a Query</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef} // Attach the ref to the textarea
                value={inputValue}
                onChange={(e) => setInputvalue(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Type your question..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 bg-gray-300 rounded text-sm"
                >
                  Close
                </button>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {isAiResponseVisible && (loading || aiCode) && (
        <div className="mt-4 p-3 border rounded-lg shadow-lg max-h-[300px] bg-white w-full overflow-auto relative">
          <h2 className="text-sm font-bold mb-2">AI Response</h2>
          <pre className="bg-white text-blue-1000 p-2 rounded-lg overflow-auto relative">
            {loading ? "Generating code..." : aiCode || "No response yet."}
          </pre>
          {aiCode && (
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  if (editorRef.current) {
                    const editor = editorRef.current;
                    const position = editor.getPosition();

                    // Insert AI-generated code at cursor position
                    editor.executeEdits(null, [
                      {
                        range: new monaco.Range(
                          position.lineNumber,
                          1,
                          position.lineNumber,
                          1
                        ),
                        text: aiCode + "\n",
                        forceMoveMarkers: true,
                      },
                    ]);

                    // Move cursor to the next line
                    editor.setPosition(
                      new monaco.Position(
                        position.lineNumber + aiCode.split("\n").length,
                        1
                      )
                    );

                    // Send updated code to parent component
                    const updatedCode = editor.getValue();
                    setCode(updatedCode);
                    if (onCodeChange) {
                      onCodeChange(updatedCode);
                    }

                    setIsAiResponseVisible(false); // Hide AI response after inserting
                  }
                }}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  setAiCode(""); // Clear AI response
                  setIsAiResponseVisible(false);
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
      <LikeDislike modelName={model} />
    </div>
  );
};

CodeEditor.propTypes = {
  transactionRows: PropTypes.array.isRequired,
  connectionRows: PropTypes.array.isRequired,
  appActionName: PropTypes.string.isRequired,
  applicationName: PropTypes.string.isRequired,
  onCodeChange: PropTypes.func,
  onLanguageChange: PropTypes.func,
};

export default CodeEditor;
 