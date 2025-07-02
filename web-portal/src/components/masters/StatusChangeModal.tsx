"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { masterDataApi, surveyStatusApi } from "@/lib/api";
import toast from "react-hot-toast";

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatusChangeModal({
  isOpen,
  onClose,
}: StatusChangeModalProps) {
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);
  const [wardSearchTerm, setWardSearchTerm] = useState("");
  const wardDropdownRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  // Fetch all wards (no status filter)
  const { data: wards = [] } = useQuery({
    queryKey: ["all-wards"],
    queryFn: masterDataApi.getAllWards,
    enabled: isOpen,
  });

  // Fetch all possible statuses
  const { data: statuses = [] } = useQuery({
    queryKey: ["ward-statuses"],
    queryFn: surveyStatusApi.getAllWardStatuses,
    enabled: isOpen,
  });

  // Filter wards based on search term
  const filteredWards = wards.filter((ward: any) =>
    `${ward.newWardNumber} - ${ward.wardName}`
      .toLowerCase()
      .includes(wardSearchTerm.toLowerCase())
  );

  // Mutation for updating ward status
  const updateStatusMutation = useMutation({
    mutationFn: ({
      wardId,
      wardStatusId,
    }: {
      wardId: string;
      wardStatusId: number;
    }) => surveyStatusApi.updateWardStatus(wardId, wardStatusId),
    onSuccess: () => {
      toast.success("Survey status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["wards-with-status"] });
      queryClient.invalidateQueries({ queryKey: ["wards"] });
      queryClient.invalidateQueries({ queryKey: ["mohallas"] });
      handleClose();
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  // Get current status for selected ward
  useEffect(() => {
    if (selectedWard) {
      const ward = wards.find((w: any) => w.wardId === selectedWard);
      if (ward && ward.wardStatusMaps && ward.wardStatusMaps.length > 0) {
        const activeStatus = ward.wardStatusMaps[0];
        setCurrentStatus(activeStatus.status.statusName);
        setSelectedStatus(activeStatus.status.wardStatusId);
      } else {
        setCurrentStatus("Not Started");
        setSelectedStatus(null);
      }
    } else {
      setCurrentStatus("");
      setSelectedStatus(null);
    }
  }, [selectedWard, wards]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wardDropdownRef.current &&
        !wardDropdownRef.current.contains(event.target as Node)
      ) {
        setIsWardDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setSelectedWard("");
    setSelectedStatus(null);
    setCurrentStatus("");
    setWardSearchTerm("");
    setIsWardDropdownOpen(false);
    onClose();
  };

  const handleWardSelect = (wardId: string, wardDisplayName: string) => {
    setSelectedWard(wardId);
    setWardSearchTerm(wardDisplayName);
    setIsWardDropdownOpen(false);
  };

  const handleSubmit = () => {
    if (!selectedWard || selectedStatus === null) {
      toast.error("Please select both ward and status");
      return;
    }

    updateStatusMutation.mutate({
      wardId: selectedWard,
      wardStatusId: selectedStatus,
    });
  };

  const getSelectedWardDisplayName = () => {
    if (!selectedWard) return "";
    const ward = wards.find((w: any) => w.wardId === selectedWard);
    return ward ? `${ward.newWardNumber} - ${ward.wardName}` : "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black rounded-lg p-6 w-96 shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">Change Survey Status</h2>

          {/* Ward Selection with Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Ward
            </label>
            <div className="relative" ref={wardDropdownRef}>
              <input
                type="text"
                placeholder="Search and select a ward..."
                value={wardSearchTerm}
                onChange={(e) => {
                  setWardSearchTerm(e.target.value);
                  setIsWardDropdownOpen(true);
                  if (!e.target.value) {
                    setSelectedWard("");
                  }
                }}
                onFocus={() => setIsWardDropdownOpen(true)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />

              {/* Dropdown Arrow */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isWardDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown Options */}
              {isWardDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredWards.length > 0 ? (
                    filteredWards.map((ward: any) => (
                      <div
                        key={ward.wardId}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() =>
                          handleWardSelect(
                            ward.wardId,
                            `${ward.newWardNumber} - ${ward.wardName}`
                          )
                        }
                      >
                        <div className="font-medium">
                          {ward.newWardNumber} - {ward.wardName}
                        </div>
                        {ward.description && (
                          <div className="text-sm text-gray-500">
                            {ward.description}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">
                      No wards found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Current Status Display */}
          {currentStatus && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Current Status
              </label>
              <div className="p-2 bg-gray-100 rounded-md">{currentStatus}</div>
            </div>
          )}

          {/* New Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">New Status</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedStatus || ""}
              onChange={(e) =>
                setSelectedStatus(Number(e.target.value) || null)
              }
            >
              <option value="">Select new status...</option>
              {statuses.map((status: any) => (
                <option key={status.wardStatusId} value={status.wardStatusId}>
                  {status.statusName}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={handleClose}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
              onClick={handleSubmit}
              disabled={
                updateStatusMutation.isPending ||
                !selectedWard ||
                selectedStatus === null
              }
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
