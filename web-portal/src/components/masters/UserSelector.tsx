"use client";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface UserSelectorProps {
  ulbId: string | null;
  zoneId: string | null;
  wardId: string | null;
  value: string | null;
  onChange: (userId: string | null) => void;
}

export default function UserSelector({
  ulbId,
  zoneId,
  wardId,
  value,
  onChange,
}: UserSelectorProps) {
  useEffect(() => {
    onChange(null);
  }, [ulbId, zoneId, wardId]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", ulbId, zoneId, wardId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (ulbId) params.append("ulbId", ulbId);
      if (zoneId) params.append("zoneId", zoneId);
      if (wardId) params.append("wardId", wardId);
      const res = await fetch(`/api/user?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: !!ulbId,
  });
  return (
    <div>
      <label className="block font-semibold mb-1">User</label>
      <select
        className="w-full border rounded px-3 py-2"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={isLoading || !!error || !ulbId}
      >
        <option value="">Select User</option>
        {data &&
          data.users &&
          data.users.map((u: any) => (
            <option key={u.userId} value={u.userId}>
              {u.name || u.username}
            </option>
          ))}
      </select>
      {isLoading && <div className="text-gray-400 mt-1">Loading...</div>}
      {error && <div className="text-red-400 mt-1">Error loading users</div>}
    </div>
  );
}
