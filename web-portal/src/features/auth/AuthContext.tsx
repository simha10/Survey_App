"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi, LoginRequest, LoginResponse, User, userApi } from "@/lib/api";
import toast from "react-hot-toast";

// Types
export interface AuthUser {
  userId: string;
  username: string;
  role: string;
  name?: string;
  mobileNumber?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  hasRole: (roles: string | string[]) => boolean;
  hasWebPortalAccess: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userInfo = localStorage.getItem("user_info");

        console.log("Initializing auth...", {
          token: !!token,
          userInfo: !!userInfo,
        });

        if (token && userInfo) {
          // Verify token by fetching user profile
          const profile = await userApi.getProfile();
          console.log("Profile fetched:", profile);

          // Check if user has a role assigned
          if (!profile.role) {
            console.warn("User has no role assigned:", profile.userId);
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_info");
            return;
          }

          const authUser: AuthUser = {
            userId: profile.userId,
            username: profile.username,
            role: profile.role,
            name: profile.name || undefined,
            mobileNumber: profile.mobileNumber,
            isActive: profile.isActive,
          };
          setUser(authUser);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Token is invalid, clear storage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
        toast.error("Session expired. Please login again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("Attempting login with:", credentials);

      const response: LoginResponse = await authApi.login(credentials);
      console.log("Login response:", response);

      // Store token and user info
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_info", JSON.stringify(response.user));

      // Fetch complete user profile
      const profile = await userApi.getProfile();
      console.log("User profile:", profile);

      // Check if user has a role assigned
      if (!profile.role) {
        console.warn("User has no role assigned:", profile.userId);
        toast.error("User has no role assigned. Please contact administrator.");
        throw new Error("User has no role assigned");
      }

      const authUser: AuthUser = {
        userId: profile.userId,
        username: profile.username,
        role: profile.role,
        name: profile.name || undefined,
        mobileNumber: profile.mobileNumber,
        isActive: profile.isActive,
      };

      setUser(authUser);
      toast.success(`Welcome, ${authUser.name || authUser.username}!`);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    setUser(null);
    toast.success("Logged out successfully");
  };

  // Update user function
  const updateUser = (userData: Partial<AuthUser>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Role checking function
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  // NEW: Web portal access checking function
  const hasWebPortalAccess = (): boolean => {
    return hasRole(["SUPERADMIN", "ADMIN"]);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    hasRole,
    hasWebPortalAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
