import React, { useState } from 'react';
import {LogIn } from 'lucide-react';
import axios from 'axios';
import Cookies from "js-cookie";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    axios.post('http://localhost:3000/api/v1/auth/login', {
      email,
      password
    }).then((response) => {
      const token = response.data.data.token;
      const user= response.data.data.user;
      Cookies.set('token', token);
      Cookies.set('firstName', user.firstName);
      Cookies.set('lastName', user.lastName);
      Cookies.set('email', user.email);
      Cookies.set('id', user._id);
      window.location.href="/";
    }).catch((error) => {
      alert("No user found with the given credentials");
      console.error(error);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3366FF] focus:border-[#3366FF]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3366FF] focus:border-[#3366FF]"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#3366FF] focus:ring-[#3366FF] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              {/* <a href="#" className="text-sm font-medium text-[#3366FF] hover:text-[#2952CC]">
                Forgot password?
              </a> */}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3366FF] hover:bg-[#2952CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3366FF]"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="font-medium text-[#3366FF] hover:text-[#2952CC]">
              Sign up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
