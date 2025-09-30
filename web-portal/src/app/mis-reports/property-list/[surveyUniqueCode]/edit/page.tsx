"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Loading from "@/components/ui/loading";
import toast from "react-hot-toast";
import QCRemarksPanel from "@/components/qc/QCRemarksPanel";

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

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function PropertyQCEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const surveyUniqueCode = params.surveyUniqueCode as string;
  const surveyTypeId = searchParams.get("surveyTypeId") || "";

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
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
      console.log("Fetching property with:", {
        baseUrl,
        surveyUniqueCode,
        fullUrl: `${baseUrl}/api/qc/property/${surveyUniqueCode}`,
        token: localStorage.getItem("auth_token") ? "Present" : "Missing",
      });

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
        console.log("Fetched property data:", data); // Debug log
        setProperty(data);
        setForm(data);

        // Initialize assessment rows based on survey type
        if (
          data.residentialPropertyAssessments &&
          data.residentialPropertyAssessments.length > 0
        ) {
          setAssessmentRows(data.residentialPropertyAssessments);
        } else {
          // Add default empty row if no assessments exist
          setAssessmentRows([
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
        }

        // Initialize attachments
        if (data.propertyAttachments) {
          const attachmentEntries = Object.entries(data.propertyAttachments)
            .filter(([key, value]) => value && value !== "")
            .map(([key, value]) => [key, value]);
          setAttachments(attachmentEntries);
        } else {
          setAttachments([]);
        }

        setErrorMsg("");
      } else {
        let errMsg = `Error ${res.status}: `;
        if (res.status === 401) errMsg += "Unauthorized: Please login.";
        else if (res.status === 403)
          errMsg += "Forbidden: You do not have access.";
        else if (res.status === 404) errMsg += "Property not found.";
        else errMsg += "Failed to fetch property details.";
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.error ? `${errMsg} (${err.error})` : errMsg);
        setProperty(null);
      }
    } catch (e) {
      console.error("Error fetching property:", e);
      setErrorMsg("Error fetching property details");
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
      // Sync assessmentRows into form before submit
      let updateData = { ...form };
      if (surveyTypeId === "1" || surveyTypeId === "3") {
        updateData.residentialPropertyAssessments = assessmentRows;
      }
      if (surveyTypeId === "2" || surveyTypeId === "3") {
        updateData.nonResidentialPropertyAssessments = assessmentRows;
      }
      // Attachments are UI-only for now (not sent)
      const res = await fetch(`${baseUrl}/api/qc/survey/${surveyUniqueCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          updateData,
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
    return (
      <div className="p-6 text-red-500">
        {errorMsg || "Property not found."}
        <div className="mt-2 text-xs text-gray-400">
          Check your login, user role, and property code.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen w-full">
      {/* Header Section */}
      <div className="bg-gray-800 text-white py-4 px-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">NP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">PROPERTY INFORMATION SYSTEM</h1>
              <p className="text-sm text-gray-300">Nagar Palika Parishad</p>
            </div>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 text-white p-8 text-xs w-full mx-auto"
      >
        <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">
          {heading}
        </h2>

        {/* Assessment-Residential Property */}
        <div className="mb-6 border rounded shadow bg-gray-800">
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 bg-gray-800 text-xs">
            <div>
              <label className="block text-gray-300 mb-1">Property Code</label>
              <input
                className="input-dark"
                value={form.surveyUniqueCode || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">
                Old House Number
              </label>
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
              <label className="block text-gray-300 mb-1">New Property</label>
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
              <label className="block text-gray-300 mb-1">
                Electricity Consumer Number
              </label>
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
              <label className="block text-gray-300 mb-1">
                Water Sewerage Connection Number
              </label>
              <input
                className="input-dark"
                value={
                  form.propertyDetails?.waterSewerageConnectionNumber || ""
                }
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
              <label className="block text-gray-300 mb-1">
                Respondent Name
              </label>
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
              <label className="block text-gray-300 mb-1">
                Respondent Status
              </label>
              <select
                className="input-dark"
                value={form.propertyDetails?.respondentStatusId || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "propertyDetails",
                    "respondentStatusId",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option value="1">Owner</option>
                <option value="2">Tenant</option>
                <option value="3">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">MAP ID</label>
              <input className="input-dark" value={form.mapId || ""} disabled />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">GIS ID</label>
              <input className="input-dark" value={form.gisId || ""} disabled />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">SUB GIS ID</label>
              <input
                className="input-dark"
                value={form.subGisId || ""}
                onChange={(e) => handleChange("subGisId", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Property Location Detail */}
        <div className="mb-6 border rounded shadow bg-gray-800">
          <div className="bg-gray-800 text-white text-lg font-bold px-6 py-3 rounded-t border-b border-gray-600">
            Property Location Detail
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 bg-gray-800 text-xs">
            <div>
              <label className="block text-gray-300 mb-1">
                Assessment Year
              </label>
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
              <label className="block text-gray-300 mb-1">Zone</label>
              <input
                className="input-dark"
                value={form.zone?.zoneName || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Ward</label>
              <input
                className="input-dark"
                value={form.ward?.wardName || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Mohalla</label>
              <input
                className="input-dark"
                value={form.mohalla?.mohallaName || ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Property Type</label>
              <select
                className="input-dark"
                value={form.locationDetails?.propertyTypeId || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "locationDetails",
                    "propertyTypeId",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option value="1">Residential</option>
                <option value="2">Non-Residential</option>
                <option value="3">Mix</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Building Name</label>
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
              <label className="block text-gray-300 mb-1">Road Type</label>
              <select
                className="input-dark"
                value={form.locationDetails?.roadTypeId || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "locationDetails",
                    "roadTypeId",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option value="1">Main Road</option>
                <option value="2">Street</option>
                <option value="3">Lane</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">
                Construction Year
              </label>
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
              <label className="block text-gray-300 mb-1">Locality</label>
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
              <label className="block text-gray-300 mb-1">Pin Code</label>
              <input
                className="input-dark"
                value={form.locationDetails?.pinCode || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "locationDetails",
                    "pinCode",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Road Name</label>
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
              <label className="block text-gray-300 mb-1">
                Property Latitude
              </label>
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
              <label className="block text-gray-300 mb-1">Landmark</label>
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
              <label className="block text-gray-300 mb-1">
                Property Longitude
              </label>
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
              <label className="block text-gray-300 mb-1">Four Way- East</label>
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
              <label className="block text-gray-300 mb-1">Four Way- West</label>
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
              <label className="block text-gray-300 mb-1">
                Four Way- North
              </label>
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
              <label className="block text-gray-300 mb-1">
                Four Way- South
              </label>
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
              <label className="block text-gray-300 mb-1">New Ward</label>
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
        </div>

        {/* Property Owner Detail */}
        <div className="mb-6 border rounded shadow bg-gray-800">
          <div className="bg-gray-800 text-white text-lg font-bold px-6 py-3 rounded-t border-b border-gray-600">
            Property Owner Detail
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 bg-gray-800 text-xs">
            <div>
              <label className="block text-gray-300 mb-1">Owner Name</label>
              <input
                className="input-dark"
                value={form.ownerDetails?.ownerName || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "ownerDetails",
                    "ownerName",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">
                Father/Husband Name
              </label>
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
              <label className="block text-gray-300 mb-1">Mobile Number</label>
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
              <label className="block text-gray-300 mb-1">Email Id</label>
              <input
                className="input-dark"
                value={form.ownerDetails?.emailId || ""}
                onChange={(e) =>
                  handleNestedChange("ownerDetails", "emailId", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Aadhar Number</label>
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
            <div>
              <label className="block text-gray-300 mb-1">
                Cancellation Date
              </label>
              <input
                className="input-dark"
                placeholder="When property divided between family"
                value={form.ownerDetails?.cancellationDate || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "ownerDetails",
                    "cancellationDate",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Other Detail */}
        <div className="mb-6 border rounded shadow bg-gray-800">
          <div className="bg-gray-800 text-white text-lg font-bold px-6 py-3 rounded-t border-b border-gray-600">
            Other Detail
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 bg-gray-800 text-xs">
            <div>
              <label className="block text-gray-300 mb-1">
                Source Of Water
              </label>
              <select
                className="input-dark"
                value={form.otherDetails?.waterSourceId || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "otherDetails",
                    "waterSourceId",
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option value="1">Own</option>
                <option value="2">Municipal</option>
                <option value="3">Borewell</option>
                <option value="4">Handpump</option>
                <option value="5">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">
                Rain Harvesting System (Is Available)
              </label>
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
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={
                    form.otherDetails?.waterSupplyWithin200Meters === "YES"
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      "otherDetails",
                      "waterSupplyWithin200Meters",
                      e.target.checked ? "YES" : "NO"
                    )
                  }
                />
                <span className="text-gray-300">
                  Water Supply within 200 Meter
                </span>
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={
                    form.otherDetails?.sewerageLineWithin100Meters === "YES"
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      "otherDetails",
                      "sewerageLineWithin100Meters",
                      e.target.checked ? "YES" : "NO"
                    )
                  }
                />
                <span className="text-gray-300">
                  Sewarage Line within 100 Meter
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Property Assessment Detail */}
        <div className="mb-6 border rounded shadow bg-gray-800">
          <div className="bg-gray-800 text-white text-lg font-bold px-6 py-3 rounded-t border-b border-gray-600">
            Property Assessment Detail
          </div>
          <div className="p-6 bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-1">
                  Total Plot Area
                </label>
                <input
                  className="input-dark"
                  value={form.otherDetails?.totalPlotArea || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "otherDetails",
                      "totalPlotArea",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">
                  Builtup Area Of Ground Floor
                </label>
                <input
                  className="input-dark"
                  value={form.otherDetails?.builtupAreaOfGroundFloor || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "otherDetails",
                      "builtupAreaOfGroundFloor",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* Table for assessment rows */}
            <table className="w-full text-xs border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 px-2 py-2">
                    Floor Number
                  </th>
                  <th className="border border-gray-600 px-2 py-2">
                    Occupancy Status
                  </th>
                  <th className="border border-gray-600 px-2 py-2">
                    Construction Nature
                  </th>
                  <th className="border border-gray-600 px-2 py-2">
                    Covered Area
                  </th>
                  <th className="border border-gray-600 px-2 py-2">
                    All Room/Veranda Area
                  </th>
                  <th className="border border-gray-600 px-2 py-2">
                    All Balcony/Kitchen Area
                  </th>
                  <th className="border border-gray-600 px-2 py-2">
                    All Garage Area
                  </th>
                  <th className="border border-gray-600 px-2 py-2">
                    Carpet Area
                  </th>
                  <th className="border border-gray-600 px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {assessmentRows.map((row, idx) => (
                  <tr key={idx} className="bg-gray-800">
                    <td className="border border-gray-600 px-2 py-1">
                      <input
                        className="input-dark w-full"
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
                    <td className="border border-gray-600 px-2 py-1">
                      <input
                        className="input-dark w-full"
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
                    <td className="border border-gray-600 px-2 py-1">
                      <input
                        className="input-dark w-full"
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
                    <td className="border border-gray-600 px-2 py-1">
                      <input
                        className="input-dark w-full"
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
                    <td className="border border-gray-600 px-2 py-1">
                      <input
                        className="input-dark w-full"
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
                    <td className="border border-gray-600 px-2 py-1">
                      <input
                        className="input-dark w-full"
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
                    <td className="border border-gray-600 px-2 py-1">
                      <input
                        className="input-dark w-full"
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
                    <td className="border border-gray-600 px-2 py-1">
                      <input
                        className="input-dark w-full"
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
                    <td className="border border-gray-600 px-2 py-1">
                      <button
                        type="button"
                        className="btn-danger text-xs"
                        onClick={() => handleDeleteAssessmentRow(idx)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-800">
                  <td
                    colSpan={8}
                    className="border border-gray-600 px-2 py-1 text-right"
                  >
                    <button
                      type="button"
                      className="btn-success text-xs"
                      onClick={handleAddAssessmentRow}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Property Document/Photo */}
        <div className="mb-6 border rounded shadow bg-gray-800">
          <div className="bg-gray-800 text-white text-lg font-bold px-6 py-3 rounded-t border-b border-gray-600">
            Upload Property Document/Photo
          </div>
          <div className="p-6 bg-gray-800">
            <table className="w-full text-xs border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 px-2 py-2">
                    Attachment Name
                  </th>
                  <th className="border border-gray-600 px-2 py-2">
                    Upload Attachment
                  </th>
                  <th className="border border-gray-600 px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {attachments.map(([name, url], idx) => (
                  <tr key={idx} className="bg-gray-800">
                    <td className="border border-gray-600 px-2 py-1">{name}</td>
                    <td className="border border-gray-600 px-2 py-1">
                      {url ? (
                        <img
                          src={url}
                          alt="attachment"
                          className="w-12 h-12 object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No file chosen</span>
                      )}
                    </td>
                    <td className="border border-gray-600 px-2 py-1">
                      <button
                        type="button"
                        className="btn-danger text-xs"
                        onClick={() => handleDeleteAttachment(idx)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-800">
                  <td className="border border-gray-600 px-2 py-1">
                    <select className="input-dark">
                      <option value="photo">photo</option>
                    </select>
                  </td>
                  <td className="border border-gray-600 px-2 py-1">
                    <input type="file" className="input-dark" />
                    <span className="text-gray-400 text-xs">
                      No file chosen
                    </span>
                  </td>
                  <td className="border border-gray-600 px-2 py-1">
                    <button
                      type="button"
                      className="btn-success text-xs"
                      onClick={handleAddAttachment}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Remarks and Transfer Property */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Remarks</label>
            <textarea
              className="input-dark w-full min-h-[60px]"
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
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">
              Transfer Property
            </label>
            <div className="flex gap-2">
              <select className="input-dark flex-1">
                <option value="">-Select-</option>
              </select>
              <button type="button" className="btn-primary">
                Transfer
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>

      {/* QC Remarks Panel */}
      <div className="bg-gray-900 text-white p-8">
        <QCRemarksPanel
          surveyUniqueCode={surveyUniqueCode}
          currentQCLevel={1}
          onRemarksUpdate={() => {
            // Refresh property data when remarks are updated
            fetchProperty();
          }}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-700 text-white py-2 px-6 text-center text-sm">
        PTMS, Urban Development Department
      </div>
    </div>
  );
}
