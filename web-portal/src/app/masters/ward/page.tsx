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

  // Filter wards based on search term
  const filteredWards =
    wards?.filter((ward: any) =>
      ward.wardName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <MainLayout>
      <div className="bg-gray-900 min-h-screen p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Ward Master</h1>

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
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Ward Number</th>
                  <th className="px-4 py-2 text-left">Ward Name</th>
                  <th className="px-4 py-2 text-left">Survey Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWards && filteredWards.length > 0 ? (
                  filteredWards.map((ward: any) => (
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
