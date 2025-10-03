"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import toast from "react-hot-toast";
import { qcApi } from "@/lib/api";
import { useAuth } from "@/features/auth/AuthContext";

const ERROR_TYPE_OPTIONS = [
  { value: "MISSING", label: "Missing" },
  { value: "DUPLICATE", label: "Duplicate" },
  { value: "OTHER", label: "Other" },
  { value: "NONE", label: "None" },
];

export default function QCEditDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const surveyUniqueCode = params.surveyUniqueCode as string;
  const userRole = searchParams.get("userRole") || user?.role || "";
  const qcLevel = parseInt(searchParams.get("qcLevel") || "1", 10);

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [error, setError] = useState("");

  // Form states
  const [errorType, setErrorType] = useState("NONE");
  const [gisTeamRemark, setGisTeamRemark] = useState("");
  const [surveyTeamRemark, setSurveyTeamRemark] = useState("");
  const [riRemark, setRiRemark] = useState("");
  const [generalRemarks, setGeneralRemarks] = useState("");
  const [assessmentRemark, setAssessmentRemark] = useState("");
  const [plotAreaGIS, setPlotAreaGIS] = useState("");

  useEffect(() => {
    fetchPropertyDetails();
  }, [surveyUniqueCode]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await qcApi.getPropertyDetails(surveyUniqueCode);
      if (!data) {
        setError("Property not found");
        return;
      }

      setProperty(data);

      // Populate form with existing QC data if available
      const latestQC = data.qcRecords?.[0];
      if (latestQC) {
        setErrorType(latestQC.errorType || "NONE");
        setGisTeamRemark(latestQC.gisTeamRemark || "");
        setSurveyTeamRemark(latestQC.surveyTeamRemark || "");
        setRiRemark(latestQC.RIRemark || "");
        setGeneralRemarks(latestQC.remarks || "");
      }

      setAssessmentRemark(data.assessmentRemark || "");
      setPlotAreaGIS(data.otherDetails?.plotAreaGIS || "");
    } catch (e) {
      setError("Error fetching property details");
    } finally {
      setLoading(false);
    }
  };

  const handleQCAction = async (action: "APPROVED" | "REJECTED") => {
    try {
      setLoading(true);

      const payload = {
        updateData: {
          assessmentRemark,
          plotAreaGIS,
        },
        qcLevel: qcLevel,
        qcStatus: action,
        reviewedById: user?.userId || "",
        remarks: generalRemarks,
        errorType,
        gisTeamRemark,
        surveyTeamRemark,
        RIRemark: riRemark,
      };

      await qcApi.updateSurveyQC(surveyUniqueCode, payload);
      toast.success(`Survey ${action.toLowerCase()} successfully`);

      // Close window or redirect back
      if (window.opener) {
        window.close();
      } else {
        router.back();
      }
    } catch (e) {
      toast.error(`Error ${action.toLowerCase()} survey`);
    } finally {
      setLoading(false);
    }
  };

  const getPageHeading = () => {
    const levelText =
      userRole === "SUPERVISOR"
        ? "Survey QC (Level 1)"
        : userRole === "ADMIN"
        ? "In-Office QC (Level 2)"
        : "QC";

    return `${levelText} - Edit Property Details`;
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error || !property) {
    return (
      <div className="p-6">
        <div className="text-red-500 text-center">
          {error || "Property not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{getPageHeading()}</h1>
        <p className="text-gray-400">Survey Code: {surveyUniqueCode}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Information (Read-Only) */}
        <div className="bg-black p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Property Information
          </h2>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400">Map ID:</label>
                <p className="text-white">{property.mapId || "NA"}</p>
              </div>
              <div>
                <label className="text-gray-400">GIS ID:</label>
                <p className="text-white">{property.gisId || "NA"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400">Old Property Number:</label>
                <p className="text-white">
                  {property.oldPropertyNumber || "NA"}
                </p>
              </div>
              <div>
                <label className="text-gray-400">Property Type:</label>
                <p className="text-white">
                  {property.locationDetails?.propertyType?.propertyTypeName ||
                    "NA"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400">Ward:</label>
                <p className="text-white">{property.ward?.wardName || "NA"}</p>
              </div>
              <div>
                <label className="text-gray-400">Mohalla:</label>
                <p className="text-white">
                  {property.mohalla?.mohallaName || "NA"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400">Owner Name:</label>
                <p className="text-white">
                  {property.ownerDetails?.ownerName || "NA"}
                </p>
              </div>
              <div>
                <label className="text-gray-400">Father/Husband Name:</label>
                <p className="text-white">
                  {property.ownerDetails?.fatherHusbandName || "NA"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-gray-400">Respondent Name:</label>
              <p className="text-white">
                {property.propertyDetails?.respondentName || "NA"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400">Total Plot Area:</label>
                <p className="text-white">
                  {property.otherDetails?.totalPlotArea || "NA"}
                </p>
              </div>
              <div>
                <label className="text-gray-400">Road Type:</label>
                <p className="text-white">
                  {property.locationDetails?.roadType?.roadTypeName || "NA"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QC Edit Form */}
        <div className="bg-black p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-white">
            QC Review Form
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Error Type
              </label>
              <select
                className="w-full border rounded px-3 py-2 bg-gray-800 text-white"
                value={errorType}
                onChange={(e) => setErrorType(e.target.value)}
              >
                {ERROR_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Plot Area GIS
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-800 text-white"
                value={plotAreaGIS}
                onChange={(e) => setPlotAreaGIS(e.target.value)}
                placeholder="Enter GIS plot area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                GIS Team Remark
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 bg-gray-800 text-white"
                rows={3}
                value={gisTeamRemark}
                onChange={(e) => setGisTeamRemark(e.target.value)}
                placeholder="Enter GIS team remarks"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Survey Team Remark
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 bg-gray-800 text-white"
                rows={3}
                value={surveyTeamRemark}
                onChange={(e) => setSurveyTeamRemark(e.target.value)}
                placeholder="Enter survey team remarks"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                RI Remark
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 bg-gray-800 text-white"
                rows={3}
                value={riRemark}
                onChange={(e) => setRiRemark(e.target.value)}
                placeholder="Enter RI remarks"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Assessment Remark
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 bg-gray-800 text-white"
                rows={3}
                value={assessmentRemark}
                onChange={(e) => setAssessmentRemark(e.target.value)}
                placeholder="Enter assessment remarks"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                General Remarks
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 bg-gray-800 text-white"
                rows={3}
                value={generalRemarks}
                onChange={(e) => setGeneralRemarks(e.target.value)}
                placeholder="Enter general remarks"
              />
            </div>
          </div>
        </div>
      </div>

      {/* QC History */}
      {property.qcRecords && property.qcRecords.length > 0 && (
        <div className="mt-6 bg-black p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-white">QC History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2 text-gray-300">Level</th>
                  <th className="text-left py-2 text-gray-300">Status</th>
                  <th className="text-left py-2 text-gray-300">Reviewed By</th>
                  <th className="text-left py-2 text-gray-300">Date</th>
                  <th className="text-left py-2 text-gray-300">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {property.qcRecords.map((qc: any, index: number) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-2 text-white">{qc.qcLevel}</td>
                    <td className="py-2 text-white">{qc.qcStatus}</td>
                    <td className="py-2 text-white">
                      {qc.reviewedBy?.name || qc.reviewedBy?.username || "NA"}
                    </td>
                    <td className="py-2 text-white">
                      {new Date(qc.reviewedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 text-white">{qc.remarks || "NA"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4 justify-end">
        <button
          className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={() => window.close()}
        >
          Cancel
        </button>
        <button
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => handleQCAction("REJECTED")}
          disabled={loading}
        >
          Reject
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => handleQCAction("APPROVED")}
          disabled={loading}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
