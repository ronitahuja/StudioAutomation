import React, { useState } from "react";

const ParamTable = ({rows,setRows}) => {
  

  const paramTypes = ["Text", "Number", "Boolean", "Date", "Dropdown"];

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { paramName: "", paramType: "Text", mandatory: false, sensitive: false, variableName: "", description: "" }]);
  };

  //handle delete
  const handleDelete = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };
  

  return (
    <div>
      <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">PARAM NAME</th>
            <th className="border p-2">PARAM TYPE</th>
            <th className="border p-2">MANDATORY?</th>
            <th className="border p-2">SENSITIVE</th>
            <th className="border p-2">VARIABLE NAME</th>
            <th className="border p-2">DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border">
              <td className="border p-2">
                <input
                  type="text"
                  value={row.paramName}
                  onChange={(e) => handleInputChange(index, "paramName", e.target.value)}
                  className="w-full border p-1"
                />
              </td>
              <td className="border p-2">
                <select
                  value={row.paramType}
                  onChange={(e) => handleInputChange(index, "paramType", e.target.value)}
                  className="w-full border p-1"
                >
                  {paramTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </td>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={row.mandatory}
                  onChange={(e) => handleInputChange(index, "mandatory", e.target.checked)}
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={row.sensitive}
                  onChange={(e) => handleInputChange(index, "sensitive", e.target.checked)}
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={row.variableName}
                  onChange={(e) => handleInputChange(index, "variableName", e.target.value)}
                  className="w-full border p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => handleInputChange(index, "description", e.target.value)}
                  className="w-full border p-1"
                />
              </td>
              <td>
                <button onClick={()=>handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Add Row</button>
    </div>
  );
};

export default ParamTable;
