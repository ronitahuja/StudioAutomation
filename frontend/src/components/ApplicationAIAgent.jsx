import React, { useState } from 'react'
import axios from 'axios'

const ApplicationAIAgent = ({setData, sendData}) => {
  const [showSidebar, setShowSidebar] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!prompt.trim()) return alert('Please enter a prompt')
    setLoading(true)
    try {
        console.log(prompt);
        const response = await axios.post('http://127.0.0.1:8000/api/create-app-with-ai',{prompt});
        const data = JSON.parse(response.data.app.raw);
        setData(data);
    } catch (error) {
      console.error('Error calling API:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-1/4 bg-gray-800 text-white p-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">App Builder</h2>
            <button
              className="text-gray-300 hover:text-white"
              onClick={() => setShowSidebar(false)}
            >
              ✖
            </button>
          </div>
          <textarea
            className="w-full h-64 p-3 rounded-md text-black resize-none"
            placeholder="Enter prompt to create application..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button
            onClick={handleSend}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 relative">
        {!showSidebar && (
          <button
            className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
            onClick={() => setShowSidebar(true)}
          >
            ☰ Show Sidebar
          </button>
        )}
        {/* Main content goes here */}
      </div>
    </div>
  )
}

export default ApplicationAIAgent;
