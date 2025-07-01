import React from "react";
import { useQuery } from "@tanstack/react-query";

interface ZoneSelectorProps {
  ulbId: string | null;
  value: string | null;
  onChange: (zoneId: string | null) => void;
}

export default function ZoneSelector({
  ulbId,
  value,
  onChange,
}: ZoneSelectorProps) {
  const {
    data: zones,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["zones", ulbId],
    queryFn: async () => {
      if (!ulbId) return [];
      const res = await fetch(`/api/zones/ulb/${ulbId}`);
      if (!res.ok) throw new Error("Failed to fetch zones");
      return res.json();
    },
    enabled: !!ulbId,
  });

  return (
    <div>
      <label className="block mb-2 text-white font-semibold">Select Zone</label>
      <select
        className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={isLoading || !!error || !ulbId}
      >
        <option value="">-- Select Zone --</option>
        {zones &&
          zones.length > 0 &&
          zones.map((zone: any) => (
            <option key={zone.zoneId} value={zone.zoneId}>
              {zone.zoneNumber} - {zone.zoneName}
            </option>
          ))}
      </select>
      {isLoading && <div className="text-gray-400 mt-1">Loading Zones...</div>}
      {error && <div className="text-red-400 mt-1">Error loading Zones</div>}
    </div>
  );
}
