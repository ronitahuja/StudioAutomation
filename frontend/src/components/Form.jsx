import React, { useEffect, useState } from "react";
import ParamTable from "./PramTable";
import MonacoEditor from "./CodeEditor";
import axios from "axios";

const Form = () => {
    const [rows, setRows] = useState([]);
    const [formData, setFormData] = useState({
        actionName: "",
        language: "",
        application: "",
        details: "",
    });

    const [connectionLevelParams, setConnectionLevelParams] = useState([]);
    const [applications, setApplications] = useState([]);
    // Fetch applications from backend
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/app/appNames");

                if (Array.isArray(response.data.data)) {
                    setApplications(response.data.data);
                } else {
                    console.error("Invalid data format:", response.data);
                    setApplications([]);
                }
            } catch (error) {
                console.error("Error fetching application names:", error);
            }
        };
        fetchApplications();
    }, []);

    // Fetch Connection Level Params when an application is selected
    useEffect(() => {
        const fetchParams = async () => {
            try {
                if (!formData.application) {
                    setConnectionLevelParams([]); // Reset when no application is selected
                    return;
                }
              
                const response = await axios.get(`http://localhost:3000/api/v1/app/appNames/${formData.application}`);
                if (Array.isArray(response.data.data) && response.data.data.length>0) {
                    setConnectionLevelParams(response.data.data[0]?.connectionLevelParamFields);                    

                } else {
                    console.error("Invalid data format for params:", response.data);
                    setConnectionLevelParams([]);
                }
            } catch (error) {
                console.error("Error fetching connection level params:", error);
                setConnectionLevelParams([]);
            }
        };
        fetchParams();

    }, [formData.application]); // Runs whenever application changes



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex gap-5 p-8 mt-[50px]">
            {/* Left Side - Form */}
            <div className="w-1/2 bg-gray-100 p-8 rounded-xl shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Action Name */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700">App Action Name</label>
                        <input
                            name="actionName"
                            value={formData.actionName}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter action name"
                        />
                    </div>


                    {/* Select Application */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Application Name</label>
                        <select
                            name="application"
                            value={formData.application}
                            onChange={handleChange} // Ensure formData is updated
                            className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select an application</option>
                            {applications.map((app, index) => (
                                <option key={index} value={app.appName}>
                                    {app.appName}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Connection Level Param Fields */}
                    {formData.application && (
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Connection Level Param Fields</h3>
                            {connectionLevelParams.length > 0 ? (
                                <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="px-4 py-2 border">PARAM NAME</th>
                                            <th className="px-4 py-2 border">PARAM TYPE</th>
                                            <th className="px-4 py-2 border">MANDATORY?</th>
                                            <th className="px-4 py-2 border">SENSITIVE</th>
                                            <th className="px-4 py-2 border">VARIABLE NAME</th>
                                            <th className="px-4 py-2 border">DESCRIPTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {connectionLevelParams.map((item) => {
                                            return (
                                                <tr key={item.id} className="border-t hover:bg-gray-50 transition duration-200">
                                                    <td className="px-4 py-2 border">{item.paramName}</td>
                                                    <td className="px-4 py-2 border">{item.paramType}</td>
                                                    <td className="px-4 py-2 border text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.mandatory}
                                                            disabled
                                                            className="w-5 h-5 cursor-not-allowed accent-blue-500"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.sensitive}
                                                            disabled
                                                            className="w-5 h-5 cursor-not-allowed accent-red-500"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border">{item.variableName}</td>
                                                    <td className="px-4 py-2 border">{item.description}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500">No parameters available for this application.</p>
                            )}
                        </div>
                    )}

                    {/* Transaction Level Param Fields */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Transaction Level Param Fields</h3>
                        <ParamTable rows={rows} setRows={setRows} />
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Details</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="6"
                            placeholder="Enter details here"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 text-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Save
                    </button>
                </form>
            </div>

            {/* Right Side - Code Editor */}
            <div className="w-1/2">
                <MonacoEditor transactionRows={rows} connectionRows={connectionLevelParams} appActionName={formData.actionName} applicationName = {formData.application} />
            </div>
        </div>
    );
};

export default Form;
