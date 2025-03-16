import React, { useState, useEffect } from "react";
import { Search, Settings2, Copy, Trash2, RotateCcw } from "lucide-react";
import axios from "axios";
import PropTypes from "prop-types";

const ApplicationTable = ({ setPayLoad }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/app/appNames"
        );
        setApplications(response.data.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  // Filter applications based on search term
  const filteredApplications = applications.filter((app) =>
    app.appName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to page 1 if no results on the current page
  useEffect(() => {
    if (filteredApplications.length <= (currentPage - 1) * itemsPerPage) {
      setCurrentPage(1);
    }
  }, [filteredApplications, currentPage]);

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const paginatedApps = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fetch application details
  const fetchApplication = async (appName) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/app/${appName}`
      );
      const appData = response.data.data;

      if (appData) {
        console.log(
          "fetched connectionLevelParamFields:",
          appData.connectionLevelParamFields
        );
        setPayLoad({
          appName: appData.appName,
          appCategory: appData.appCategory,
          authenticationType: appData.authenticationType,
          appDescription: appData.appDescription,
          connectionLevelParamFields: appData.connectionLevelParamFields, // Corrected key
        });
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appName) => {
    console.log("handleEdit called with:", appName);
    fetchApplication(appName);
  };
  const handleDelete = (appName) => {
    if (window.confirm(`Are you sure you want to delete "${appName}"?`)) {
      axios
        .delete(`http://localhost:3000/api/v1/app/${appName}`)
        .then((response) => {
          if (response.data.success) {
            alert(`App "${appName}" deleted successfully.`);
            window.location.reload();
          } else {
            alert(response.data.message || "Failed to delete the app.");
            // Update state to reflect deletion without re-fetching
            setApplications((prevApps) =>
              prevApps.filter((app) => app.appName !== appName)
            );
          }
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
          alert(
            "An error occurred while deleting the app. Please try again later."
          );
        });
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-indigo-600">
            Applications
          </h1>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedApps.length > 0 ? (
                  paginatedApps.map((app, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.appName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-3">
                          <Settings2
                            className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                            onClick={() => handleEdit(app.appName)}
                          />
                          <Copy className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                          <Trash2
                            className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                            onClick={() => handleDelete(app.appName)}
                          />
                          <RotateCcw className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-500">
              {filteredApplications.length} Records
            </div>
            <div className="flex space-x-2">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-4 text-center text-indigo-600">
            Loading application details...
          </div>
        )}
      </div>
    </div>
  );
};

ApplicationTable.propTypes = {
  setPayLoad: PropTypes.func.isRequired,
};

export default ApplicationTable;
