"use client";
import React, { useState, useEffect } from "react";
import ULBSelector from "@/components/masters/ULBSelector";
import ZoneSelector from "@/components/masters/ZoneSelector";
import WardSelector from "@/components/masters/WardSelector";
import { useQuery } from "@tanstack/react-query";
import { masterDataApi, surveyStatusApi } from "@/lib/api";
import toast from "react-hot-toast";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";

export default function MohallaMasterPage() {
  const [selectedUlb, setSelectedUlb] = React.useState<string | null>(null);
  const [selectedZone, setSelectedZone] = React.useState<string | null>(null);
  const [selectedWard, setSelectedWard] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Fetch mohallas for selected Ward
  const {
    data: mohallas,
    isLoading: mohallasLoading,
    error: mohallasError,
  } = useQuery({
    queryKey: ["mohallas", selectedWard],
    queryFn: () => masterDataApi.getMohallasByWard(selectedWard!),
    enabled: !!selectedWard,
  });

  // Fetch all possible statuses
  const { data: statuses = [] } = useQuery({
    queryKey: ["ward-statuses-master"],
    queryFn: surveyStatusApi.getAllWardStatuses,
  });

  // Helper to get current status for a mohalla (inherited from ward)
  const getCurrentStatusName = (mohalla: any) => {
    return mohalla.inheritedStatus || "Not Started";
  };

  // Filter mohallas based on search term
  const filteredMohallas =
    mohallas?.filter((mohalla: any) =>
      mohalla.mohallaName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted filtered mohallas
  const getSortedFilteredMohallas = () => {
    if (!filteredMohallas || !sortConfig) return filteredMohallas || [];
    
    const sorted = [...filteredMohallas];
    sorted.sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
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
        <h1 className="text-3xl font-bold mb-6">Mohalla Master</h1>

        {/* Selection Dropdowns */}
        <div className="mb-6 flex gap-4">
          <ULBSelector
            value={selectedUlb}
            onChange={(ulbId) => {
              setSelectedUlb(ulbId);
              setSelectedZone(null);
              setSelectedWard(null);
            }}
          />
          <ZoneSelector
            ulbId={selectedUlb}
            value={selectedZone}
            onChange={(zoneId: string | null) => {
              setSelectedZone(zoneId);
              setSelectedWard(null);
            }}
          />
          <WardSelector
            zoneId={selectedZone}
            value={selectedWard}
            onChange={setSelectedWard}
          />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search mohallas by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          {mohallasLoading && (
            <div className="text-gray-400">Loading mohallas...</div>
          )}
          {mohallasError && (
            <div className="text-red-400">Error loading mohallas</div>
          )}
          {!mohallasLoading && !mohallasError && (
            <table className="w-full text-sm bg-gray-800 rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th 
                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                    onClick={() => handleSort("mohallaName")}
                  >
                    Mohalla Name {getSortIcon("mohallaName")}
                  </th>
                  <th className="px-4 py-2 text-left">Survey Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getSortedFilteredMohallas().length > 0 ? (
                  getSortedFilteredMohallas().map((mohalla: any) => (
                    <tr
                      key={mohalla.mohallaId}
                      className="border-b border-gray-700"
                    >
                      <td className="px-4 py-2">{mohalla.mohallaName}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                          {getCurrentStatusName(mohalla)}
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
                      colSpan={3}
                      className="px-4 py-4 text-center text-gray-400"
                    >
                      {selectedWard
                        ? searchTerm
                          ? "No mohallas found matching your search."
                          : "No mohallas found for this ward."
                        : "Select a ULB, Zone, and Ward to view mohallas."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
