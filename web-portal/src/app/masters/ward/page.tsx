"use client";
import React from "react";
import ULBSelector from "@/components/masters/ULBSelector";
import ZoneSelector from "@/components/masters/ZoneSelector";
import { useQuery } from "@tanstack/react-query";

export default function WardMasterPage() {
  const [selectedUlb, setSelectedUlb] = React.useState<string | null>(null);
  const [selectedZone, setSelectedZone] = React.useState<string | null>(null);

  // Fetch wards for selected Zone
  const {
    data: wards,
    isLoading: wardsLoading,
    error: wardsError,
  } = useQuery({
    queryKey: ["wards", selectedZone],
    queryFn: async () => {
      if (!selectedZone) return [];
      const res = await fetch(`/api/wards/zone/${selectedZone}`);
      if (!res.ok) throw new Error("Failed to fetch wards");
      return res.json();
    },
    enabled: !!selectedZone,
  });

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Ward Master</h1>
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
      <div>
        {wardsLoading && <div className="text-gray-400">Loading wards...</div>}
        {wardsError && <div className="text-red-400">Error loading wards</div>}
        {!wardsLoading && !wardsError && (
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Ward Number</th>
                <th className="px-4 py-2 text-left">Ward Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Active</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wards && wards.length > 0 ? (
                wards.map((ward: any) => (
                  <tr key={ward.wardId} className="border-b border-gray-700">
                    <td className="px-4 py-2">{ward.newWardNumber}</td>
                    <td className="px-4 py-2">{ward.wardName}</td>
                    <td className="px-4 py-2">{ward.description}</td>
                    <td className="px-4 py-2">
                      {ward.isActive ? "Yes" : "No"}
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
                    {selectedZone
                      ? "No wards found for this zone."
                      : "Select a ULB and Zone to view wards."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
