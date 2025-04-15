import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

import PropTypes from "prop-types";

const ParamTable = ({ rows, setRows }) => {
  const paramTypes = ["Text", "Number", "Boolean"];
  const [newRowInput, setNewRowInput] = useState({
    paramName: "",
    paramType: "Text",
    mandatory: false,
    sensitive: false,
    variableName: "",
    description: "",
  });
  const handleNewRowInputChange = (field, value) => {
    setNewRowInput({
      ...newRowInput,
      [field]: value,
    });
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  // Validate if we can add a new row
  const isAddButtonDisabled = () => {
    // If only description is provided without param name and variable name, disable the button
    if (
      newRowInput.description &&
      (!newRowInput.paramName || !newRowInput.variableName)
    ) {
      return true;
    }

    // If param name or variable name is provided without the other, disable the button
    if (
      (newRowInput.paramName && !newRowInput.variableName) ||
      (!newRowInput.paramName && newRowInput.variableName)
    ) {
      return true;
    }

    // Otherwise, enable the button (all required fields are filled or all fields are empty)
    return false;
  };

  const addRow = (e) => {
    e.preventDefault();
    if (!isAddButtonDisabled()) {
      setRows([...rows, newRowInput]);

      setNewRowInput({
        paramName: "",
        paramType: "Text",
        mandatory: false,
        sensitive: false,
        variableName: "",
        description: "",
      });
    }
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
            <th className="border p-2">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border">
              <td className="border p-2">
                <input
                  type="text"
                  value={row.paramName}
                  onChange={(e) =>
                    handleInputChange(index, "paramName", e.target.value)
                  }
                  className="w-full border p-1"
                />
              </td>
              <td className="border p-2">
                <select
                  value={row.paramType}
                  onChange={(e) =>
                    handleInputChange(index, "paramType", e.target.value)
                  }
                  className="w-full border p-1"
                >
                  {paramTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={row.mandatory}
                  onChange={(e) =>
                    handleInputChange(index, "mandatory", e.target.checked)
                  }
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={row.sensitive}
                  onChange={(e) =>
                    handleInputChange(index, "sensitive", e.target.checked)
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={row.variableName}
                  onChange={(e) =>
                    handleInputChange(index, "variableName", e.target.value)
                  }
                  className="w-full border p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                  className="w-full border p-1"
                />
              </td>
              <td className="border p-2 text-center">
                <button type="button" onClick={() => handleDelete(index)}>
                  <AiOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
          {/* New Row Input Section */}
          <tr className="border bg-gray-50">
            <td className="border p-2">
              <input
                type="text"
                value={newRowInput.paramName}
                onChange={(e) =>
                  handleNewRowInputChange("paramName", e.target.value)
                }
                className="w-full border p-1"
                placeholder="Param Name"
              />
            </td>
            <td className="border p-2">
              <select
                value={newRowInput.paramType}
                onChange={(e) =>
                  handleNewRowInputChange("paramType", e.target.value)
                }
                className="w-full border p-1"
              >
                {paramTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </td>
            <td className="border p-2 text-center">
              <input
                type="checkbox"
                checked={newRowInput.mandatory}
                onChange={(e) =>
                  handleNewRowInputChange("mandatory", e.target.checked)
                }
              />
            </td>
            <td className="border p-2 text-center">
              <input
                type="checkbox"
                checked={newRowInput.sensitive}
                onChange={(e) =>
                  handleNewRowInputChange("sensitive", e.target.checked)
                }
              />
            </td>
            <td className="border p-2">
              <input
                type="text"
                value={newRowInput.variableName}
                onChange={(e) =>
                  handleNewRowInputChange("variableName", e.target.value)
                }
                className="w-full border p-1"
                placeholder="Variable Name"
              />
            </td>
            <td className="border p-2">
              <input
                type="text"
                value={newRowInput.description}
                onChange={(e) =>
                  handleNewRowInputChange("description", e.target.value)
                }
                className="w-full border p-1"
                placeholder="Description"
              />
            </td>
            <td className="border p-2 text-center">
            </td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={addRow}
        type="button"
        disabled={isAddButtonDisabled()}
        className={`mt-4 px-4 py-2 ${isAddButtonDisabled() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white rounded`}
      >
        Add Row
      </button>
    </div>
  );
};

ParamTable.propTypes = {
  rows: PropTypes.array.isRequired,
  setRows: PropTypes.func.isRequired,
};

export default ParamTable;
