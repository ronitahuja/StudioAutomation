import React, { useState } from "react";
import ApplicationTable from "./ApplicationTable";

function Sidebar({ payload, setPayLoad }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`fixed top-15 right-0 h-full transition-all ${
        isCollapsed ? "w-10" : "bg-gray-100 shadow-lg w-96"
      }`}
    >
        {
            isCollapsed && <button
            onClick={toggleSidebar}
            className="w-12 h-12  p-2 bg-blue-600 text-white "
          >
            {!isCollapsed ? ">" : "<"}
          </button>
        }

      <div className={`overflow-y-auto ${isCollapsed ? "hidden" : "block"}`}>
      {
            !isCollapsed && <button
            onClick={toggleSidebar}
            className="w-12 h-12  p-2 bg-blue-600 text-white "
          >
            {!isCollapsed ? ">" : "<"}
          </button>
        }
        <h3 className="ml-3 mt-2 text-xl font-semibold text-gray-800 mb-4">
          Application Table
        </h3>
        <ApplicationTable payload={payload} setPayLoad={setPayLoad} />
      </div>
    </div>
  );
}

export default Sidebar;
