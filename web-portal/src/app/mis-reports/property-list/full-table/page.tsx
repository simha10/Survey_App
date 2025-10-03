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

const QC_STATUS_OPTIONS = [
  { value: "", label: "All Records" },
  { value: "SURVEY_QC_DONE", label: "Survey QC Done" },
  { value: "IN_OFFICE_QC_DONE", label: "In-Office QC Done" },
  { value: "RI_QC_DONE", label: "RI QC Done" },
  { value: "FINAL_QC_DONE", label: "Final QC Done" },
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

  // Read-only state for display only
  const [qcStatusFilter, setQcStatusFilter] = useState<string>("");
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
    qcStatusFilter,
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
      if (qcStatusFilter) params.append("qcStatusFilter", qcStatusFilter);
      params.append("skip", ((page - 1) * PAGE_SIZE).toString());
      params.append("take", PAGE_SIZE.toString());
      // Use qcApi.getMISReports for read-only MIS reports
      const paramObj: any = {};
      params.forEach((value, key) => {
        paramObj[key] = value;
      });
      const data = await qcApi.getMISReports(paramObj);
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

  const surveyTypeHeading =
    surveyTypeId === "1"
      ? "Property List (Residential)"
      : surveyTypeId === "2"
      ? "Property List (Non-Residential)"
      : surveyTypeId === "3"
      ? "Property List (Mix)"
      : "Property List (QC Results)";

  const handleQcStatusFilterChange = (value: string) => {
    setQcStatusFilter(value);
    // Refetch data with new filter
    fetchProperties();
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

      {/* QC Status Filter */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-300">
          Filter by QC Status:
        </label>
        <select
          className="border rounded px-3 py-2 bg-black text-white min-w-48"
          value={qcStatusFilter}
          onChange={(e) => handleQcStatusFilterChange(e.target.value)}
        >
          {QC_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

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
              <TableHead>QC Status</TableHead>
              <TableHead>QC Level</TableHead>
              <TableHead>Error Type</TableHead>
              <TableHead>GIS Remark</TableHead>
              <TableHead>Survey Team Remark</TableHead>
              <TableHead>Road Type</TableHead>
              <TableHead>Plot Area</TableHead>
              <TableHead>Plot Area GIS</TableHead>
              <TableHead>RI Remark</TableHead>
              <TableHead>Entry Date</TableHead>
              <TableHead>Assessment Remark</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={23} className="text-center text-gray-500">
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
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          prop.currentQCStatus === "IN_OFFICE_QC_DONE"
                            ? "bg-green-700 text-white"
                            : prop.currentQCStatus === "SURVEY_QC_DONE"
                            ? "bg-blue-700 text-white"
                            : prop.currentQCStatus?.includes("REVERTED")
                            ? "bg-red-700 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                      >
                        {prop.displayQCLevel || "Survey QC Pending"}
                      </span>
                    </TableCell>
                    <TableCell>{prop.currentQCLevel || 0}</TableCell>
                    <TableCell>
                      {prop.qcRecords?.[0]?.errorType || "NONE"}
                    </TableCell>
                    <TableCell className="max-w-64 truncate">
                      {prop.qcRecords?.[0]?.gisTeamRemark || "-"}
                    </TableCell>
                    <TableCell className="max-w-64 truncate">
                      {prop.qcRecords?.[0]?.surveyTeamRemark || "-"}
                    </TableCell>
                    <TableCell>
                      {prop.locationDetails?.roadType?.roadTypeName || "NA"}
                    </TableCell>
                    <TableCell>
                      {prop.otherDetails?.totalPlotArea ?? "-"}
                    </TableCell>
                    <TableCell className="max-w-32">
                      {prop.otherDetails?.plotAreaGIS || "-"}
                    </TableCell>
                    <TableCell className="max-w-64 truncate">
                      {prop.qcRecords?.[0]?.RIRemark || "-"}
                    </TableCell>
                    <TableCell>
                      {prop.entryDate
                        ? new Date(prop.entryDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="max-w-64 truncate">
                      {prop.assessmentRemark || "-"}
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
