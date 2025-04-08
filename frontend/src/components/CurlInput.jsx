import React, { useState } from "react";
import axios from "axios";

const CurlInput = () => {
    const [curl,setCurl]=useState("");
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-[600px]">
        <textarea
          className="w-full h-60 p-4 text-lg border border-gray-300 rounded-md mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter curl command here"
          onChange={(e)=>{
            e.preventDefault();
            setCurl(e.target.value);
          }}
        ></textarea>
        <button
          className="w-full h-14 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600 transition-all"
          onClick={() => {
            axios
              .post("http://127.0.0.1:8000/api/user_prompt", {
                prompt:curl,
                session_id:1,
              })
              .then((res) => {
                const data1 = res.data.ConnectionLevel;
                let temp = [];
                data1.forEach((element) => {
                  temp.push(JSON.stringify(element));
                });
                localStorage.setItem(
                  "ConnectionLevelParamFields",
                  JSON.stringify(temp)
                );

                const data2 = res.data.TransactionLevel;
                let temp2 = [];
                data2.forEach((element) => {
                  temp2.push(JSON.stringify(element));
                });
                localStorage.setItem(
                  "TransactionLevelParamFields",
                  JSON.stringify(temp2)
                );
              });
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CurlInput;
