import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "lucide-react";
import ParamTable from "./PramTable";

function App() {
    const [rows, setRows] = useState([]);
    const [appName, setAppName] = useState("");
    const [appCategory, setAppCategory] = useState("");
    const [authType, setAuthenticationType] = useState("");
    const [description, setDescription] = useState("");
    const [appCategories, setAppCategories] = useState([]);
    const [authTypes, setAuthTypes] = useState([]);

    // Fetch options from the backend
    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const [categoriesRes, authTypesRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/app-categories"),
                    axios.get("http://localhost:5000/api/auth-types"),
                ]);
                setAppCategories(categoriesRes.data); // Expecting an array from backend
                setAuthTypes(authTypesRes.data);
            } catch (error) {
                console.error("Error fetching dropdown options:", error);
            }
        };
        fetchDropdownOptions();
    }, []);

    // Handle Save Button Click
    const handleSave = async () => {
        const payload = {
            appName,
            appCategory,
            authType,
            description,
            connectionParams: rows, // Connection-level parameters from table
        };

        try {
            await axios.post("http://localhost:5000/api/save-application", payload);
            alert("Application saved successfully!");
        } catch (error) {
            console.error("Error saving application:", error);
            alert("Failed to save application.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                    <h1 className="text-2xl text-purple-600 font-medium">Application</h1>

                    {/* Application Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1">
                            Application Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter application name here"
                        />

                        {/* App Category Dropdown */}
                        <label className="flex items-center gap-1">
                            App Category<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={appCategory}
                            onChange={(e) => setAppCategory(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select Application Category</option>
                            {appCategories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* Authentication Type Dropdown */}
                        <label className="flex items-center gap-1">
                            Authentication Type<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={authType}
                            onChange={(e) => setAuthenticationType(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select Authentication Type</option>
                            {authTypes.map((auth) => (
                                <option key={auth.id} value={auth.name}>
                                    {auth.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* App Description */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1">
                            App Description<span className="text-red-500">*</span>
                        </label>
                        <div className="border rounded-md">
                            <div className="flex items-center gap-1 border-b p-2">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <Link size={16} />
                                </button>
                            </div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 min-h-[100px] resize-none"
                                placeholder="Enter description..."
                            />
                        </div>
                    </div>

                    {/* Connection Parameters Table */}
                    <div className="space-y-2">
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Connection Level Param Fields
                            </h3>
                            <ParamTable rows={rows} setRows={setRows} />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                    <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                        CANCEL
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        SAVE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
