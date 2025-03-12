import React from 'react';
import { Brain, Bot, Sparkles } from 'lucide-react';
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
} from 'recharts';

const data = [
  { model: 'LLaMA', likes: 120 },
  { model: 'GPT-4', likes: 200 },
  { model: 'Gemini', likes: 150 },
  { model: 'Claude', likes: 180 },
  { model: 'Mistral', likes: 90 },
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Brain className="w-10 h-10 text-emerald-400" />
            <h1 className="text-3xl font-bold">AI Model Popularity Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Bot className="w-6 h-6 text-emerald-400" />
            <span className="text-gray-300">Real-time Analytics</span>
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
                  dataKey="model" 
                  tick={{ fill: '#9CA3AF' }}
                  axisLine={{ stroke: '#4B5563' }}
                />
                <YAxis 
                  tick={{ fill: '#9CA3AF' }}
                  axisLine={{ stroke: '#4B5563' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#F9FAFB'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    color: '#9CA3AF'
                  }}
                />
                <Bar
                  dataKey="likes"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  activeBar={<Rectangle fill="#2563EB" stroke="#059669" />}
                >
                  <LabelList 
                    dataKey="likes" 
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
              <p className=" text-[#2563EB] text-2xl font-bold ">GPT-4</p>
              <p className="text-gray-400 text-sm">200 likes</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Average Likes</p>
              <p className="text-2xl font-bold text-[#2563EB]">148</p>
              <p className="text-gray-400 text-sm">per model</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Total Models</p>
              <p className="text-2xl font-bold text-[#2563EB]">5</p>
              <p className="text-gray-400 text-sm">tracked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;