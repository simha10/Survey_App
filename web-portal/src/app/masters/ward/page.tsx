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

export default function WardMasterPage() {
  const [selectedUlb, setSelectedUlb] = React.useState<string | null>(null);
  const [selectedZone, setSelectedZone] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

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

  // Get sort icon
  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
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
                        {/* Future: Edit/Delete buttons */}
                        <button className="text-blue-400 hover:underline mr-2">
                          Edit
                        </button>
                        <button className="text-red-400 hover:underline">
                          Delete
                        </button>
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
      </div>
    </MainLayout>
  );
}
