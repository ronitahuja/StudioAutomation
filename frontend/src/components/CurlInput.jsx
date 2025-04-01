import React from 'react'
import axios from 'axios'

const CurlInput = () => {
  return (
    <div>
        <input type="text" className="w-full p-2 border rounded-md" placeholder="Enter curl command here" />
        <button className="bg-blue-500 text-white p-2 rounded-md" onClick={()=>{
            axios.get("http://localhost:3000/dummydata").then((res)=>{
                const data1 = res.data.ConnectionLevel;
                let temp=[];
                data1.forEach((element)=>{
                    temp.push(JSON.stringify(element));
                }
                )
                localStorage.setItem("ConnectionLevelParamFields",JSON.stringify(temp));
                const data2=res.data.TransactionLevel;
                let temp2=[];
                data2.forEach((element)=>{
                    temp2.push(JSON.stringify(element));
                }
                )
                localStorage.setItem("TransactionLevelParamFields",JSON.stringify(temp2));
            })
        }}>Send</button>
    </div>
  )
}

export default CurlInput

