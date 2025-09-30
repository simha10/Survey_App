"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

interface QCRemarksSummary {
  qcRecords: Array<{
    qcRecordId: string;
    qcLevel: number;
    qcStatus: string;
    remarks?: string;
    RIRemark?: string;
    gisTeamRemark?: string;
    surveyTeamRemark?: string;
    reviewedAt: string;
    reviewedBy: {
      userId: string;
      name: string;
      username: string;
    };
  }>;
  remarksSummary: {
    riRemarks: Array<{
      level: number;
      remark: string;
      reviewedBy: any;
      reviewedAt: string;
    }>;
    gisRemarks: Array<{
      level: number;
      remark: string;
      reviewedBy: any;
      reviewedAt: string;
    }>;
    surveyTeamRemarks: Array<{
      level: number;
      remark: string;
      reviewedBy: any;
      reviewedAt: string;
    }>;
    generalRemarks: Array<{
      level: number;
      remark: string;
      reviewedBy: any;
      reviewedAt: string;
    }>;
  };
}

interface QCRemarksPanelProps {
  surveyUniqueCode: string;
  currentQCLevel: number;
  onRemarksUpdate?: () => void;
}

const QCRemarksPanel: React.FC<QCRemarksPanelProps> = ({
  surveyUniqueCode,
  currentQCLevel,
  onRemarksUpdate,
}) => {
  const [remarksData, setRemarksData] = useState<QCRemarksSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("history");

  // Form state for new remarks
  const [newRemarks, setNewRemarks] = useState({
    qcLevel: currentQCLevel,
    qcStatus: "PENDING",
    remarks: "",
    RIRemark: "",
    gisTeamRemark: "",
    surveyTeamRemark: "",
    isError: false,
    errorType: "NONE",
  });

  useEffect(() => {
    fetchRemarksData();
  }, [surveyUniqueCode]);

  const fetchRemarksData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/qc/remarks/${surveyUniqueCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRemarksData(data);
      } else {
        toast.error("Failed to fetch remarks data");
      }
    } catch (error) {
      toast.error("Error fetching remarks data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRemarks = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/qc/survey/${surveyUniqueCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          updateData: {},
          qcLevel: newRemarks.qcLevel,
          qcStatus: newRemarks.qcStatus,
          remarks: newRemarks.remarks || undefined,
          RIRemark: newRemarks.RIRemark || undefined,
          gisTeamRemark: newRemarks.gisTeamRemark || undefined,
          surveyTeamRemark: newRemarks.surveyTeamRemark || undefined,
          reviewedById: localStorage.getItem("user_id") || "",
          isError: newRemarks.isError,
          errorType: newRemarks.errorType,
        }),
      });

      if (response.ok) {
        toast.success("Remarks submitted successfully");
        setNewRemarks({
          qcLevel: currentQCLevel,
          qcStatus: "PENDING",
          remarks: "",
          RIRemark: "",
          gisTeamRemark: "",
          surveyTeamRemark: "",
          isError: false,
          errorType: "NONE",
        });
        fetchRemarksData();
        onRemarksUpdate?.();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit remarks");
      }
    } catch (error) {
      toast.error("Error submitting remarks");
    } finally {
      setSaving(false);
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
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            QC Remarks
          </CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          QC Remarks & History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Remarks History</TabsTrigger>
            <TabsTrigger value="add">Add Remarks</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {remarksData?.remarksSummary && (
              <div className="space-y-4">
                {/* RI Remarks */}
                {remarksData.remarksSummary.riRemarks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      Revenue Inspector Remarks
                    </h4>
                    <div className="space-y-2">
                      {remarksData.remarksSummary.riRemarks.map(
                        (remark, index) => (
                          <div
                            key={index}
                            className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500"
                          >
                            <p className="text-sm">{remark.remark}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                              <span>Level {remark.level}</span>
                              <span>{formatDate(remark.reviewedAt)}</span>
                              <span>
                                By:{" "}
                                {remark.reviewedBy?.name ||
                                  remark.reviewedBy?.username}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* GIS Team Remarks */}
                {remarksData.remarksSummary.gisRemarks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      GIS Team Remarks
                    </h4>
                    <div className="space-y-2">
                      {remarksData.remarksSummary.gisRemarks.map(
                        (remark, index) => (
                          <div
                            key={index}
                            className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500"
                          >
                            <p className="text-sm">{remark.remark}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                              <span>Level {remark.level}</span>
                              <span>{formatDate(remark.reviewedAt)}</span>
                              <span>
                                By:{" "}
                                {remark.reviewedBy?.name ||
                                  remark.reviewedBy?.username}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Survey Team Remarks */}
                {remarksData.remarksSummary.surveyTeamRemarks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-purple-600" />
                      Survey Team Remarks
                    </h4>
                    <div className="space-y-2">
                      {remarksData.remarksSummary.surveyTeamRemarks.map(
                        (remark, index) => (
                          <div
                            key={index}
                            className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500"
                          >
                            <p className="text-sm">{remark.remark}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                              <span>Level {remark.level}</span>
                              <span>{formatDate(remark.reviewedAt)}</span>
                              <span>
                                By:{" "}
                                {remark.reviewedBy?.name ||
                                  remark.reviewedBy?.username}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* General Remarks */}
                {remarksData.remarksSummary.generalRemarks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                      General Remarks
                    </h4>
                    <div className="space-y-2">
                      {remarksData.remarksSummary.generalRemarks.map(
                        (remark, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-500"
                          >
                            <p className="text-sm">{remark.remark}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                              <span>Level {remark.level}</span>
                              <span>{formatDate(remark.reviewedAt)}</span>
                              <span>
                                By:{" "}
                                {remark.reviewedBy?.name ||
                                  remark.reviewedBy?.username}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* QC History Timeline */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    QC History Timeline
                  </h4>
                  <div className="space-y-2">
                    {remarksData.qcRecords.map((record) => (
                      <div
                        key={record.qcRecordId}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <Badge className={getStatusColor(record.qcStatus)}>
                            {record.qcStatus}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">
                              Level {record.qcLevel}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span>{formatDate(record.reviewedAt)}</span>
                            <span className="text-gray-500">•</span>
                            <span>
                              By:{" "}
                              {record.reviewedBy?.name ||
                                record.reviewedBy?.username}
                            </span>
                          </div>
                          {record.remarks && (
                            <p className="text-xs text-gray-600 mt-1">
                              {record.remarks}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qcLevel">QC Level</Label>
                <Select
                  value={newRemarks.qcLevel.toString()}
                  onValueChange={(value) =>
                    setNewRemarks({ ...newRemarks, qcLevel: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="qcStatus">QC Status</Label>
                <Select
                  value={newRemarks.qcStatus}
                  onValueChange={(value) =>
                    setNewRemarks({ ...newRemarks, qcStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="NEEDS_REVISION">
                      Needs Revision
                    </SelectItem>
                    <SelectItem value="DUPLICATE">Duplicate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="riRemark">Revenue Inspector Remark</Label>
              <Textarea
                id="riRemark"
                placeholder="Enter RI remark if applicable..."
                value={newRemarks.RIRemark}
                onChange={(e) =>
                  setNewRemarks({ ...newRemarks, RIRemark: e.target.value })
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="gisRemark">GIS Team Remark</Label>
              <Textarea
                id="gisRemark"
                placeholder="Enter GIS team remark if applicable..."
                value={newRemarks.gisTeamRemark}
                onChange={(e) =>
                  setNewRemarks({
                    ...newRemarks,
                    gisTeamRemark: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="surveyTeamRemark">Survey Team Remark</Label>
              <Textarea
                id="surveyTeamRemark"
                placeholder="Enter survey team remark if applicable..."
                value={newRemarks.surveyTeamRemark}
                onChange={(e) =>
                  setNewRemarks({
                    ...newRemarks,
                    surveyTeamRemark: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="generalRemarks">General Remarks</Label>
              <Textarea
                id="generalRemarks"
                placeholder="Enter general remarks..."
                value={newRemarks.remarks}
                onChange={(e) =>
                  setNewRemarks({ ...newRemarks, remarks: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isError"
                  checked={newRemarks.isError}
                  onChange={(e) =>
                    setNewRemarks({ ...newRemarks, isError: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="isError">Mark as Error</Label>
              </div>

              {newRemarks.isError && (
                <div className="flex-1">
                  <Label htmlFor="errorType">Error Type</Label>
                  <Select
                    value={newRemarks.errorType}
                    onValueChange={(value) =>
                      setNewRemarks({ ...newRemarks, errorType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">None</SelectItem>
                      <SelectItem value="MISSING">Missing Data</SelectItem>
                      <SelectItem value="DUPLICATE">Duplicate</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActiveTab("history")}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitRemarks}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? "Submitting..." : "Submit Remarks"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QCRemarksPanel;
