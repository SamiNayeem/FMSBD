'use client';

import { signIn } from "next-auth/react";
import React, { useState } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setMessage("Invalid email or password.");
      setIsSuccess(false);
      setTimeout(() => {
        window.location.href = "/login"; // Redirect back to login
      }, 2000);
    } else {
      setMessage("Login successful!");
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = "/feed"; // Redirect to dashboard
      }, 2000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-blue-400 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-gray-800 text-center text-3xl font-bold mb-6">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Sign in to continue to your account
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-center ${
              isSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-2 block">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field with Toggle */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg
                onClick={() => setShowPassword(!showPassword)}
                xmlns="http://www.w3.org/2000/svg"
                fill="#bbb"
                stroke="#bbb"
                className="w-5 h-5 absolute right-4 top-3 cursor-pointer"
                viewBox="0 0 128 128"
              >
                <path d="M64 104C22.127 104..." />
              </svg>
            </div>
          </div>

          {/* Sign In Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              Sign in
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-700 text-sm mt-6">
            Don't have an account?
            <a href="/registration" className="text-blue-600 hover:underline ml-1 font-medium">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
