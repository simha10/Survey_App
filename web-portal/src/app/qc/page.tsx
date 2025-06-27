"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import toast from "react-hot-toast";
import MainLayout from "@/components/layout/MainLayout";

interface QCRecord {
  qcRecordId: string;
  surveyUniqueCode: string;
  qcLevel: number;
  qcStatus: string;
  remarks?: string;
  reviewedAt: Date;
  reviewer: {
    userId: string;
    username: string;
    name?: string;
  };
}

interface Survey {
  surveyUniqueCode: string;
  gisId: string;
  uploadedBy: {
    username: string;
    name?: string;
  };
  createdAt: string;
  qcRecords: QCRecord[];
}

const QCManagementPage: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [qcRecords, setQcRecords] = useState<QCRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showQCModal, setShowQCModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const [qcForm, setQcForm] = useState({
    surveyUniqueCode: "",
    qcLevel: 1,
    qcStatus: "PENDING",
    remarks: "",
  });

  useEffect(() => {
    fetchPendingSurveys();
    fetchQCStats();
  }, []);

  const fetchPendingSurveys = async () => {
    try {
      const response = await fetch("/api/qc/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSurveys(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching pending surveys:", error);
      toast.error("Failed to fetch pending surveys");
    } finally {
      setLoading(false);
    }
  };

  const fetchQCStats = async () => {
    try {
      const response = await fetch("/api/qc/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Handle stats data if needed
      }
    } catch (error) {
      console.error("Error fetching QC stats:", error);
    }
  };

  const handleCreateQC = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/qc/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(qcForm),
      });

      if (response.ok) {
        toast.success("QC record created successfully");
        setShowQCModal(false);
        setQcForm({
          surveyUniqueCode: "",
          qcLevel: 1,
          qcStatus: "PENDING",
          remarks: "",
        });
        fetchPendingSurveys();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create QC record");
      }
    } catch (error: any) {
      toast.error("Failed to create QC record");
    }
  };

  const handleBulkApprove = async (surveyCodes: string[]) => {
    try {
      const response = await fetch("/api/qc/bulk-approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ surveyUniqueCodes: surveyCodes }),
      });

      if (response.ok) {
        toast.success("Surveys approved successfully");
        fetchPendingSurveys();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to approve surveys");
      }
    } catch (error: any) {
      toast.error("Failed to approve surveys");
    }
  };

  const handleBulkReject = async (surveyCodes: string[], remarks: string) => {
    try {
      const response = await fetch("/api/qc/bulk-reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          surveyUniqueCodes: surveyCodes,
          remarks,
        }),
      });

      if (response.ok) {
        toast.success("Surveys rejected successfully");
        fetchPendingSurveys();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to reject surveys");
      }
    } catch (error: any) {
      toast.error("Failed to reject surveys");
    }
  };

  const filteredSurveys = surveys.filter((survey) => {
    if (!selectedStatus) return true;
    const latestQC = survey.qcRecords[survey.qcRecords.length - 1];
    return latestQC?.qcStatus === selectedStatus;
  });

  if (loading) {
    return (
      <ProtectedRoute requireWebPortalAccess>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireWebPortalAccess>
      <MainLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Quality Control Management
            </h1>
            <p className="text-gray-600 mt-2">
              Review and manage survey quality control processes
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Surveys
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {surveys.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Review
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {surveys.filter((s) => !s.qcRecords.length).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {
                      surveys.filter((s) => {
                        const latestQC = s.qcRecords[s.qcRecords.length - 1];
                        return latestQC?.qcStatus === "APPROVED";
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {
                      surveys.filter((s) => {
                        const latestQC = s.qcRecords[s.qcRecords.length - 1];
                        return latestQC?.qcStatus === "REJECTED";
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="DUPLICATE">Duplicate</option>
                <option value="NEEDS_REVISION">Needs Revision</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const pendingSurveys = surveys.filter(
                    (s) => !s.qcRecords.length
                  );
                  if (pendingSurveys.length > 0) {
                    handleBulkApprove(
                      pendingSurveys.map((s) => s.surveyUniqueCode)
                    );
                  } else {
                    toast.success("No pending surveys to approve");
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Bulk Approve
              </button>
              <button
                onClick={() => setShowQCModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add QC Record
              </button>
            </div>
          </div>

          {/* Surveys Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Survey ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GIS ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QC Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSurveys.map((survey) => {
                  const latestQC =
                    survey.qcRecords[survey.qcRecords.length - 1];
                  const qcStatus = latestQC?.qcStatus || "PENDING";

                  return (
                    <tr
                      key={survey.surveyUniqueCode}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {survey.surveyUniqueCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {survey.gisId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {survey.uploadedBy.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {survey.uploadedBy.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            qcStatus === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : qcStatus === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : qcStatus === "DUPLICATE"
                              ? "bg-orange-100 text-orange-800"
                              : qcStatus === "NEEDS_REVISION"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {qcStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedSurvey(survey);
                            setQcForm({
                              surveyUniqueCode: survey.surveyUniqueCode,
                              qcLevel: (latestQC?.qcLevel || 0) + 1,
                              qcStatus: "PENDING",
                              remarks: "",
                            });
                            setShowQCModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Review
                        </button>
                        <button
                          onClick={() =>
                            handleBulkApprove([survey.surveyUniqueCode])
                          }
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const remarks = prompt("Enter rejection remarks:");
                            if (remarks) {
                              handleBulkReject(
                                [survey.surveyUniqueCode],
                                remarks
                              );
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Create QC Modal */}
          {showQCModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {selectedSurvey ? "Review Survey" : "Create QC Record"}
                  </h3>
                  <form onSubmit={handleCreateQC} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Survey Unique Code
                      </label>
                      <input
                        type="text"
                        required
                        value={qcForm.surveyUniqueCode}
                        onChange={(e) =>
                          setQcForm({
                            ...qcForm,
                            surveyUniqueCode: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter survey unique code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        QC Level
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={qcForm.qcLevel}
                        onChange={(e) =>
                          setQcForm({
                            ...qcForm,
                            qcLevel: parseInt(e.target.value),
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        QC Status
                      </label>
                      <select
                        value={qcForm.qcStatus}
                        onChange={(e) =>
                          setQcForm({ ...qcForm, qcStatus: e.target.value })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="DUPLICATE">Duplicate</option>
                        <option value="NEEDS_REVISION">Needs Revision</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Remarks
                      </label>
                      <textarea
                        value={qcForm.remarks}
                        onChange={(e) =>
                          setQcForm({ ...qcForm, remarks: e.target.value })
                        }
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter QC remarks..."
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowQCModal(false);
                          setSelectedSurvey(null);
                        }}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {selectedSurvey ? "Update QC" : "Create QC"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default QCManagementPage;
