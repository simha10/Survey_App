"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";

interface ULBSelectorProps {
  value: string | null;
  onChange: (ulbId: string | null) => void;
}

export default function ULBSelector({ value, onChange }: ULBSelectorProps) {
  const {
    data: ulbs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ulbs"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/ulbs", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch ULBs");
      return res.json();
    },
  });

  return (
    <div>
      <label className="block mb-2 text-white font-semibold">Select ULB</label>
      <select
        className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={isLoading || !!error}
      >
        <option value="">-- Select ULB --</option>
        {ulbs &&
          ulbs.length > 0 &&
          ulbs.map((ulb: any) => (
            <option key={ulb.ulbId} value={ulb.ulbId}>
              {ulb.ulbName}
            </option>
          ))}
      </select>
      {isLoading && <div className="text-gray-400 mt-1">Loading ULBs...</div>}
      {error && <div className="text-red-400 mt-1">Error loading ULBs</div>}
    </div>
  );
}
