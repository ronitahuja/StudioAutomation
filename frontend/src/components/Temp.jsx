import React, { useRef, useEffect, useState, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';

// Utility function for debounce logic
const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};

const Temp = () => {
    const editorRef = useRef(null);
    const [code, setCode] = useState('');

    // Function to fetch suggestions
    const fetchSuggestions = useCallback(
        debounce(async (newCode) => {
            const response = await fetch('/api/code-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: newCode })
            });

            const data = await response.json();

            const suggestions = data.suggestions.map(suggestion => ({
                label: suggestion.label,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: suggestion.code,
                documentation: suggestion.description
            }));

            if (editorRef.current) {
                monaco.languages.registerCompletionItemProvider('javascript', {
                    provideCompletionItems: () => ({ suggestions })
                });
            }
        }, 500), // 500ms debounce for efficient API calls
        []
    );

    // Handle code changes
    const handleEditorChange = (newValue) => {
        setCode(newValue);
        fetchSuggestions(newValue); // Trigger AI suggestions
    };

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    return (
        <MonacoEditor
            height="500px"
            language="javascript"
            theme="vs-dark"
            value={code}
            options={{
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                snippetSuggestions: 'top',
            }}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}  // Trigger suggestion on every change
        />
    );
};

export default Temp;
