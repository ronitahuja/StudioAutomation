import React, { useEffect, useState } from "react";
import ParamTable from "./PramTable";
import MonacoEditor from "./CodeEditor";
import { param } from "framer-motion/client";
import apiData from "../data/apiData";

const Form = () => {
    const [rows, setRows] = useState([]);
    const [formData, setFormData] = useState({
        actionName: "",
        language: "",
        application: "",
        details: "",
    });

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            //simulating an API response            
            setData(apiData);
        }
        fetchData();
    }, []);

    const languages = ["Python", "R"];
    const applications = ["App1", "App2", "App3", "App4"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
    };

    return (
        <div className="flex gap-5 p-8  mt-[50px]">
            {/* Left Side - Form */}
            <div className="w-1/2 bg-gray-100 p-8 rounded-xl shadow-xl">

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-medium text-gray-700">App Action Name</label>
                        <input
                            name="actionName"
                            value={formData.actionName}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                            placeholder="Enter action name"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700">Select Language</label>
                        <select
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a language</option>
                            {languages.map((lang, index) => (
                                <option key={index} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700">Application Name</label>
                        <select
                            name="application"
                            value={formData.application}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select an application</option>
                            {applications.map((app, index) => (
                                <option key={index} value={app}>
                                    {app}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Connection Level Param Fields</h3>
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
                                {data.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-gray-50 transition duration-200">
                                        <td className="px-4 py-2 border">{item.paramName}</td>
                                        <td className="px-4 py-2 border">{item.paramType}</td>
                                        <td className="px-4 py-2 border text-center">
                                            <input
                                                type="checkbox"
                                                checked={item.mandatory}
                                                readOnly
                                                className="w-5 h-5 cursor-not-allowed accent-blue-500"
                                            />
                                        </td>
                                        {/* Checkbox for Sensitive */}
                                        <td className="px-4 py-2 border text-center">
                                            <input
                                                type="checkbox"
                                                checked={item.sensitive}
                                                readOnly
                                                className="w-5 h-5 cursor-not-allowed accent-red-500"
                                            />
                                        </td>
                                        <td className="px-4 py-2 border">{item.variableName}</td>
                                        <td className="px-4 py-2 border">{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Transaction Level Param Fields</h3>
                        <ParamTable rows={rows} setRows={setRows} />
                    </div>

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



                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 text-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Save
                    </button>
                </form>
            </div>

            {/* Right Side - Code Editor */}
            <div>
                <MonacoEditor transactionRows={rows} />
            </div>

        </div>
    );
};

export default Form;
