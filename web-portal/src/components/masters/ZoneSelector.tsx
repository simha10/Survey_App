import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { masterDataApi } from "@/lib/api";

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
  // Reset selected zone when ulbId changes
  useEffect(() => {
    onChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ulbId]);

  const {
    data: zones,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["zones", ulbId],
    queryFn: () => (ulbId ? masterDataApi.getZonesByUlb(ulbId) : []),
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
        <option value="">Select Zone</option>
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
