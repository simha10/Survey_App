"use client";
import React, { useState, useEffect } from "react";
import ULBSelector from "@/components/masters/ULBSelector";
import ZoneSelector from "@/components/masters/ZoneSelector";
import StatusChangeModal from "@/components/masters/StatusChangeModal";
import { useQuery } from "@tanstack/react-query";
import { masterDataApi } from "@/lib/api";
import { surveyStatusApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";
import { useRef } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getUserRoleRank, ROLE_RANK } from "@/lib/api";

export default function WardMasterPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUlb, setSelectedUlb] = React.useState<string | null>(null);
  const [selectedZone, setSelectedZone] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedWardToDelete, setSelectedWardToDelete] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    wardName: "",
    newWardNumber: "",
    description: "",
    isActive: true,
  });

  // Check if current user can edit masters
  const canEditMasters = user && getUserRoleRank(user) >= ROLE_RANK.ADMIN;

  useEffect(() => {
    // Simulate loading time for consistency
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch wards for selected Zone
  const {
    data: wards,
    isLoading: wardsLoading,
    error: wardsError,
    refetch: refetchWards,
  } = useQuery({
    queryKey: ["wards", selectedZone],
    queryFn: () => masterDataApi.getWardsByZone(selectedZone!),
    enabled: !!selectedZone,
  });

  // Fetch all possible statuses
  const { data: statuses = [] } = useQuery({
    queryKey: ["ward-statuses-master"],
    queryFn: surveyStatusApi.getAllWardStatuses,
  });

  // Helper to get current status for a ward (from ward.wardStatusMaps if available)
  const getCurrentStatusName = (ward: any) => {
    if (ward.wardStatusMaps && ward.wardStatusMaps.length > 0) {
      const active = ward.wardStatusMaps.find((m: any) => m.isActive);
      return active ? active.status.statusName : "Not Started";
    }
    return "Not Started";
  };

  // Helper to get zone name for a ward
  const getZoneName = (ward: any) => {
    // Note: Zone information should be included in the ward data from the backend
    // For now, we'll show a placeholder. This can be enhanced when zone mapping is added to the API
    return "Zone Info"; // This should be enhanced with actual zone data
  };

  // Filter wards based on search term
  const filteredWards =
    wards?.filter((ward: any) =>
      ward.wardName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted filtered wards
  const getSortedFilteredWards = () => {
    if (!filteredWards || !sortConfig) return filteredWards || [];
    
    const sorted = [...filteredWards];
    sorted.sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Special handling for newWardNumber - extract numeric part
      if (sortConfig.key === "newWardNumber") {
        const aNum = parseInt(String(a.newWardNumber).replace(/\D/g, '')) || 0;
        const bNum = parseInt(String(b.newWardNumber).replace(/\D/g, '')) || 0;
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    return sorted;
  };

  // Helper to get sort icon
  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Update Ward mutation
  const updateWardMutation = useMutation({
    mutationFn: (data: any) => masterDataApi.updateWard(selectedWardToDelete.wardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wards", selectedZone] });
      toast.success("Ward updated successfully");
      setShowEditModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update Ward");
    },
  });

  // Delete Ward mutation
  const deleteWardMutation = useMutation({
    mutationFn: (wardId: string) => masterDataApi.deleteWard(wardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wards", selectedZone] });
      toast.success("Ward deleted successfully");
      setShowDeleteConfirm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete Ward");
    },
  });

  // Handle edit click
  const handleEditClick = (ward: any) => {
    setSelectedWardToDelete(ward);
    setEditFormData({
      wardName: ward.wardName || "",
      newWardNumber: ward.newWardNumber || "",
      description: ward.description || "",
      isActive: ward.isActive,
    });
    setShowEditModal(true);
  };

  // Handle update
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateWardMutation.mutate(editFormData);
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedWardToDelete) {
      deleteWardMutation.mutate(selectedWardToDelete.wardId);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <MainLayout>
      <div className="bg-gray-900 min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-4">Ward Master</h1>

        {/* Selection Dropdowns */}
        <div className="mb-6 flex gap-4">
          <ULBSelector
            value={selectedUlb}
            onChange={(ulbId) => {
              setSelectedUlb(ulbId);
              setSelectedZone(null);
            }}
          />
          <ZoneSelector
            ulbId={selectedUlb}
            value={selectedZone}
            onChange={setSelectedZone}
          />
        </div>

        {/* Search Bar and Status Change Button */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search wards by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Change Survey Status
          </button>
        </div>

        <div>
          {wardsLoading && (
            <div className="text-gray-400">Loading wards...</div>
          )}
          {wardsError && (
            <div className="text-red-400">Error loading wards</div>
          )}
          {!wardsLoading && !wardsError && (
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden text-sm font-medium">
              <thead>
                <tr>
                  <th 
                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                    onClick={() => handleSort("newWardNumber")}
                  >
                    Ward Number {getSortIcon("newWardNumber")}
                  </th>
                  <th 
                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                    onClick={() => handleSort("wardName")}
                  >
                    Ward Name {getSortIcon("wardName")}
                  </th>
                  <th className="px-4 py-2 text-left">Survey Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getSortedFilteredWards().length > 0 ? (
                  getSortedFilteredWards().map((ward: any) => (
                    <tr key={ward.wardId} className="border-b border-gray-700">
                      <td className="px-4 py-2">{ward.newWardNumber}</td>
                      <td className="px-4 py-2">{ward.wardName}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                          {getCurrentStatusName(ward)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditClick(ward)}
                            disabled={!canEditMasters}
                            className={`p-2 rounded-lg transition ${
                              canEditMasters
                                ? "text-blue-400 hover:bg-blue-900"
                                : "text-gray-600 cursor-not-allowed"
                            }`}
                            title={!canEditMasters ? "Only ADMIN or SUPERADMIN can edit" : "Edit Ward"}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setSelectedWardToDelete(ward);
                              setShowDeleteConfirm(true);
                            }}
                            disabled={!canEditMasters}
                            className={`p-2 rounded-lg transition ${
                              canEditMasters
                                ? "text-red-400 hover:bg-red-900"
                                : "text-gray-600 cursor-not-allowed"
                            }`}
                            title={!canEditMasters ? "Only ADMIN or SUPERADMIN can delete" : "Delete Ward"}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-gray-400"
                    >
                      {selectedZone
                        ? searchTerm
                          ? "No wards found matching your search."
                          : "No wards found for this zone."
                        : "Select a ULB and Zone to view wards."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Status Change Modal */}
        <StatusChangeModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
        />

        {/* Edit Ward Modal */}
        {showEditModal && selectedWardToDelete && (
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="relative mx-auto max-w-lg shadow-2xl rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mb-3 shadow-lg transform transition-transform hover:scale-110">
                    <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">Edit Ward</h3>
                </div>
                <form onSubmit={handleUpdate} className="space-y-3">
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 6h14a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                        </svg>
                        Ward Number
                      </span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.newWardNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, newWardNumber: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 text-sm font-medium placeholder-gray-400 bg-gradient-to-r from-gray-50 to-white"
                      placeholder="Enter ward number"
                      required
                    />
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024-.195 1.414-.586l7-7a2 2 0 000-2.828l-7-7a2 2 0 00-2.828 0l-7 7a1.994 1.994 0 00-1.414.586L3 12c0 .512.195 1.024.586 1.414l7 7c.39.39.902.586 1.414.586h5c.512 0 1.024-.195 1.414-.586l7-7a2 2 0 000-2.828l-7-7a2 2 0 00-2.828 0L7 7z" />
                        </svg>
                        Ward Name
                      </span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.wardName}
                      onChange={(e) => setEditFormData({ ...editFormData, wardName: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-gray-900 text-sm font-medium placeholder-gray-400 bg-gradient-to-r from-gray-50 to-white"
                      placeholder="Enter ward name"
                      required
                    />
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Description
                      </span>
                    </label>
                    <textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-900 text-sm font-medium placeholder-gray-400 bg-gradient-to-r from-gray-50 to-white resize-none"
                      rows={3}
                      placeholder="Enter ward description (optional)"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 shadow-sm border border-blue-100">
                    <label className="flex items-center cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={editFormData.isActive}
                          onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`block w-12 h-6 rounded-full transition-colors duration-200 ${editFormData.isActive ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 flex items-center justify-center shadow-md ${editFormData.isActive ? 'transform translate-x-6' : ''}`}>
                          {editFormData.isActive ? (
                            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="ml-3">
                        <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                          {editFormData.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateWardMutation.isPending}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:from-blue-300 disabled:to-indigo-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center gap-1.5 text-sm"
                    >
                      {updateWardMutation.isPending ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Update Ward
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedWardToDelete && (
          <div className="fixed inset-0 bg-gradient-to-br from-red-900 via-gray-800 to-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="relative mx-auto max-w-md shadow-2xl rounded-2xl bg-gradient-to-br from-white via-red-50 to-white border border-red-200 w-full">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 mb-4 shadow-lg transform transition-transform hover:scale-110">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">Delete Ward</h3>
                <p className="text-gray-600 mb-5 leading-relaxed text-sm">
                  Are you sure you want to delete <strong className="text-red-600">{selectedWardToDelete.wardName}</strong> ? 
                  <span className="block mt-1.5 text-xs text-gray-500">This action cannot be undone and all associated data may be affected.</span>
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteWardMutation.isPending}
                    className="px-4 py-2 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteWardMutation.isPending}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:from-red-300 disabled:to-red-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center gap-1.5 text-sm"
                  >
                    {deleteWardMutation.isPending ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Ward
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
