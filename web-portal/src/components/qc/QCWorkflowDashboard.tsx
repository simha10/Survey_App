"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  MessageSquare,
  User,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

interface QCWorkflowItem {
  surveyUniqueCode: string;
  gisId: string;
  ownerName?: string;
  respondentName?: string;
  mohallaName?: string;
  ownerDetails?: {
    ownerName?: string;
  };
  propertyDetails?: {
    respondentName?: string;
  };
  ward?: {
    wardName?: string;
    [key: string]: any;
  };
  qcRecords: Array<{
    qcLevel: number;
    qcStatus: string;
    reviewedAt: string;
    reviewedBy: {
      name: string;
      username: string;
    };
    remarks?: string;
    RIRemark?: string;
    gisTeamRemark?: string;
    surveyTeamRemark?: string;
    isError: boolean;
    errorType?: string;
    sectionRecords?: Array<{
      remarks?: string;
    }>;
  }>;
  currentLevel: number;
  nextLevel: number;
}

interface QCWorkflowDashboardProps {
  qcLevel?: number;
  status?: string;
  wardId?: string;
  mohallaId?: string;
}

const QCWorkflowDashboard: React.FC<QCWorkflowDashboardProps> = ({ qcLevel, status, wardId, mohallaId }) => {
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [selectedBulk, setSelectedBulk] = useState<string[]>([]);
  const userRole = typeof window !== "undefined" ? localStorage.getItem("user_role") || "" : "";
  const [workflowData, setWorkflowData] = useState<QCWorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [showRemarksPanel, setShowRemarksPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchWorkflowData();
  }, [qcLevel, status, wardId, mohallaId]);

  const fetchWorkflowData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (qcLevel) params.append("qcLevel", qcLevel.toString());
      if (status) params.append("status", status);
      if (wardId) params.append("wardId", wardId);
      if (mohallaId) params.append("mohallaId", mohallaId);

      const response = await fetch(`/api/qc/property-list?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkflowData(data);
      } else {
        toast.error("Failed to fetch QC workflow data");
      }
    } catch (error) {
      toast.error("Error fetching QC workflow data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "NEEDS_REVISION":
      case "REVERTED_TO_SUPERVISOR":
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      case "REVERTED_TO_ADMIN":
        return <AlertTriangle className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "NEEDS_REVISION":
      case "REVERTED_TO_SUPERVISOR":
        return "bg-blue-100 text-blue-800";
      case "REVERTED_TO_ADMIN":
        return "bg-purple-100 text-purple-800";
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCurrentLevelStatus = (item: QCWorkflowItem) => {
    const currentRecord = item.qcRecords.find(
      (r) => r.qcLevel === item.currentLevel
    );
    return currentRecord?.qcStatus || "PENDING";
  };

  const getRemarksCount = (item: QCWorkflowItem) => {
    let count = 0;
    item.qcRecords.forEach((record) => {
      if (record.remarks) count++;
      if (record.RIRemark) count++;
      if (record.gisTeamRemark) count++;
      // If section-level QC is present, count section remarks
      if (record.sectionRecords) {
        record.sectionRecords.forEach((section: any) => {
          if (section.remarks) count++;
        });
      }
      if (record.surveyTeamRemark) count++;
    });
    return count;
  };

  const filteredData = workflowData.filter((item) => {
    if (activeTab === "pending") {
      return getCurrentLevelStatus(item) === "PENDING";
    } else if (activeTab === "approved") {
      return getCurrentLevelStatus(item) === "APPROVED";
    } else if (activeTab === "rejected") {
      return getCurrentLevelStatus(item) === "REJECTED";
    } else if (activeTab === "needs-revision") {
      return getCurrentLevelStatus(item) === "NEEDS_REVISION";
    }
    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QC Workflow Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Filter & Bulk Actions */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">From:</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <label className="text-sm font-medium ml-2">To:</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <Button variant="outline" size="sm" onClick={fetchWorkflowData} className="ml-2">Apply Date Filter</Button>
        </div>
        {(userRole === "SUPERVISOR" || userRole === "ADMIN") && (
          <div className="flex gap-2 items-center">
            <Button
              variant="default"
              size="sm"
              disabled={selectedBulk.length === 0}
              onClick={async () => {
                // Example bulk approve endpoint
                const response = await fetch("/api/qc/bulk-action", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                  },
                  body: JSON.stringify({
                    action: "APPROVE",
                    surveyCodes: selectedBulk,
                  }),
                });
                if (response.ok) {
                  toast.success("Bulk QC action successful");
                  setSelectedBulk([]);
                  fetchWorkflowData();
                } else {
                  toast.error("Bulk QC action failed");
                }
              }}
            >
              Bulk Approve Selected
            </Button>
          </div>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            QC Workflow Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">
                Pending (
                {
                  workflowData.filter(
                    (item) => getCurrentLevelStatus(item) === "PENDING"
                  ).length
                }
                )
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved (
                {
                  workflowData.filter(
                    (item) => getCurrentLevelStatus(item) === "APPROVED"
                  ).length
                }
                )
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected (
                {
                  workflowData.filter(
                    (item) => getCurrentLevelStatus(item) === "REJECTED"
                  ).length
                }
                )
              </TabsTrigger>
              <TabsTrigger value="needs-revision">
                Needs Revision (
                {
                  workflowData.filter(
                    (item) => getCurrentLevelStatus(item) === "NEEDS_REVISION"
                  ).length
                }
                )
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {(userRole === "SUPERVISOR" || userRole === "ADMIN") && <TableHead>Select</TableHead>}
                      <TableHead>GIS ID</TableHead>
                      <TableHead>Property Details</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Current Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Last Review</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.surveyUniqueCode}>
                        {(userRole === "SUPERVISOR" || userRole === "ADMIN") && (
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedBulk.includes(item.surveyUniqueCode)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedBulk([...selectedBulk, item.surveyUniqueCode]);
                                } else {
                                  setSelectedBulk(selectedBulk.filter(code => code !== item.surveyUniqueCode));
                                }
                              }}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">
                          {item.gisId}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {item.ownerDetails?.ownerName ||
                                item.propertyDetails?.respondentName ||
                                "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.propertyDetails?.respondentName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {item.ward?.wardName || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.mohallaName || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            Level {item.currentLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(getCurrentLevelStatus(item))}
                            <Badge
                              className={getStatusColor(
                                getCurrentLevelStatus(item)
                              )}
                            >
                              {getCurrentLevelStatus(item)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {getRemarksCount(item)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {item.qcRecords.length > 0
                                ? formatDate(item.qcRecords[0].reviewedAt)
                                : "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.qcRecords.length > 0
                                ? item.qcRecords[0].reviewedBy?.name
                                : "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSurvey(item.surveyUniqueCode);
                              setShowRemarksPanel(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* You may have other dashboard summary cards below */}
    </div>
  );
};

export default QCWorkflowDashboard;
