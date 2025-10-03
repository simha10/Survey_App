"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { LoginRequest } from "@/lib/api";
import toast from "react-hot-toast";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
    role: "ADMIN",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: "SUPERADMIN", label: "Super Admin" },
    { value: "ADMIN", label: "Admin" },
    { value: "SUPERVISOR", label: "Supervisor" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      console.log("Submitting login form:", formData);
      toast.loading("Signing in...", { id: "login" });

      await login(formData);

      toast.success("Login successful!", { id: "login" });
      console.log("Login successful, calling onSuccess");
      onSuccess?.();
    } catch (error: any) {
      console.error("Login form error:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      toast.error(errorMessage, { id: "login" });
      setErrors({ password: errorMessage });
      onError?.(errorMessage);
    }
  };

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm text-gray-300 focus:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your username"
            disabled={isLoading}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-300 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-300 ${
              errors.role ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value} className="bg-black">
                {role.label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
