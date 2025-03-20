import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Form from "./components/Form";
import AppForm from "./components/AppForm";
import Analysis from "./components/Analysis";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
        <Route path="/app" element={<ProtectedRoute><AppForm /></ProtectedRoute>} />
        <Route path="/appActions" element={<ProtectedRoute><Form /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
