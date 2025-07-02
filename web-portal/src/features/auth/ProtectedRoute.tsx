"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
  requireWebPortalAccess?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallback,
  redirectTo = "/login",
  requireWebPortalAccess = false,
}) => {
  const { user, isLoading, isAuthenticated, hasRole, hasWebPortalAccess } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (requireWebPortalAccess && !hasWebPortalAccess()) {
        router.push("/access-denied");
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    requireWebPortalAccess,
    hasWebPortalAccess,
    router,
  ]);

  // Show loading state
  if (isLoading) {
    return <Loading fullScreen />;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  // Check if user has required roles
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check if user has web portal access
  if (requireWebPortalAccess && !hasWebPortalAccess()) {
    return null;
  }

  // User is authenticated and has required roles
  return <>{children}</>;
};

export default ProtectedRoute;
