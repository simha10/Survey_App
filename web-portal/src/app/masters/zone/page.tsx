"use client";
import React, { useState, useEffect } from "react";
import ULBSelector from "@/components/masters/ULBSelector";
import { useQuery } from "@tanstack/react-query";
import { masterDataApi } from "@/lib/api";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";

export default function ZoneMasterPage() {
  const [selectedUlb, setSelectedUlb] = React.useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for consistency
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch zones for selected ULB
  const {
    data: zones,
    isLoading: zonesLoading,
    error: zonesError,
  } = useQuery({
    queryKey: ["zones", selectedUlb],
    queryFn: () => masterDataApi.getZonesByUlb(selectedUlb!),
    enabled: !!selectedUlb,
  });

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <MainLayout>
      <div className="bg-gray-900 min-h-screen p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Zone Master</h1>
        <div className="mb-6">
          <ULBSelector value={selectedUlb} onChange={setSelectedUlb} />
        </div>
        <div>
          {zonesLoading && (
            <div className="text-gray-400">Loading zones...</div>
          )}
          {zonesError && (
            <div className="text-red-400">Error loading zones</div>
          )}
          {!zonesLoading && !zonesError && (
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Zone Number</th>
                  <th className="px-4 py-2 text-left">Zone Name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Active</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones && zones.length > 0 ? (
                  zones.map((zone: any) => (
                    <tr key={zone.zoneId} className="border-b border-gray-700">
                      <td className="px-4 py-2">{zone.zoneNumber}</td>
                      <td className="px-4 py-2">{zone.zoneName}</td>
                      <td className="px-4 py-2">{zone.description}</td>
                      <td className="px-4 py-2">
                        {zone.isActive ? "Yes" : "No"}
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
                      colSpan={5}
                      className="px-4 py-4 text-center text-gray-400"
                    >
                      {selectedUlb
                        ? "No zones found for this ULB."
                        : "Select a ULB to view zones."}
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
