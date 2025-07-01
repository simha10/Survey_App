"use client";
import React from "react";
import ULBSelector from "@/components/masters/ULBSelector";
import ZoneSelector from "@/components/masters/ZoneSelector";
import WardSelector from "@/components/masters/WardSelector";
import { useQuery } from "@tanstack/react-query";

export default function MohallaMasterPage() {
  const [selectedUlb, setSelectedUlb] = React.useState<string | null>(null);
  const [selectedZone, setSelectedZone] = React.useState<string | null>(null);
  const [selectedWard, setSelectedWard] = React.useState<string | null>(null);

  // Fetch mohallas for selected Ward
  const {
    data: mohallas,
    isLoading: mohallasLoading,
    error: mohallasError,
  } = useQuery({
    queryKey: ["mohallas", selectedWard],
    queryFn: async () => {
      if (!selectedWard) return [];
      const res = await fetch(`/api/mohallas/ward/${selectedWard}`);
      if (!res.ok) throw new Error("Failed to fetch mohallas");
      return res.json();
    },
    enabled: !!selectedWard,
  });

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Mohalla Master</h1>
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
      <div>
        {mohallasLoading && (
          <div className="text-gray-400">Loading mohallas...</div>
        )}
        {mohallasError && (
          <div className="text-red-400">Error loading mohallas</div>
        )}
        {!mohallasLoading && !mohallasError && (
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Mohalla Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Active</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mohallas && mohallas.length > 0 ? (
                mohallas.map((mohalla: any) => (
                  <tr
                    key={mohalla.mohallaId}
                    className="border-b border-gray-700"
                  >
                    <td className="px-4 py-2">{mohalla.mohallaName}</td>
                    <td className="px-4 py-2">{mohalla.description}</td>
                    <td className="px-4 py-2">
                      {mohalla.isActive ? "Yes" : "No"}
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
                    {selectedWard
                      ? "No mohallas found for this ward."
                      : "Select a ULB, Zone, and Ward to view mohallas."}
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
