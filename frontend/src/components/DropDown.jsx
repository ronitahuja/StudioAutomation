import { useState ,useEffect} from "react";

const DropDown = ({ onSelect, models, topic,selected}) => {
    const [selectedModel, setSelectedModel] = useState(models[0]);
    const [isOpen, setIsOpen] = useState(false);

    // Initialize with the selected prop or try to find the saved value
  useEffect(() => {
    if (selected) {
      setSelectedModel(selected);
    } else if (topic) {
      const savedValue = localStorage.getItem(topic.toLowerCase());
      if (savedValue) {
        try {
          // For backward compatibility, try to parse JSON first
          const parsedValue = JSON.parse(savedValue);
          const modelName = typeof parsedValue === 'string' ? parsedValue : parsedValue.name;
          
          // Find the model by name
          const foundModel = models.find(m => m.name === modelName);
          if (foundModel) {
            setSelectedModel(foundModel);
            onSelect(foundModel);
          }
        } catch (e) {
          // If parsing fails, try to find the model directly by name
          const foundModel = models.find(m => m.name === savedValue);
          if (foundModel) {
            setSelectedModel(foundModel);
            onSelect(foundModel);
          }
        }
      }
    }
  }, [selected, topic, models, onSelect]);

  const handleSelect = (model) => {
    setSelectedModel(model);
    onSelect(model);
    console.log("Printing topic:", topic);
    console.log("Printing model:", model);
    console.log("Printing model name:", model.name);
    
    if (topic && typeof topic === 'string' && model && model.name) {
      localStorage.setItem(topic.toLowerCase(), model.name);
    } else {
      console.error("Invalid topic or model:", { topic, model });
    }
    
    setIsOpen(false);
  };
    return (
        <div className="p-4 border rounded-md shadow-md bg-white relative">
            <h3 className="text-lg font-semibold mb-2">Choose {topic}:</h3>
            <div
                className="p-2 border rounded-md w-full cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    {selectedModel.image && (
                        <img
                            src={selectedModel.image}
                            alt={selectedModel.name}
                            className="w-6 h-6 mr-2"
                        />
                    )}
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
                            {model.image && (
                                <img
                                    src={model.image}
                                    alt={model.name}
                                    className="w-6 h-6 mr-2"
                                />
                            )}
                            <span>{model.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropDown;