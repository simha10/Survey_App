"use client";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { masterDataApi } from "@/lib/api";

interface MohallaSelectorProps {
  wardId: string | null;
  value: string | null;
  onChange: (mohallaId: string | null) => void;
}

export default function MohallaSelector({
  wardId,
  value,
  onChange,
}: MohallaSelectorProps) {
  useEffect(() => {
    onChange(null);
  }, [wardId]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["mohallas", wardId],
    queryFn: () => (wardId ? masterDataApi.getMohallasByWard(wardId) : []),
    enabled: !!wardId,
  });

  return (
    <div>
      <label className="block font-semibold mb-1">Select Mohalla</label>
      <select
        className="w-full border rounded px-3 py-2 bg-gray-800"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={isLoading || !!error || !wardId}
      >
        <option value="" className="bg-gray-800">Select Mohalla</option>
        {data &&
          data.map((m: any) => (
            <option key={m.mohallaId} value={m.mohallaId} className="text-white bg-gray-800 hover:bg-gray-800">
              {m.mohallaName}
            </option>
          ))}
      </select>
      {isLoading && <div className="text-gray-400 mt-1">Loading...</div>}
      {error && <div className="text-red-400 mt-1">Error loading mohallas</div>}
    </div>
  );
}
