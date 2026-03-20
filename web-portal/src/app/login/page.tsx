"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import LoginForm from "@/features/auth/LoginForm";
import Image from "next/image";

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  useEffect(() => {
    // Check backend status on page load
    const checkBackend = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
        const response = await fetch(`${backendUrl}/health`);
        if (response.ok) {
          setBackendStatus("online");
        } else {
          setBackendStatus("offline");
        }
      } catch (error) {
        console.error("Backend check failed:", error);
        setBackendStatus("offline");
      }
    };

    checkBackend();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  const handleLoginError = (error: string) => {
    console.error("Login error:", error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-700">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl mb-4 transform hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.png"
              alt="LRM Consultants Logo"
              width={80}
              height={80}
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            LRM Consultants
          </h1>
        </div>

        {backendStatus === "offline" && (
          <div className="bg-red-900/30 border-l-4 border-red-500 rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-300">
                  Backend Server Offline
                </h3>
                <p className="text-sm text-red-200 mt-1">
                  The backend server is currently unreachable. Please ensure it is running and configured correctly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            © 2024 LRM Consultants. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
