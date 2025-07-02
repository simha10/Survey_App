"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import { userApi, User } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";

const UserManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    role: "ADMIN",
    mobileNumber: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.register(formData);
      toast.success("User created successfully");
      setShowCreateModal(false);
      setFormData({
        username: "",
        name: "",
        password: "",
        role: "ADMIN",
        mobileNumber: "",
        status: "ACTIVE",
      });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create user");
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      // Update user status
      await userApi.updateUserStatus({
        userId: selectedUser.userId,
        isActive: formData.status === "ACTIVE",
      });

      // Update user role if changed
      if (formData.role !== selectedUser.role) {
        await userApi.assignRole({
          userId: selectedUser.userId,
          roleName: formData.role,
        });
      }

      toast.success("User updated successfully");
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await userApi.deleteUser({ userId });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const userRole = user.role || user.userRoleMaps?.[0]?.role?.roleName || "";
    const matchesRole = !selectedRole || userRole === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <ProtectedRoute requireWebPortalAccess>
        <Loading fullScreen />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireWebPortalAccess>
      <MainLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all system users including Admins, Supervisors, and
              Surveyors
            </p>
          </div>

          {/* Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="">All Roles</option>
                <option value="SUPERADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="SURVEYOR">Surveyor</option>
              </select>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add User
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const userRole =
                    user.role ||
                    user.userRoleMaps?.[0]?.role?.roleName ||
                    "N/A";
                  return (
                    <tr key={user.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userRole === "SUPERADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : userRole === "ADMIN"
                              ? "bg-blue-100 text-blue-800"
                              : userRole === "SUPERVISOR"
                              ? "bg-orange-100 text-orange-800"
                              : userRole === "SURVEYOR"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {userRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setFormData({
                              username: user.username,
                              name: user.name || "",
                              password: "",
                              role: userRole,
                              mobileNumber: user.mobileNumber || "",
                              status: user.isActive ? "ACTIVE" : "INACTIVE",
                            });
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.userId)}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          Delete
                        </button>
                        <button
                          disabled={currentUser?.userId === user.userId}
                          onClick={async () => {
                            try {
                              await userApi.updateUserStatus({
                                userId: user.userId,
                                isActive: !user.isActive,
                              });
                              toast.success(
                                `User ${
                                  user.isActive ? "deactivated" : "activated"
                                } successfully`
                              );
                              fetchUsers();
                            } catch (error: any) {
                              toast.error(
                                error.response?.data?.error ||
                                  "Failed to update user status"
                              );
                            }
                          }}
                          className={`px-3 py-1 rounded-md border transition
                            ${
                              user.isActive
                                ? "border-red-500 text-red-600 hover:bg-red-50"
                                : "border-green-500 text-green-600 hover:bg-green-50"
                            }
                            ${
                              currentUser?.userId === user.userId
                                ? "opacity-60 cursor-not-allowed bg-gray-100 border-gray-300 text-gray-400"
                                : ""
                            }
                          `}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Create User Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Create New User
                  </h3>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="SUPERADMIN">Super Admin</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="SURVEYOR">Surveyor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter mobile number"
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobileNumber: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Create User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {showEditModal && selectedUser && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Edit User
                  </h3>
                  <form onSubmit={handleEditUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        disabled
                        placeholder="Enter username"
                        value={formData.username}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="SUPERADMIN">Super Admin</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="SURVEYOR">Surveyor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Update User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserManagementPage;
