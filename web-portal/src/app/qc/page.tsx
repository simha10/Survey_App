"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import toast from "react-hot-toast";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  APPROVED: "#22c55e",
  REJECTED: "#ef4444",
  DUPLICATE: "#f59e42",
  NEEDS_REVISION: "#eab308",
  PENDING: "#6b7280",
};

interface QCStats {
  statusCounts: { qcStatus: string; _count: { qcRecordId: number } }[];
  levelCounts: { qcLevel: number; _count: { qcRecordId: number } }[];
  totalSurveys: number;
  pendingCount: number;
}

interface QCRecord {
  qcRecordId: string;
  surveyUniqueCode: string;
  qcLevel: number;
  qcStatus: string;
  remarks?: string;
  reviewedAt: string;
  reviewer?: {
    userId: string;
    username: string;
    name?: string;
  };
}

const QCManagementPage: React.FC = () => {
  const [stats, setStats] = useState<QCStats | null>(null);
  const [recentActions, setRecentActions] = useState<QCRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchStats(), fetchRecentActions()]);
    } catch (e) {
      // handled in each
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/qc/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        const err = await response.json();
        toast.error(err.error || "Failed to fetch QC stats");
      }
    } catch (error: any) {
      toast.error("Failed to fetch QC stats");
    }
  };

  const fetchRecentActions = async () => {
    try {
      const response = await fetch("/api/qc/property-list?take=5", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Backend returns an array of surveys directly. Flatten to recent QC records.
        const records: QCRecord[] = (data || [])
          .map((s: any) =>
            s.qcRecords && s.qcRecords[0]
              ? {
                  ...s.qcRecords[0],
                  reviewer: s.qcRecords[0].reviewer || undefined,
                }
              : null
          )
          .filter(Boolean);
        setRecentActions(records);
      } else {
        const err = await response.json();
        toast.error(err.error || "Failed to fetch recent QC actions");
      }
    } catch (error: any) {
      toast.error("Failed to fetch recent QC actions");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireWebPortalAccess>
        <Loading fullScreen />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireWebPortalAccess>
      <MainLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-100">
              Quality Control Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Overview of survey QC status, trends, and recent actions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-black p-6 rounded-lg shadow-md">
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
                  <p className="text-sm font-medium text-gray-400">
                    Total Surveys
                  </p>
                  <p className="text-2xl font-semibold text-gray-300">
                    {stats?.totalSurveys ?? "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black p-6 rounded-lg shadow-md">
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
                  <p className="text-sm font-medium text-gray-400">
                    Pending Review
                  </p>
                  <p className="text-2xl font-semibold text-gray-300">
                    {stats?.pendingCount ?? "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black p-6 rounded-lg shadow-md">
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
                  <p className="text-sm font-medium text-gray-400">Approved</p>
                  <p className="text-2xl font-semibold text-gray-300">
                    {stats?.statusCounts?.find((s) => s.qcStatus === "APPROVED")
                      ?._count.qcRecordId ?? 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black p-6 rounded-lg shadow-md">
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
                  <p className="text-sm font-medium text-gray-400">Rejected</p>
                  <p className="text-2xl font-semibold text-gray-300">
                    {stats?.statusCounts?.find((s) => s.qcStatus === "REJECTED")
                      ?._count.qcRecordId ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-black p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">
                QC Status Breakdown
              </h2>
              {stats?.statusCounts && stats.statusCounts.length > 0 ? (
                <PieChart width={320} height={220}>
                  <Pie
                    data={stats.statusCounts}
                    dataKey="_count.qcRecordId"
                    nameKey="qcStatus"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {stats.statusCounts.map((entry, idx) => (
                      <Cell
                        key={entry.qcStatus}
                        fill={STATUS_COLORS[entry.qcStatus] || "#8884d8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <div className="text-gray-500">No data</div>
              )}
            </div>
            <div className="bg-black p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">
                QC Actions by Level
              </h2>
              {stats?.levelCounts && stats.levelCounts.length > 0 ? (
                <BarChart width={320} height={220} data={stats.levelCounts}>
                  <XAxis dataKey="qcLevel" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="_count.qcRecordId" fill="#2563eb" />
                </BarChart>
              ) : (
                <div className="text-gray-500">No data</div>
              )}
            </div>
          </div>

          {/* Recent QC Actions */}
          <div className="bg-black p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Recent QC Actions</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Survey ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500"
                    >
                      No recent actions
                    </TableCell>
                  </TableRow>
                ) : (
                  recentActions.map((rec) => (
                    <TableRow key={rec.qcRecordId}>
                      <TableCell>{rec.surveyUniqueCode}</TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize"
                          style={{
                            background:
                              STATUS_COLORS[rec.qcStatus] || "#6b7280",
                            color: "#fff",
                          }}
                        >
                          {rec.qcStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{rec.qcLevel}</TableCell>
                      <TableCell>
                        {rec.reviewer?.name || rec.reviewer?.username || "-"}
                      </TableCell>
                      <TableCell>
                        {new Date(rec.reviewedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{rec.remarks || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default QCManagementPage;
