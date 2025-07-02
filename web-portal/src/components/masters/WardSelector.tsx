import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { masterDataApi } from "@/lib/api";

interface WardSelectorProps {
  zoneId: string | null;
  value: string | null;
  onChange: (wardId: string | null) => void;
}

export default function WardSelector({
  zoneId,
  value,
  onChange,
}: WardSelectorProps) {
  // Reset selected ward when zoneId changes
  useEffect(() => {
    onChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneId]);

  const {
    data: wards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wards", zoneId],
    queryFn: () => (zoneId ? masterDataApi.getWardsByZone(zoneId) : []),
    enabled: !!zoneId,
  });

  return (
    <div>
      <label className="block mb-2 text-white font-semibold">Select Ward</label>
      <select
        className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={isLoading || !!error || !zoneId}
      >
        <option value="">Select Ward</option>
        {wards &&
          wards.length > 0 &&
          wards.map((ward: any) => (
            <option key={ward.wardId} value={ward.wardId}>
              {ward.newWardNumber} - {ward.wardName}
            </option>
          ))}
      </select>
      {isLoading && <div className="text-gray-400 mt-1">Loading Wards...</div>}
      {error && <div className="text-red-400 mt-1">Error loading Wards</div>}
    </div>
  );
}
