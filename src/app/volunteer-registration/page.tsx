"use client";

import React, { useState } from "react";
import axios from "axios";

const UserRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // Store the selected file
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.Password !== formData.ConfirmPassword) {
      setMessage("Passwords do not match!");
      setIsSuccess(false);
      return;
    }

    try {
      // Create a FormData object to handle file upload
      const formDataPayload = new FormData();
      formDataPayload.append("FirstName", formData.FirstName);
      formDataPayload.append("LastName", formData.LastName);
      formDataPayload.append("Email", formData.Email);
      formDataPayload.append("PhoneNumber", formData.PhoneNumber);
      formDataPayload.append("Password", formData.Password);
      formDataPayload.append("ConfirmPassword", formData.ConfirmPassword);

      if (imageFile) {
        formDataPayload.append("Image", imageFile); // Append the file
      }

      const response = await axios.post("/api/volunteer-registration", formDataPayload, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      });

      setMessage(response.data.message);
      setIsSuccess(true);

      // Redirect after success
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
      setIsSuccess(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-green-400 min-h-screen flex items-center justify-center mt-20">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-gray-800 text-center text-3xl font-bold mb-6">
          Create an Account
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Sign up to start your journey with us
        </p>

        {/* Success or Error Message */}
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
          {/* First and Last Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block">
                First Name
              </label>
              <input
                name="FirstName"
                type="text"
                required
                className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Enter your first name"
                value={formData.FirstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block">
                Last Name
              </label>
              <input
                name="LastName"
                type="text"
                required
                className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Enter your last name"
                value={formData.LastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-2 block">
              Email
            </label>
            <input
              name="Email"
              type="email"
              required
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your email"
              value={formData.Email}
              onChange={handleChange}
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-2 block">
              Phone Number
            </label>
            <input
              name="PhoneNumber"
              type="text"
              required
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your phone number"
              value={formData.PhoneNumber}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-2 block">
              Password
            </label>
            <input
              name="Password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your password"
              value={formData.Password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-2 block">
              Confirm Password
            </label>
            <input
              name="ConfirmPassword"
              type={showPassword ? "text" : "password"}
              required
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your password again"
              value={formData.ConfirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-2 block">
              Profile Picture (Optional)
            </label>
            <input
              name="Image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Register Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              Register
            </button>
          </div>

          {/* Already have an account Link */}
          <p className="text-center text-gray-700 text-sm mt-6">
            Already have an account?
            <a href="/login" className="text-blue-600 hover:underline ml-1 font-medium">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
