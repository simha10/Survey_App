"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import toast from "react-hot-toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { masterDataApi, qcApi } from "@/lib/api";

const ERROR_TYPE_OPTIONS = [
  { value: "MISSING", label: "Missing" },
  { value: "DUPLICATE", label: "Duplicate" },
  { value: "OTHER", label: "Other" },
  { value: "NONE", label: "None" },
];

// Keep compatibility with previous code, but prefer using qcApi which
// centralizes baseURL and JWT headers. Avoid building URLs with an
// undefined baseUrl which was the cause of the 'undefined' segment.

const PAGE_SIZE = 10;

export default function PropertyListResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read all filters from URL
  const ulbId = searchParams.get("ulbId") || "";
  const zoneId = searchParams.get("zoneId") || "";
  const wardId = searchParams.get("wardId") || "";
  const mohallaId = searchParams.get("mohallaId") || "";
  const propertyTypeId = searchParams.get("propertyTypeId") || "";
  const surveyTypeId = searchParams.get("surveyTypeId") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  // For inline edits
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [errorTypes, setErrorTypes] = useState<{ [key: string]: string }>({});

  // Add state for all editable remarks and usernames
  const [gisRemarks, setGisRemarks] = useState<{ [key: string]: string }>({});
  const [surveyTeamRemarks, setSurveyTeamRemarks] = useState<{
    [key: string]: string;
  }>({});
  const [riRemarks, setRiRemarks] = useState<{ [key: string]: string }>({});
  const [assessmentRemarks, setAssessmentRemarks] = useState<{
    [key: string]: string;
  }>({});

  const [plotAreaGIS, setPlotAreaGIS] = useState<{ [key: string]: string }>({});
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    fetchProperties();
    fetchWards();
    // eslint-disable-next-line
  }, [
    ulbId,
    zoneId,
    wardId,
    mohallaId,
    propertyTypeId,
    surveyTypeId,
    fromDate,
    toDate,
    search,
    page,
  ]);

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (ulbId) params.append("ulbId", ulbId);
      if (zoneId) params.append("zoneId", zoneId);
      if (wardId) params.append("wardId", wardId);
      if (mohallaId) params.append("mohallaId", mohallaId);
      if (propertyTypeId) params.append("propertyTypeId", propertyTypeId);
      if (surveyTypeId) params.append("surveyTypeId", surveyTypeId);
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (search) params.append("search", search);
      params.append("skip", ((page - 1) * PAGE_SIZE).toString());
      params.append("take", PAGE_SIZE.toString());
      // Use qcApi.getPropertyList with params object
      const paramObj: any = {};
      params.forEach((value, key) => {
        paramObj[key] = value;
      });
      const data = await qcApi.getPropertyList(paramObj);
      setProperties(data || []);
      setTotal(
        data.length < PAGE_SIZE ? (page - 1) * PAGE_SIZE + data.length : page * PAGE_SIZE + 1
      );
    } catch (e) {
      setError("Error fetching property list");
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async () => {
    try {
      const data = await masterDataApi.getAllWards();
      setWards(data || []);
    } catch {
      setWards([]);
    }
  };

  const surveyTypeHeading =
    surveyTypeId === "1"
      ? "Property List (Residential)"
      : surveyTypeId === "2"
      ? "Property List (Non-Residential)"
      : surveyTypeId === "3"
      ? "Property List (Mix)"
      : "Property List (QC Results)";

  const handleEdit = (surveyUniqueCode: string) => {
    window.open(
      `/mis-reports/property-list/${surveyUniqueCode}/edit?surveyTypeId=${surveyTypeId}`,
      "_blank"
    );
  };

  const handleDelete = (surveyUniqueCode: string) => {
    // TODO: Implement delete logic
    toast("Delete not implemented");
  };

  const handleRemarkChange = (id: string, value: string) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handleErrorTypeChange = (id: string, value: string) => {
    setErrorTypes((prev) => ({ ...prev, [id]: value }));
  };

  const handleGisRemarkChange = (id: string, value: string) => {
    setGisRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handleSurveyTeamRemarkChange = (id: string, value: string) => {
    setSurveyTeamRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handleRIRemarkChange = (id: string, value: string) => {
    setRiRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handleAssessmentRemarkChange = (id: string, value: string) => {
    setAssessmentRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handlePlotAreaGISChange = (id: string, value: string) => {
    setPlotAreaGIS((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendForQC = async (prop: any) => {
    try {
      setLoading(true);
      const surveyUniqueCode = prop.surveyUniqueCode;
      const payload = {
        updateData: {
          assessmentRemark:
            assessmentRemarks[surveyUniqueCode] ?? prop.assessmentRemark ?? "",
          plotAreaGIS:
            plotAreaGIS[surveyUniqueCode] ??
            prop.otherDetails?.plotAreaGIS ??
            "",
        },
        qcLevel: prop.qcRecords?.[0]?.qcLevel || 1,
        qcStatus: "PENDING", // or next status as per your flow
        reviewedById: prop.user?.userId || "",
        errorType:
          errorTypes[surveyUniqueCode] ||
          prop.qcRecords?.[0]?.errorType ||
          "NONE",
        gisTeamRemark:
          gisRemarks[surveyUniqueCode] ??
          prop.qcRecords?.[0]?.gisTeamRemark ??
          "",
        surveyTeamRemark:
          surveyTeamRemarks[surveyUniqueCode] ??
          prop.qcRecords?.[0]?.surveyTeamRemark ??
          "",
        RIRemark:
          riRemarks[surveyUniqueCode] ?? prop.qcRecords?.[0]?.RIRemark ?? "",
      };
      // Use qcApi.updateQC which sends auth headers automatically
      await qcApi.updateQC(surveyUniqueCode, payload);
      toast.success("Remarks sent for next level QC");
      fetchProperties();
    } catch (e) {
      toast.error("Error sending for QC");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", newPage.toString());
    router.replace(`/mis-reports/property-list/results?${params.toString()}`);
    console.log(params.toString());
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{surveyTypeHeading}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="bg-gray-700 shadow-md rounded-lg overflow-x-auto W-full">
        <Table className="w-full border-blue-700 border-2">
          <TableHeader className="text-xs text-center justify-center">
            <TableRow>
              <TableHead>Map ID</TableHead>
              <TableHead>GIS ID</TableHead>
              <TableHead>Survey Match Status</TableHead>
              <TableHead>Old Property Number</TableHead>
              <TableHead>Property Type</TableHead>
              <TableHead>Match/UnMatch</TableHead>
              <TableHead>Floor Count</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>New Ward</TableHead>
              <TableHead>Mohalla</TableHead>
              <TableHead>Owner Name</TableHead>
              <TableHead>Father/Hub Name</TableHead>
              <TableHead>Respondent</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Error Type</TableHead>
              <TableHead>GIS Remark</TableHead>
              <TableHead>Survey Team Remark</TableHead>
              <TableHead>Road Type</TableHead>
              <TableHead>Plot Area</TableHead>
              <TableHead>Plot Area GIS</TableHead>
              <TableHead>RI Remark</TableHead>
              <TableHead>Entry Date</TableHead>
              <TableHead>Assessment Remark</TableHead>
              <TableHead>Send for QC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={26} className="text-center text-gray-500">
                  No properties found.
                </TableCell>
              </TableRow>
            ) : (
              properties.map((prop) => {
                const wardName =
                  wards.find(
                    (w) =>
                      w.newWardNumber === prop.locationDetails?.newWardNumber
                  )?.wardName || "NA";
                return (
                  <TableRow key={prop.surveyUniqueCode} className="border text-xs text-center justify-center">
                    <TableCell>{prop.mapId || "NA"}</TableCell>
                    <TableCell>{prop.gisId || "NA"}</TableCell>
                    <TableCell>{prop.surveyMatchStatus || "NA"}</TableCell>
                    <TableCell>{prop.oldPropertyNumber || "NA"}</TableCell>
                    <TableCell>
                      {prop.locationDetails?.propertyType?.propertyTypeName?.trim() ||
                        "NA"}
                    </TableCell>
                    <TableCell>{prop.matchStatus || "NA"}</TableCell>
                    <TableCell>
                      {(() => {
                        const resCount = Array.isArray(
                          prop.residentialPropertyAssessments
                        )
                          ? prop.residentialPropertyAssessments.length
                          : 0;
                        const nonResCount = Array.isArray(
                          prop.nonResidentialPropertyAssessments
                        )
                          ? prop.nonResidentialPropertyAssessments.length
                          : 0;
                        const totalFloors = resCount + nonResCount;
                        return totalFloors === 0 ? 1 : totalFloors;
                      })()}
                    </TableCell>
                    <TableCell>{prop.ward?.wardName || "NA"}</TableCell>
                    <TableCell>{wardName}</TableCell>
                    <TableCell>{prop.mohalla?.mohallaName || "NA"}</TableCell>
                    <TableCell>
                      {prop.ownerDetails?.ownerName || "NA"}
                    </TableCell>
                    <TableCell>
                      {prop.ownerDetails?.fatherHusbandName || "NA"}
                    </TableCell>
                    <TableCell>
                      {prop.propertyDetails?.respondentName || "NA"}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit QC"
                        onClick={() => handleEdit(prop.surveyUniqueCode)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        onClick={() => handleDelete(prop.surveyUniqueCode)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <select
                        className="border rounded px-2 py-1 bg-black text-white"
                        value={
                          errorTypes[prop.surveyUniqueCode] ||
                          prop.qcRecords?.[0]?.errorType ||
                          "NONE"
                        }
                        onChange={(e) =>
                          handleErrorTypeChange(
                            prop.surveyUniqueCode,
                            e.target.value
                          )
                        }
                      >
                        {ERROR_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 bg-black text-white w-64"
                        value={
                          gisRemarks[prop.surveyUniqueCode] ??
                          prop.qcRecords?.[0]?.gisTeamRemark ??
                          ""
                        }
                        onChange={(e) =>
                          handleGisRemarkChange(
                            prop.surveyUniqueCode,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 bg-black text-white w-64"
                        value={
                          surveyTeamRemarks[prop.surveyUniqueCode] ??
                          prop.qcRecords?.[0]?.surveyTeamRemark ??
                          ""
                        }
                        onChange={(e) =>
                          handleSurveyTeamRemarkChange(
                            prop.surveyUniqueCode,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {prop.locationDetails?.roadType?.roadTypeName || "NA"}
                    </TableCell>
                    <TableCell>
                      {prop.otherDetails?.totalPlotArea ?? "-"}
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 bg-black text-white w-32"
                        value={
                          plotAreaGIS[prop.surveyUniqueCode] ??
                          prop.otherDetails?.plotAreaGIS ??
                          ""
                        }
                        onChange={(e) =>
                          handlePlotAreaGISChange(
                            prop.surveyUniqueCode,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 bg-black text-white w-64"
                        value={
                          riRemarks[prop.surveyUniqueCode] ??
                          prop.qcRecords?.[0]?.RIRemark ??
                          ""
                        }
                        onChange={(e) =>
                          handleRIRemarkChange(
                            prop.surveyUniqueCode,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {prop.entryDate
                        ? new Date(prop.entryDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 bg-black text-white w-64"
                        value={
                          assessmentRemarks[prop.surveyUniqueCode] ??
                          prop.assessmentRemark ??
                          ""
                        }
                        onChange={(e) =>
                          handleAssessmentRemarkChange(
                            prop.surveyUniqueCode,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        className="px-6 py-2 border rounded bg-black text-white hover:bg-blue-700 text-xs w-20
                        "
                        onClick={() => handleSendForQC(prop)}
                      >
                        Send for QC
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
