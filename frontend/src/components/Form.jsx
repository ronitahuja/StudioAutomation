import React, { useEffect, useState } from "react";
import ParamTable from "./PramTable";
import MonacoEditor from "./CodeEditor";
// import Temp from "./Temp";
import axios from "axios";

const Form = () => {
  const [rows, setRows] = useState([]);
  const [formData, setFormData] = useState({
    appActionName: "",
    language: "python",
    applicationName: "",
    details: "",
    code: "",
  });
  const [connectionLevelParams, setConnectionLevelParams] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", message: "" });

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/app/appNames",
          { withCredentials: true }
        );

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
    let data = JSON.parse(localStorage.getItem("TransactionLevelParamFields"));
    for (let i = 0; i < data.length; i++) {
      data[i] = JSON.parse(data[i]);
    }
    console.log(data);
    if (data !== null) {
      setRows(data);
    }
    fetchApplications();
  }, []);

  // Fetch Connection Level Params when an application is selected
  useEffect(() => {
    const fetchParams = async () => {
      try {
        if (!formData.applicationName) {
          setConnectionLevelParams([]); // Reset when no application is selected
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/api/v1/app/appNames/${formData.applicationName}`,
          { withCredentials: true }
        );
        if (
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          setConnectionLevelParams(
            response.data.data[0]?.connectionLevelParamFields
          );
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
  }, [formData.applicationName]); // Runs whenever application changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to update code from MonacoEditor
  const updateCode = (code) => {
    setFormData((prev) => ({ ...prev, code }));
  };
  const updateLanguage = (language) => {
    setFormData((prev) => ({ ...prev, language }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: "", message: "" });

    try {
      // Validate required fields
      if (
        !formData.appActionName ||
        !formData.applicationName ||
        !localStorage.getItem("language") ||
        !localStorage.getItem("code")
      ) {
        setSaveMessage({
          type: "error",
          message:
            "Please fill in all required fields (Action Name, Application, Language, and Code)",
        });
        setIsSaving(false);
        return;
      }

      // Prepare data for submission
      const appActionData = {
        appActionName: formData.appActionName,
        language: localStorage.getItem("language"),
        applicationName: formData.applicationName,
        transcationLevelParamFields: rows, // From ParamTable
        code: localStorage.getItem("code"),
        details: formData.details || "",
      };
      // Send data to backend
      await axios.post(
        "http://localhost:3000/api/v1/appActions/createAppActions",
        appActionData,
        { withCredentials: true }
      );

      setSaveMessage({
        type: "success",
        message: "App action saved successfully!",
      });
      localStorage.clear();
      window.location.reload();

      // Optional: Reset form or redirect
      // resetForm();
    } catch (error) {
      console.error("Error saving app action:", error);
      setSaveMessage({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to save app action. Please try again.",
      });
    } finally {
      setIsSaving(false);
      // Clear message after 5 seconds
      setTimeout(() => {
        setSaveMessage({ type: "", message: "" });
      }, 5000);
    }
  };

  return (
    <div className="flex gap-5 p-8 mt-[50px]">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-gray-100 p-8 rounded-xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Save Message */}
          {saveMessage.message && (
            <div
              className={`p-4 rounded-lg ${
                saveMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : saveMessage.type === "error"
                    ? "bg-red-100 text-red-800"
                    : ""
              }`}
            >
              {saveMessage.message}
            </div>
          )}

          {/* Action Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              App Action Name<span className="text-red-500">*</span>
            </label>
            <input
              name="appActionName"
              value={formData.appActionName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter action name"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Application Name<span className="text-red-500">*</span>
            </label>
            <select
              name="applicationName"
              value={formData.applicationName}
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
          {formData.applicationName && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Connection Level Param Fields
              </h3>
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
                        <tr
                          key={item.id}
                          className="border-t hover:bg-gray-50 transition duration-200"
                        >
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
                          <td className="px-4 py-2 border">
                            {item.variableName}
                          </td>
                          <td className="px-4 py-2 border">
                            {item.description}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">
                  No parameters available for this application.
                </p>
              )}
            </div>
          )}

          {/* Transaction Level Param Fields */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Transaction Level Param Fields
            </h3>
            <ParamTable rows={rows} setRows={setRows} />
          </div>

          {/* Details */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Details<span className="text-red-500">*</span>
            </label>
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
            disabled={isSaving}
            className={`w-full ${isSaving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-3 rounded-lg mt-4 text-lg font-semibold transition duration-300`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </form>
      </div>

      {/* Right Side - Code Editor */}
      <div className="w-1/2">
        <MonacoEditor
          transactionRows={rows}
          connectionRows={connectionLevelParams}
          appActionName={formData.appActionName}
          applicationName={formData.applicationName}
          onCodeChange={updateCode}
          onLanguageChange={updateLanguage}
        />
        {/* <Temp></Temp> */}
      </div>
    </div>
  );
};

export default Form;
