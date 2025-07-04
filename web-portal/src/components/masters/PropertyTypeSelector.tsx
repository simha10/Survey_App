"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";

interface SurveyTypeSelectorProps {
  value: string | null;
  onChange: (surveyTypeId: string | null) => void;
}

export default function SurveyTypeSelector({
  value,
  onChange,
}: SurveyTypeSelectorProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["surveyTypes"],
    queryFn: async () => {
      const res = await fetch("/api/masterData/survey-types", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch survey types");
      return res.json();
    },
  });

  return (
    <div>
      <label className="block font-semibold mb-1">
        Survey Type <span className="text-red-500">*</span>
      </label>
      <select
        className="w-full border rounded px-3 py-2"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={isLoading || !!error}
      >
        <option value="">Select Survey Type</option>
        {data &&
          data.map((st: any) => (
            <option key={st.surveyTypeId} value={st.surveyTypeId}>
              {st.surveyTypeName}
            </option>
          ))}
      </select>
      {isLoading && <div className="text-gray-400 mt-1">Loading...</div>}
      {error && (
        <div className="text-red-400 mt-1">Error loading survey types</div>
      )}
    </div>
  );
}
