import { useState } from "react";

const ModelSelector = ({ onSelect }) => {
  const [selectedModel, setSelectedModel] = useState("llama3.1:8b");

  const models = [
    "llama3.1:8b",
    "deepseek-r1:1.5b"
  ];

  const handleChange = (event) => {
    const model = event.target.value;
    setSelectedModel(model);
    onSelect(model); // Notify parent component
  };

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-2">Choose Model:</h3>
      <select
        className="p-2 border rounded-md w-full"
        value={selectedModel}
        onChange={handleChange}
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
