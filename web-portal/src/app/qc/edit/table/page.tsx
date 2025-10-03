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
import { Pencil, Check, X } from "lucide-react";
import { qcApi, masterDataApi } from "@/lib/api";
import { useAuth } from "@/features/auth/AuthContext";

const ERROR_TYPE_OPTIONS = [
  { value: "MISSING", label: "Missing" },
  { value: "DUPLICATE", label: "Duplicate" },
  { value: "OTHER", label: "Other" },
  { value: "NONE", label: "None" },
];

const PAGE_SIZE = 10;

export default function QCEditTablePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

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
  const qcDone = searchParams.get("qcDone") || "ALL";
  const userRole = searchParams.get("userRole") || user?.role || "";
  const qcLevel = parseInt(searchParams.get("qcLevel") || "1", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  // For inline edits
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [errorTypes, setErrorTypes] = useState<{ [key: string]: string }>({});
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
    qcDone,
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
      params.append("userRole", userRole);
      params.append("qcLevel", qcLevel.toString());
      params.append("qcDone", qcDone);

      const paramObj: any = {};
      params.forEach((value, key) => {
        paramObj[key] = value;
      });

      const data = await qcApi.getPropertyList(paramObj);
      setProperties(data || []);
      setTotal(
        data.length < PAGE_SIZE
          ? (page - 1) * PAGE_SIZE + data.length
          : page * PAGE_SIZE + 1
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

  const surveyTypeHeading = () => {
    const typeText =
      surveyTypeId === "1"
        ? "Residential"
        : surveyTypeId === "2"
        ? "Non-Residential"
        : surveyTypeId === "3"
        ? "Mix"
        : "All Types";

    const levelText =
      userRole === "SUPERVISOR"
        ? "Survey QC (Level 1)"
        : userRole === "ADMIN"
        ? "In-Office QC (Level 2)"
        : "QC";

    return `${levelText} - ${typeText}`;
  };

  const handleEdit = (surveyUniqueCode: string) => {
    window.open(
      `/qc/edit/${surveyUniqueCode}?surveyTypeId=${surveyTypeId}&userRole=${userRole}&qcLevel=${qcLevel}`,
      "_blank"
    );
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

  const handleQCAction = async (prop: any, action: "APPROVED" | "REJECTED") => {
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
        qcLevel: qcLevel,
        qcStatus: action,
        reviewedById: user?.userId || "",
        remarks: remarks[surveyUniqueCode] || "",
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

      await qcApi.updateSurveyQC(surveyUniqueCode, payload);
      toast.success(`Survey ${action.toLowerCase()} successfully`);
      fetchProperties();
    } catch (e) {
      toast.error(`Error ${action.toLowerCase()} survey`);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", newPage.toString());
    router.replace(`/qc/edit/table?${params.toString()}`);
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{surveyTypeHeading()}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="bg-gray-700 shadow-md rounded-lg overflow-x-auto w-full">
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
              <TableHead>General Remarks</TableHead>
              <TableHead>QC Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={25} className="text-center text-gray-500">
                  No properties found for QC.
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
                  <TableRow
                    key={prop.surveyUniqueCode}
                    className="border text-xs text-center justify-center"
                  >
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
                    <TableCell>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit QC Details"
                        onClick={() => handleEdit(prop.surveyUniqueCode)}
                      >
                        <Pencil size={18} />
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
                      <input
                        type="text"
                        className="border rounded px-2 py-1 bg-black text-white w-64"
                        placeholder="General remarks"
                        value={remarks[prop.surveyUniqueCode] ?? ""}
                        onChange={(e) =>
                          handleRemarkChange(
                            prop.surveyUniqueCode,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs flex items-center gap-1"
                        onClick={() => handleQCAction(prop, "APPROVED")}
                        title="Approve"
                      >
                        <Check size={14} />
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs flex items-center gap-1"
                        onClick={() => handleQCAction(prop, "REJECTED")}
                        title="Reject"
                      >
                        <X size={14} />
                        Reject
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded ${
                  pageNum === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
