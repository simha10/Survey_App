"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PropertyDetails {
  surveyUniqueCode: string;
  mapId: number;
  gisId: string;
  subGisId?: string;
  parcelId?: number;
  entryDate: string;
  createdAt: string;
  updatedAt: string;

  // Related data
  ulb?: { ulbName: string };
  zone?: { zoneName: string };
  ward?: { wardName: string };
  mohalla?: { mohallaName: string };
  uploadedBy?: { userName: string };

  // Detailed sections
  locationDetails?: {
    propertyLatitude?: number;
    propertyLongitude?: number;
    assessmentYear: string;
    propertyTypeId?: number;
    buildingName?: string;
    roadTypeId: number;
    constructionYear: string;
    constructionTypeId: number;
    addressRoadName: string;
    locality?: string;
    pinCode: number;
    landmark?: string;
    fourWayEast?: string;
    fourWayWest?: string;
    fourWayNorth?: string;
    fourWaySouth?: string;
    newWardNumber: string;
    propertyType?: { propertyTypeName: string };
    roadType?: { roadTypeName: string };
    constructionType?: { constructionTypeName: string };
  };

  propertyDetails?: {
    responseTypeId: number;
    oldHouseNumber?: string;
    electricityConsumerName?: string;
    waterSewerageConnectionNumber?: string;
    respondentName: string;
    respondentStatusId: number;
    responseType?: { responseTypeName: string };
    respondentStatus?: { respondentStatusName: string };
  };

  ownerDetails?: {
    ownerName: string;
    fatherHusbandName: string;
    mobileNumber?: string;
    aadharNumber?: string;
  };

  otherDetails?: {
    waterSourceId: number;
    rainWaterHarvestingSystem: string;
    plantation?: string;
    parking?: string;
    pollution?: string;
    pollutionMeasurementTaken?: string;
    waterSupplyWithin200Meters: string;
    sewerageLineWithin100Meters: string;
    disposalTypeId: number;
    totalPlotArea: number;
    builtupAreaOfGroundFloor: number;
    remarks?: string;
    waterSource?: { waterSourceName: string };
    disposalType?: { disposalTypeName: string };
  };

  qcRecords?: Array<{
    qcRecordId: string;
    qcLevel: number;
    qcStatus: string;
    reviewedById: string;
    remarks?: string;
    reviewedAt: string;
    isError?: boolean;
    errorType?: string;
    gisTeamRemark?: string;
    surveyTeamRemark?: string;
    RIRemark?: string;
    reviewedBy?: { userName: string };
  }>;

  residentialPropertyAssessments?: Array<{
    floorAssessmentId: string;
    floorNumberId: number;
    occupancyStatusId: number;
    constructionNatureId: number;
    coveredArea: number;
    allRoomVerandaArea?: number;
    allBalconyKitchenArea?: number;
    allGarageArea?: number;
    carpetArea: number;
    floorMaster?: { floorNumberName: string };
    occupancyStatus?: { occupancyStatusName: string };
    constructionNature?: { constructionNatureName: string };
  }>;

  nonResidentialPropertyAssessments?: Array<{
    floorAssessmentId: string;
    floorNumberId: number;
    nrPropertyCategoryId: number;
    nrSubCategoryId: number;
    establishmentName: string;
    licenseNo?: string;
    licenseExpiryDate?: string;
    occupancyStatusId: number;
    constructionNatureId: number;
    builtupArea: number;
    nrPropertyCategory?: { propertyCategoryName: string };
    nrSubCategory?: { subCategoryName: string };
    floorMaster?: { floorNumberName: string };
    occupancyStatus?: { occupancyStatusName: string };
    constructionNature?: { constructionNatureName: string };
  }>;

  propertyAttachments?: {
    image1Url?: string;
    image2Url?: string;
    image3Url?: string;
    image4Url?: string;
    image5Url?: string;
    image6Url?: string;
    image7Url?: string;
    image8Url?: string;
    image9Url?: string;
    image10Url?: string;
  };
}

const ERROR_TYPE_OPTIONS = [
  { value: "MISSING", label: "Missing" },
  { value: "DUPLICATE", label: "Duplicate" },
  { value: "OTHER", label: "Other" },
  { value: "NONE", label: "None" },
];

