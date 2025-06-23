"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import { userApi, User } from "@/lib/api";
import toast from "react-hot-toast";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await userApi.getProfile();
        setProfile(profileData);
        setError(null);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || err.message || "Failed to fetch profile";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      SUPERADMIN: "Super Admin",
      ADMIN: "Admin",
      SUPERVISOR: "Supervisor",
      SURVEYOR: "Surveyor",
    };
    return roleMap[role] || role;
  };

  const renderProfileDetails = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          Error: {error}
        </div>
      );
    }

    if (!profile) {
      return <div className="text-gray-500 p-4">No profile data found.</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Edit Profile
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Username
            </label>
            <p className="mt-1 text-lg text-gray-900">{profile.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Full Name
            </label>
            <p className="mt-1 text-lg text-gray-900">
              {profile.name || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Role
            </label>
            <p className="mt-1 text-lg text-gray-900">
              {getRoleDisplayName(profile.role || "")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Mobile Number
            </label>
            <p className="mt-1 text-lg text-gray-900">
              {profile.mobileNumber || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Status
            </label>
            <div className="mt-1">
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  profile.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {profile.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Member Since
            </label>
            <p className="mt-1 text-lg text-gray-900">
              {new Date(profile.createdAt || "").toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <MainLayout>{renderProfileDetails()}</MainLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
