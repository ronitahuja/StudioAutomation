import React, { useCallback, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";
import { Brain } from "lucide-react";

export function CodeEditor({
  defaultLanguage = "typescript",
  defaultValue = "// Start typing to get AI suggestions...\n",
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [decorationIds, setDecorationIds] = useState([]);

  const getAISuggestions = async (code, position) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return `function calculateSum(a, b) {
    return a + b;
}`;
  };

  const acceptSuggestion = () => {
    if (!editorRef.current || !currentSuggestion) return;

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
        text: currentSuggestion,
      },
    ]);

    clearDecorations();
    setCurrentSuggestion(null);
  };

  const clearDecorations = () => {
    if (!editorRef.current) return;
    const oldDecorations = decorationIds;
    setDecorationIds(editorRef.current.deltaDecorations(oldDecorations, []));
  };

  const debouncedSuggestions = useCallback(
    debounce(async (code, position) => {
      try {
        setIsLoading(true);
        const suggestion = await getAISuggestions(code, position);
        setCurrentSuggestion(suggestion);

        if (!editorRef.current || !monacoRef.current) return;

        const model = editorRef.current.getModel();
        if (!model) return;

        clearDecorations();

        const newDecorations = editorRef.current.deltaDecorations(
          [],
          [
            {
              range: {
                startLineNumber: position.lineNumber + 1,
                startColumn: 1,
                endLineNumber: position.lineNumber + 1,
                endColumn: 1,
              },
              options: {
                after: {
                  content: `${suggestion}`,
                  inlineClassName: "ai-suggestion",
                },
              },
            },
          ]
        );

        setDecorationIds(newDecorations);
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    []
  );

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

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
      if (currentSuggestion) {
        acceptSuggestion();
        return null;
      }
      return false;
    });
  };

  const handleEditorChange = (value) => {
    if (!value || !editorRef.current) return;

    const position = editorRef.current.getPosition();
    if (!position) return;

    debouncedSuggestions(value, position);
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-gray-200">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
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
      <Editor
        height="100%"
        defaultLanguage={defaultLanguage}
        defaultValue={defaultValue}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 1.5,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          folding: true,
          lineNumbers: "on",
          renderLineHighlight: "all",
          acceptSuggestionOnEnter: "on",
        }}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </div>
  );
}