const QC_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ERROR", label: "Error" },
];

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PropertyQCEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const surveyUniqueCode = params.surveyUniqueCode as string;
  const surveyTypeId = searchParams.get("surveyTypeId") || "";

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [assessmentRows, setAssessmentRows] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    fetchProperty();
    // eslint-disable-next-line
  }, [surveyUniqueCode]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/qc/property/${surveyUniqueCode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setProperty(data);
        setForm(data);
        setAssessmentRows(data.residentialPropertyAssessments || []);
        setAttachments(
          data.propertyAttachments
            ? Object.entries(data.propertyAttachments).filter(([k, v]) => v)
            : []
        );
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

  const handleNestedChange = (section: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleAssessmentChange = (idx: number, field: string, value: any) => {
    setAssessmentRows((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };
  const handleAddAssessmentRow = () => {
    setAssessmentRows((prev) => [
      ...prev,
      {
        floorNumberId: "",
        occupancyStatusId: "",
        constructionNatureId: "",
        coveredArea: "",
        allRoomVerandaArea: "",
        allBalconyKitchenArea: "",
        allGarageArea: "",
        carpetArea: "",
      },
    ]);
  };
  const handleDeleteAssessmentRow = (idx: number) => {
    setAssessmentRows((prev) => prev.filter((_, i) => i !== idx));
  };

  // UI-only for attachments
  const handleDeleteAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleAddAttachment = () => {
    setAttachments((prev) => [...prev, ["photo", ""]]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/qc/survey/${surveyUniqueCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          updateData: form,
          qcStatus: "APPROVED",
          qcLevel: 1,
          remarks: form.qcRecords?.[0]?.remarks || "",
          isError: form.qcRecords?.[0]?.isError || false,
          errorType: form.qcRecords?.[0]?.errorType || "NONE",
          gisTeamRemark: form.qcRecords?.[0]?.gisTeamRemark || "",
          surveyTeamRemark: form.qcRecords?.[0]?.surveyTeamRemark || "",
          RIRemark: form.qcRecords?.[0]?.RIRemark || "",
        }),
      });
      if (res.ok) {
        toast.success("QC updated successfully");
        router.push("/mis-reports/property-list/full-table");
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

  let heading = "Assessment Property";
  if (surveyTypeId === "1") heading = "Assessment Residential Property";
  else if (surveyTypeId === "2")
    heading = "Assessment Non-Residential Property";
  else if (surveyTypeId === "3") heading = "Assessment Mix Property";

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!property) {
    return <div className="p-6 text-red-500">Property not found.</div>;
  }

  return (
    <div className="bg-black min-h-screen w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 text-white p-8 text-sm"
      >
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
          {heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label>Property Code</label>
            <input
              className="input-dark"
              value={form.surveyUniqueCode || ""}
              disabled
            />
          </div>
          <div>
            <label>Old House Number</label>
            <input
              className="input-dark"
              value={form.propertyDetails?.oldHouseNumber || ""}
              onChange={(e) =>
                handleNestedChange(
                  "propertyDetails",
                  "oldHouseNumber",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>New Property</label>
            <input
              className="input-dark"
              value={form.propertyDetails?.newProperty || ""}
              onChange={(e) =>
                handleNestedChange(
                  "propertyDetails",
                  "newProperty",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Electricity Consumer Number</label>
            <input
              className="input-dark"
              value={form.propertyDetails?.electricityConsumerName || ""}
              onChange={(e) =>
                handleNestedChange(
                  "propertyDetails",
                  "electricityConsumerName",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Water Sewerage Connection Number</label>
            <input
              className="input-dark"
              value={form.propertyDetails?.waterSewerageConnectionNumber || ""}
              onChange={(e) =>
                handleNestedChange(
                  "propertyDetails",
                  "waterSewerageConnectionNumber",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Respondent Name</label>
            <input
              className="input-dark"
              value={form.propertyDetails?.respondentName || ""}
              onChange={(e) =>
                handleNestedChange(
                  "propertyDetails",
                  "respondentName",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Respondent Status</label>
            <input
              className="input-dark"
              value={form.propertyDetails?.respondentStatus || ""}
              onChange={(e) =>
                handleNestedChange(
                  "propertyDetails",
                  "respondentStatus",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>MAP ID</label>
            <input
              className="input-dark"
              value={form.mapId || ""}
              onChange={(e) => handleChange("mapId", e.target.value)}
            />
          </div>
          <div>
            <label>GIS ID</label>
            <input
              className="input-dark"
              value={form.gisId || ""}
              onChange={(e) => handleChange("gisId", e.target.value)}
            />
          </div>
          <div>
            <label>SUB GIS ID</label>
            <input
              className="input-dark"
              value={form.subGisId || ""}
              onChange={(e) => handleChange("subGisId", e.target.value)}
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 mt-8 border-b border-gray-700 pb-1">
          Property Location Detail
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label>Assessment Year</label>
            <input
              className="input-dark"
              value={form.locationDetails?.assessmentYear || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "assessmentYear",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Zone</label>
            <input
              className="input-dark bg-gray-700"
              value={form.zone?.zoneName || ""}
              disabled
            />
          </div>
          <div>
            <label>Ward</label>
            <input
              className="input-dark bg-gray-700"
              value={form.ward?.wardName || ""}
              disabled
            />
          </div>
          <div>
            <label>Mohalla</label>
            <input
              className="input-dark bg-gray-700"
              value={form.mohalla?.mohallaName || ""}
              disabled
            />
          </div>
          <div>
            <label>Property Type</label>
            <input
              className="input-dark"
              value={form.locationDetails?.propertyType || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "propertyType",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Building Name</label>
            <input
              className="input-dark"
              value={form.locationDetails?.buildingName || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "buildingName",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Road Type</label>
            <input
              className="input-dark"
              value={form.locationDetails?.roadType || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "roadType",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Construction Year</label>
            <input
              className="input-dark"
              value={form.locationDetails?.constructionYear || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "constructionYear",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Road Name</label>
            <input
              className="input-dark"
              value={form.locationDetails?.addressRoadName || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "addressRoadName",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Pin Code</label>
            <input
              className="input-dark"
              value={form.locationDetails?.pinCode || ""}
              onChange={(e) =>
                handleNestedChange("locationDetails", "pinCode", e.target.value)
              }
            />
          </div>
          <div>
            <label>Locality</label>
            <input
              className="input-dark"
              value={form.locationDetails?.locality || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "locality",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Landmark</label>
            <input
              className="input-dark"
              value={form.locationDetails?.landmark || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "landmark",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Property Latitude</label>
            <input
              className="input-dark"
              value={form.locationDetails?.propertyLatitude || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "propertyLatitude",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Property Longitude</label>
            <input
              className="input-dark"
              value={form.locationDetails?.propertyLongitude || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "propertyLongitude",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Four Way- East</label>
            <input
              className="input-dark"
              value={form.locationDetails?.fourWayEast || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "fourWayEast",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Four Way- West</label>
            <input
              className="input-dark"
              value={form.locationDetails?.fourWayWest || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "fourWayWest",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Four Way- North</label>
            <input
              className="input-dark"
              value={form.locationDetails?.fourWayNorth || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "fourWayNorth",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Four Way- South</label>
            <input
              className="input-dark"
              value={form.locationDetails?.fourWaySouth || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "fourWaySouth",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>New Ward</label>
            <input
              className="input-dark"
              value={form.locationDetails?.newWardNumber || ""}
              onChange={(e) =>
                handleNestedChange(
                  "locationDetails",
                  "newWardNumber",
                  e.target.value
                )
              }
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 mt-8 border-b border-gray-700 pb-1">
          Property Owner Detail
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label>Owner Name</label>
            <input
              className="input-dark"
              value={form.ownerDetails?.ownerName || ""}
              onChange={(e) =>
                handleNestedChange("ownerDetails", "ownerName", e.target.value)
              }
            />
          </div>
          <div>
            <label>Father/Husband Name</label>
            <input
              className="input-dark"
              value={form.ownerDetails?.fatherHusbandName || ""}
              onChange={(e) =>
                handleNestedChange(
                  "ownerDetails",
                  "fatherHusbandName",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Mobile Number</label>
            <input
              className="input-dark"
              value={form.ownerDetails?.mobileNumber || ""}
              onChange={(e) =>
                handleNestedChange(
                  "ownerDetails",
                  "mobileNumber",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Aadhar Number</label>
            <input
              className="input-dark"
              value={form.ownerDetails?.aadharNumber || ""}
              onChange={(e) =>
                handleNestedChange(
                  "ownerDetails",
                  "aadharNumber",
                  e.target.value
                )
              }
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 mt-8 border-b border-gray-700 pb-1">
          Other Detail
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label>Source Of Water</label>
            <input
              className="input-dark"
              value={form.otherDetails?.waterSourceId || ""}
              onChange={(e) =>
                handleNestedChange(
                  "otherDetails",
                  "waterSourceId",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <label>Rain Harvesting System (Is Available)</label>
            <select
              className="input-dark"
              value={form.otherDetails?.rainWaterHarvestingSystem || ""}
              onChange={(e) =>
                handleNestedChange(
                  "otherDetails",
                  "rainWaterHarvestingSystem",
                  e.target.value
                )
              }
            >
              <option value="">Select</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 mt-8 border-b border-gray-700 pb-1">
          Property Assessment Detail
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-gray-800 text-white rounded-lg">
            <thead>
              <tr>
                <th className="px-2 py-1">Floor Number</th>
                <th className="px-2 py-1">Occupancy Status</th>
                <th className="px-2 py-1">Construction Nature</th>
                <th className="px-2 py-1">Covered Area</th>
                <th className="px-2 py-1">All Room/Veranda Area</th>
                <th className="px-2 py-1">All Balcony/Kitchen Area</th>
                <th className="px-2 py-1">All Garage Area</th>
                <th className="px-2 py-1">Carpet Area</th>
                <th className="px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {assessmentRows.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      className="input-dark w-24"
                      value={row.floorNumberId || ""}
                      onChange={(e) =>
                        handleAssessmentChange(
                          idx,
                          "floorNumberId",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input-dark w-24"
                      value={row.occupancyStatusId || ""}
                      onChange={(e) =>
                        handleAssessmentChange(
                          idx,
                          "occupancyStatusId",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input-dark w-24"
                      value={row.constructionNatureId || ""}
                      onChange={(e) =>
                        handleAssessmentChange(
                          idx,
                          "constructionNatureId",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input-dark w-24"
                      value={row.coveredArea || ""}
                      onChange={(e) =>
                        handleAssessmentChange(
                          idx,
                          "coveredArea",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input-dark w-24"
                      value={row.allRoomVerandaArea || ""}
                      onChange={(e) =>
                        handleAssessmentChange(
                          idx,
                          "allRoomVerandaArea",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input-dark w-24"
                      value={row.allBalconyKitchenArea || ""}
                      onChange={(e) =>
                        handleAssessmentChange(
                          idx,
                          "allBalconyKitchenArea",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input-dark w-24"
                      value={row.allGarageArea || ""}
                      onChange={(e) =>
                        handleAssessmentChange(
                          idx,
                          "allGarageArea",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input-dark w-24"
                      value={row.carpetArea || ""}
                      onChange={(e) =>
                        handleAssessmentChange(
                          idx,
                          "carpetArea",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="text-red-400"
                      onClick={() => handleDeleteAssessmentRow(idx)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="mt-2 px-4 py-1 bg-blue-700 rounded"
            onClick={handleAddAssessmentRow}
          >
            Add
          </button>
        </div>
        <h3 className="text-xl font-semibold mb-2 mt-8 border-b border-gray-700 pb-1">
          Upload Property Document/Photo
        </h3>
        <div className="bg-gray-800 p-4 rounded mb-6">
          <table className="min-w-full text-white">
            <thead>
              <tr>
                <th className="px-2 py-1">Attachment Name</th>
                <th className="px-2 py-1">Upload Attachment</th>
                <th className="px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {attachments.map(([name, url], idx) => (
                <tr key={idx}>
                  <td>{name}</td>
                  <td>
                    {url ? (
                      <img
                        src={url}
                        alt="attachment"
                        className="w-12 h-12 object-cover"
                      />
                    ) : (
                      <span className="italic text-gray-400">No file</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="text-red-400"
                      onClick={() => handleDeleteAttachment(idx)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 mt-2">
            <select className="input-dark w-32">
              <option>photo</option>
            </select>
            <input type="file" className="input-dark w-48" disabled />
            <button
              type="button"
              className="bg-blue-700 px-3 py-1 rounded"
              onClick={handleAddAttachment}
            >
              Add
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label>Remarks</label>
            <textarea
              className="input-dark"
              value={form.qcRecords?.[0]?.remarks || ""}
              onChange={(e) => {
                const updatedQcRecords = [...(form.qcRecords || [])];
                if (updatedQcRecords.length > 0) {
                  updatedQcRecords[0] = {
                    ...updatedQcRecords[0],
                    remarks: e.target.value,
                  };
                } else {
                  updatedQcRecords.push({ remarks: e.target.value });
                }
                handleChange("qcRecords", updatedQcRecords);
              }}
              rows={3}
            />
          </div>
          <div>
            <label>Transfer Property</label>
            <div className="flex gap-2">
              <select className="input-dark w-32">
                <option>Select-</option>
              </select>
              <button type="button" className="bg-blue-700 px-3 py-1 rounded">
                Transfer
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2 bg-green-700 text-white rounded font-bold hover:bg-green-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
      <style jsx global>{`
        .input-dark {
          background: #222;
          color: #fff;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 6px 10px;
          width: 100%;
        }
        .input-dark:disabled {
          background: #444;
          color: #bbb;
        }
        label {
          font-weight: 500;
          margin-bottom: 2px;
          display: block;
        }
      `}</style>
    </div>
  );
}
