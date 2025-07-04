"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";
import toast from "react-hot-toast";

interface PropertyDetails {
  surveyUniqueCode: string;
  mapId: string;
  gisId: string;
  propertyType: string;
  oldPropertyType: string;
  ownerName: string;
  respondentName: string;
  ward: { wardName: string } | null;
  zone: { zoneName: string } | null;
  mohalla: { mohallaName: string } | null;
  // ...add all other fields as needed
  [key: string]: any;
}

export default function PropertyQCEditionPage() {
  const router = useRouter();
  const params = useParams();
  const surveyUniqueCode = params.surveyUniqueCode as string;

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProperty();
    // eslint-disable-next-line
  }, [surveyUniqueCode]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/qc/property-list?surveyUniqueCode=${surveyUniqueCode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const prop = (data.data && data.data[0]) || null;
        setProperty(prop);
        setForm(prop);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to fetch property details");
      }
    } catch (e) {
      toast.error("Error fetching property details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/qc/survey/${surveyUniqueCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ updateData: form, qcStatus: "APPROVED" }),
      });
      if (res.ok) {
        toast.success("QC updated successfully");
        router.push("/mis-reports/property-list/results");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update QC");
      }
    } catch (e) {
      toast.error("Error updating QC");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }
  if (!property) {
    return (
      <MainLayout>
        <div className="p-6 text-red-500">Property not found.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow mt-10">
        <h1 className="text-2xl font-bold mb-6">QC Edit - {property.gisId}</h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Example fields, add all as needed */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Map ID
            </label>
            <input
              type="text"
              value={form.mapId || ""}
              onChange={(e) => handleChange("mapId", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              GIS ID
            </label>
            <input
              type="text"
              value={form.gisId || ""}
              onChange={(e) => handleChange("gisId", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <input
              type="text"
              value={form.propertyType || ""}
              onChange={(e) => handleChange("propertyType", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Owner Name
            </label>
            <input
              type="text"
              value={form.ownerName || ""}
              onChange={(e) => handleChange("ownerName", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* Add all other fields as per your schema and UI needs */}
          <div className="md:col-span-2 flex justify-end mt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save QC"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
