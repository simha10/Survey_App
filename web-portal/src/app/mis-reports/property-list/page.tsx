"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import ULBSelector from "@/components/masters/ULBSelector";
import ZoneSelector from "@/components/masters/ZoneSelector";
import WardSelector from "@/components/masters/WardSelector";
import MohallaSelector from "@/components/masters/MohallaSelector";
import SurveyTypeSelector from "@/components/masters/SurveyTypeSelector";

export default function PropertyListFilterPage() {
  const router = useRouter();
  const [ulbId, setUlbId] = useState<string | null>(null);
  const [zoneId, setZoneId] = useState<string | null>(null);
  const [wardId, setWardId] = useState<string | null>(null);
  const [mohallaId, setMohallaId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [mapId, setMapId] = useState<string>("");
  const [gisId, setGisId] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [surveyTypeId, setSurveyTypeId] = useState<string | null>(null);
  const [subGisId, setSubGisId] = useState<string>("");
  useEffect(() => {
    setZoneId(null);
    setWardId(null);
    setMohallaId(null);
    setUserId(null);
  }, [ulbId]);
  useEffect(() => {
    setWardId(null);
    setMohallaId(null);
    setUserId(null);
  }, [zoneId]);
  useEffect(() => {
    setMohallaId(null);
    setUserId(null);
  }, [wardId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyTypeId || !ulbId) {
      setError("Survey Type and ULB are required.");
      return;
    }
    setError("");
    const params = new URLSearchParams({
      surveyTypeId,
      ulbId,
      zoneId: zoneId || "",
      wardId: wardId || "",
      mohallaId: mohallaId || "",
      userId: userId || "",
      mapId,
      gisId,
      subGisId,
      fromDate,
      toDate,
    });
    window.open(
      `/mis-reports/property-list/full-table?${params.toString()}`,
      "_blank"
    );
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto mt-10">
        <div className="border rounded shadow bg-black">
          <div className="bg-black text-white text-lg font-bold px-6 py-3 rounded-t">
            Property List
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-black text-xs"
          >
            <SurveyTypeSelector
              value={surveyTypeId}
              onChange={setSurveyTypeId}
            />
            <div>
              <ULBSelector value={ulbId} onChange={setUlbId} />
            </div>
            <div>
              <ZoneSelector ulbId={ulbId} value={zoneId} onChange={setZoneId} />
            </div>
            <div>
              <WardSelector
                zoneId={zoneId}
                value={wardId}
                onChange={setWardId}
              />
            </div>
            <MohallaSelector
              wardId={wardId}
              value={mohallaId}
              onChange={setMohallaId}
            />
            <div>
              <label className="block font-semibold mb-1">Map ID</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={mapId}
                onChange={(e) => setMapId(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">GIS ID</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={gisId}
                onChange={(e) => setGisId(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">SubGIS ID</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={subGisId}
                onChange={(e) => setSubGisId(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">From Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">To Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            {error && (
              <div className="md:col-span-2 text-red-500 text-sm">{error}</div>
            )}
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 font-semibold"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
