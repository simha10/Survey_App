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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-gray-800 rounded-lg shadow-2xl p-8 space-y-8 border border-gray-700">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="LRM Consultants Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
        </div>

        {backendStatus === "offline" && (
          <div className="bg-red-900/20 border border-red-700 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
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
                <h3 className="text-sm font-medium text-red-300">
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
          <h2 className="text-3xl font-bold text-white">LRM Consultants</h2>
          <p className="mt-4 text-sm text-gray-400">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            © 2024 LRM Consultants. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
