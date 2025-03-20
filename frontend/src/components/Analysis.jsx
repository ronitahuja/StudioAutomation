import React, { useEffect, useState } from "react";
import { Brain, Bot, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [maxLikes, setMaxLikes] = useState(0);
  const [avgLikes, setAvgLikes] = useState(0);
  const [modelWithMaxLikes, setModelWithMaxLikes] = useState("");

  useEffect(() => {
    const api = "http://localhost:3000/api/v1/analysis/getallanalysis";

    axios
      .get(api,{withCredentials: true })
      .then((response) => {
        const models = response.data.data;
        setData(models);

        let totalLikes = 0;
        let highestLikes = 0;
        let topModel = "";

        models.forEach((model) => {
          totalLikes += model.modelScore;
          if (model.modelScore > highestLikes) {
            highestLikes = model.modelScore;
            topModel = model.modelName;
          }
        });

        setMaxLikes(highestLikes);
        setModelWithMaxLikes(topModel);
        setAvgLikes(models.length ? totalLikes / models.length : 0);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Brain className="w-10 h-10 text-blue-500" />
            <h1 className="text-3xl font-bold text-black">
              AI Model Popularity Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Bot className="w-6 h-6 text-black" />
            <span className="text-black">Real-time Analytics</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-semibold">Model Engagement Metrics</h2>
          </div>

          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="modelName"
                  tick={{ fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <YAxis
                  tick={{ fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                    color: "#F9FAFB",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: "#9CA3AF",
                  }}
                />
                <Bar
                  dataKey="modelScore"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  activeBar={<Rectangle fill="#2563EB" stroke="#059669" />}
                  cursor="pointer"
                >
                  <LabelList
                    dataKey="modelScore"
                    position="top"
                    fill="#D1D5DB"
                    formatter={(value) => `${value}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Highest Engagement</p>
              <p className=" text-[#2563EB] text-2xl font-bold ">
                {modelWithMaxLikes}
              </p>
              <p className="text-gray-400 text-sm">{maxLikes} Likes</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Average Likes</p>
              <p className="text-2xl font-bold text-[#2563EB]">{avgLikes}</p>
              <p className="text-gray-400 text-sm">per model</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Total Models</p>
              <p className="text-2xl font-bold text-[#2563EB]">{data.length}</p>
              <p className="text-gray-400 text-sm">tracked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
