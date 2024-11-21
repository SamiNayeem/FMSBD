'use client';

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
    Image: null as string | null, // Optional Base64 image
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and convert to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, Image: reader.result as string })); // Base64 string
      };
      reader.readAsDataURL(file);
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
      // Send Base64 image string to backend
      const response = await axios.post("/api/registration", {
        ...formData,
        Image: formData.Image ? formData.Image.split(',')[1] : null, // Remove Base64 header (data:image/png;base64,)
      });

      setMessage(response.data.message);
      setIsSuccess(true);

      // Redirect after successful registration
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      setMessage(
        error.response?.data?.error || "Registration failed. Please try again."
      );
      setIsSuccess(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-blue-400 min-h-screen flex items-center justify-center mt-20">
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
              isSuccess
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
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
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
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
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
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
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
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
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
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
            <div className="relative">
              <input
                name="Password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Enter your password"
                value={formData.Password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-2 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="ConfirmPassword"
                type={showPassword ? "text" : "password"}
                required
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Confirm your password"
                value={formData.ConfirmPassword}
                onChange={handleChange}
              />
            </div>
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
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Register Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Register
            </button>
          </div>

          {/* Already have an account Link */}
          <p className="text-center text-sm mt-6">
            Already have an account?
            <a
              href="/login"
              className="text-blue-600 hover:underline ml-1 font-medium"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
