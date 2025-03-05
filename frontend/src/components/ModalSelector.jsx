import { useState } from "react";
import models from "../constants/models";

const ModelSelector = ({ onSelect }) => {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (model) => {
    setSelectedModel(model);
    onSelect(model.name);
    setIsOpen(false);
  };

  return (
    <div className="p-4 border rounded-md shadow-md bg-white relative">
      <h3 className="text-lg font-semibold mb-2">Choose Model:</h3>
      <div
        className="p-2 border rounded-md w-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <img
            src={selectedModel.image}
            alt={selectedModel.name}
            className="w-6 h-6 mr-2"
          />
          <span>{selectedModel.name}</span>
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-2 w-full border rounded-md shadow-md bg-white z-10">
          {models.map((model) => (
            <div
              key={model.name}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleSelect(model)}
            >
              <img
                src={model.image}
                alt={model.name}
                className="w-6 h-6 mr-2"
              />
              <span>{model.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;