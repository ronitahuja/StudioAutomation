import React, { useState, useEffect } from "react";
import axios from "axios";
import ParamTable from "./PramTable";
import ApplicationTable from "./ApplicationTable";

function AppForm() {
  const [rows, setRows] = useState([]);
  const [appName, setAppName] = useState("");
  const [allCat, setAllCat] = useState([]);
  const [appCategory, setAppCategory] = useState("");
  const [authenticationType, setAuthenticationType] = useState("");
  const [appDescription, setDescription] = useState("");
  const [authTypes, setAuthTypes] = useState([]);
  const [payload, setPayLoad] = useState(null);

  // Fetch dropdown options from the backend
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const [categoriesRes, authTypesRes] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/app/appCategories", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/v1/app/authenticationType", {
            withCredentials: true,
          }),
        ]);
        setAllCat(categoriesRes.data.data);
        setAuthTypes(authTypesRes.data.data);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    fetchDropdownOptions();
  }, []);

  // Populate form fields when editing
  useEffect(() => {
    if (payload) {
      setAppName(payload.appName || "");
      setAppCategory(payload.appCategory || "");
      setAuthenticationType(payload.authenticationType || "");
      setDescription(payload.appDescription || "");
      setRows(payload.connectionLevelParamFields || []);
    }
  }, [payload]);

  // Handle Save Button Click
  const handleSave = async () => {
    const newPayLoad = {
      appName,
      appCategory,
      authenticationType,
      appDescription,
      connectionLevelParamFields: rows,
    };

    try {
      // Check if the application already exists
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/app/${appName}`,
        { withCredentials: true }
      );

      if (data?.data) {
        // Update existing application
        await axios.patch(
          `http://localhost:3000/api/v1/app/${appName}`,
          newPayLoad,
          { withCredentials: true }
        );
        alert("Application updated successfully!");
      } else {
        // Create new application
        await axios.post("http://localhost:3000/api/v1/app/", newPayLoad, {
          withCredentials: true,
        });
        alert("Application saved successfully!");
      }

      // Clear form after save
      setAppName("");
      setAppCategory("");
      setAuthenticationType("");
      setDescription("");
      setRows([]);
      setPayLoad(null);
      window.location.reload();
    } catch (error) {
      console.error("Error saving application:", error);
      alert("Failed to save application.");
    }
  };

  return (
    <>
      <div className="bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
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
                disabled={!!payload} // Disable appName during edit mode
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
                {allCat.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Authentication Type Dropdown */}
              <label className="flex items-center gap-1">
                Authentication Type<span className="text-red-500">*</span>
              </label>
              <select
                value={authenticationType}
                onChange={(e) => setAuthenticationType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Authentication Type</option>
                {authTypes.map((auth, index) => (
                  <option key={index} value={auth}>
                    {auth}
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
                <textarea
                  value={appDescription}
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
            {(appName ||
              appCategory ||
              authenticationType ||
              appDescription ||
              rows.length > 0) && (
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={() => {
                  setPayLoad(null); // Clear payload to reset form
                  setAppName("");
                  setAppCategory("");
                  setAuthenticationType("");
                  setDescription("");
                  setRows([]);
                }}
              >
                CANCEL
              </button>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {payload ? "UPDATE" : "SAVE"}
            </button>
          </div>
        </div>
      </div>

      {/* Application Table */}
      <ApplicationTable payload={payload} setPayLoad={setPayLoad} />
    </>
  );
}

export default AppForm;
