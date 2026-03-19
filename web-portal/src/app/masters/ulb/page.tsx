"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { masterDataApi } from "@/lib/api";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";

export default function UlbMasterPage() {
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

  // Fetch ULBs with statistics
  const {
    data: ulbs,
    isLoading: ulbsLoading,
    error: ulbsError,
  } = useQuery({
    queryKey: ["ulbs-with-stats"],
    queryFn: () => masterDataApi.getUlbsWithStats(),
  });

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted ULBs
  const getSortedUlbs = () => {
    if (!ulbs || !sortConfig) return ulbs || [];
    
    const sorted = [...ulbs];
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
        <h1 className="text-3xl font-bold mb-6">ULB Master</h1>

        <div>
          {ulbsLoading && (
            <div className="text-gray-400">Loading ULBs...</div>
          )}
          {ulbsError && (
            <div className="text-red-400">Error loading ULBs</div>
          )}
          {!ulbsLoading && !ulbsError && (
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden text-sm">
              <thead>
                <tr>
                  <th 
                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                    onClick={() => handleSort("ulbCode")}
                  >
                    ULB Code {getSortIcon("ulbCode")}
                  </th>
                  <th 
                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                    onClick={() => handleSort("ulbName")}
                  >
                    Name {getSortIcon("ulbName")}
                  </th>
                  <th 
                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                    onClick={() => handleSort("totalZones")}
                  >
                    No. of Zones {getSortIcon("totalZones")}
                  </th>
                  <th 
                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                    onClick={() => handleSort("totalWards")}
                  >
                    No. of Wards {getSortIcon("totalWards")}
                  </th>
                  <th 
                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                    onClick={() => handleSort("totalMohallas")}
                  >
                    No. of Mohallas {getSortIcon("totalMohallas")}
                  </th>
                  <th className="px-4 py-2 text-left">Active</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getSortedUlbs().length > 0 ? (
                  getSortedUlbs().map((ulb: any) => (
                    <tr key={ulb.ulbId} className="border-b border-gray-700">
                      <td className="px-4 py-2">{ulb.ulbCode}</td>
                      <td className="px-4 py-2">{ulb.ulbName}</td>
                      <td className="px-4 py-2">{ulb.totalZones}</td>
                      <td className="px-4 py-2">{ulb.totalWards}</td>
                      <td className="px-4 py-2">{ulb.totalMohallas}</td>
                      <td className="px-4 py-2">
                        {ulb.isActive ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2">{ulb.description || "-"}</td>
                      <td className="px-4 py-2">
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
                    <td colSpan={8} className="px-4 py-4 text-center text-gray-400">
                      No ULBs found.
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
