"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { masterDataApi } from "@/lib/api";

interface SurveyTypeSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const SurveyTypeSelector: React.FC<SurveyTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["surveyTypes"],
    queryFn: async () => {
      return await masterDataApi.getSurveyTypes();
    },
  });

  return (
    <div>
      <label className="block mb-2 text-white font-semibold">
        Survey Type <span className="text-red-500">*</span>
      </label>
      <select
        className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={isLoading || !!error}
        required
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
};

export default SurveyTypeSelector;
