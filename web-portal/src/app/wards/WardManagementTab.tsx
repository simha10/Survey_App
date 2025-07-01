"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { masterDataApi, userApi } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";

interface ULB {
  ulbId: string;
  ulbName: string;
  isActive: boolean;
  description?: string;
}

interface Zone {
  zoneId: string;
  zoneNumber: string;
  isActive: boolean;
  description?: string;
}

interface Ward {
  wardId: string;
  wardNumber: string;
  wardName: string;
  isActive: boolean;
  description?: string;
  wardStatusMaps?: Array<{
    status: {
      statusId: string;
      statusName: string;
    };
  }>;
}

interface WardStatus {
  statusId: string;
  statusName: string;
  isActive: boolean;
  description?: string;
}

export default function WardManagementTab() {
  const [selectedUlb, setSelectedUlb] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch ULBs
  const {
    data: ulbs = [],
    isLoading: ulbsLoading,
    error: ulbsError,
  } = useQuery({
    queryKey: ["ulbs"],
    queryFn: masterDataApi.getAllUlbs,
  });

  // Fetch Zones by ULB
  const {
    data: zones = [],
    isLoading: zonesLoading,
    error: zonesError,
  } = useQuery({
    queryKey: ["zones", selectedUlb],
    queryFn: () => masterDataApi.getZonesByUlb(selectedUlb),
    enabled: !!selectedUlb,
  });

  // Fetch Wards by Zone
  const {
    data: wardsData,
    isLoading: wardsLoading,
    error: wardsError,
  } = useQuery({
    queryKey: ["wards", selectedZone],
    queryFn: () => masterDataApi.getWardsByZone(selectedZone),
    enabled: !!selectedZone,
  });
  const wards = wardsData?.wards ?? [];

  // Fetch Ward Statuses
  const {
    data: wardStatuses = [],
    isLoading: statusesLoading,
    error: statusesError,
  } = useQuery({
    queryKey: ["ward-statuses"],
    queryFn: masterDataApi.getAllWardStatuses,
  });

  // Update Ward Status Mutation
  const updateWardStatusMutation = useMutation({
    mutationFn: ({ wardId, statusId }: { wardId: string; statusId: string }) =>
      masterDataApi.updateWardStatus(wardId, { statusId }),
    onSuccess: () => {
      toast.success("Ward status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["wards", selectedZone] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Failed to update ward status"
      );
    },
  });

  // Handle ULB change
  const handleUlbChange = (ulbId: string) => {
    setSelectedUlb(ulbId);
    setSelectedZone(""); // Reset zone when ULB changes
  };

  // Handle Zone change
  const handleZoneChange = (zoneId: string) => {
    setSelectedZone(zoneId);
  };

  // Handle Ward Status change
  const handleWardStatusChange = (wardId: string, statusId: string) => {
    updateWardStatusMutation.mutate({ wardId, statusId });
  };

  // Get current ward status
  const getCurrentWardStatus = (ward: Ward) => {
    return ward.wardStatusMaps?.[0]?.status?.statusName || "No Status";
  };

  // Get current ward status ID
  const getCurrentWardStatusId = (ward: Ward) => {
    return ward.wardStatusMaps?.[0]?.status?.statusId || "";
  };

  if (ulbsError || zonesError || wardsError || statusesError) {
    return (
      <Card className="shadow-lg border border-gray-200 rounded-xl max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center text-red-600 font-semibold text-lg">
            Error loading data. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen">
      {/* Filters */}
      <Card className="shadow-xl border border-gray-200 rounded-2xl bg-white transition-all hover:shadow-2xl max-w-4xl mx-auto">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-3xl font-extrabold text-gray-900 tracking-wide">
            Ward Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ULB Dropdown */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-800 tracking-tight">
                ULB
              </label>
              <Select value={selectedUlb} onValueChange={handleUlbChange}>
                <SelectTrigger className="w-full h-12 text-base font-medium bg-white border text-black border-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-400">
                  <SelectValue placeholder="Select ULB" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-xl w-full">
                  {ulbsLoading ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                        <span className="text-gray-600">Loading ULBs...</span>
                      </div>
                    </SelectItem>
                  ) : (
                    ulbs.map((ulb: ULB) => (
                      <SelectItem
                        key={ulb.ulbId}
                        value={ulb.ulbId}
                        className="text-base text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        {ulb.ulbName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Zone Dropdown */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-800 tracking-tight">
                Zone
              </label>
              <Select
                value={selectedZone}
                onValueChange={handleZoneChange}
                disabled={!selectedUlb}
              >
                <SelectTrigger className="w-full h-12 text-base text-black font-medium bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-400 disabled:bg-gray-100 disabled:cursor-not-allowed">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-xl w-full">
                  {zonesLoading ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                        <span className="text-gray-600">Loading Zones...</span>
                      </div>
                    </SelectItem>
                  ) : (
                    zones.map((zone: Zone) => (
                      <SelectItem
                        key={zone.zoneId}
                        value={zone.zoneId}
                        className="text-base text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        {zone.zoneNumber}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wards Table */}
      <Card className="shadow-xl border border-gray-200 rounded-2xl bg-white transition-all hover:shadow-2xl max-w-4xl mx-auto">
        <CardHeader className="border-b border-gray-100 flex items-center justify-between p-6">
          <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
            Wards
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="font-semibold text-base px-5 py-2 border border-gray-300 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-400 transition-all"
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ["wards", selectedZone],
              });
            }}
            disabled={wardsLoading}
          >
            <RefreshCw className="h-5 w-5 mr-2 text-indigo-500" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-8">
          {wardsLoading ? (
            <div className="flex items-center justify-center p-10">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
              <span className="ml-3 text-lg font-medium text-gray-700">
                Loading wards...
              </span>
            </div>
          ) : wards.length === 0 ? (
            <div className="text-center text-gray-500 p-10 text-lg font-semibold">
              {!selectedZone
                ? "Please select a zone to view wards"
                : "No wards found for this zone"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-base font-bold text-gray-800 py-4">
                    Ward Number
                  </TableHead>
                  <TableHead className="text-base font-bold text-gray-800 py-4">
                    Ward Name
                  </TableHead>
                  <TableHead className="text-base font-bold text-gray-800 py-4">
                    Status
                  </TableHead>
                  <TableHead className="text-base font-bold text-gray-800 py-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wards.map((ward: Ward) => (
                  <TableRow
                    key={ward.wardId}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-semibold text-base text-gray-900 py-4">
                      {ward.wardNumber}
                    </TableCell>
                    <TableCell className="text-base text-gray-800 py-4">
                      {ward.wardName}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={
                          getCurrentWardStatus(ward) === "Active"
                            ? "default"
                            : "secondary"
                        }
                        className={`text-base px-4 py-1 rounded-full ${
                          getCurrentWardStatus(ward) === "Active"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {getCurrentWardStatus(ward)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Select
                        value={getCurrentWardStatusId(ward)}
                        onValueChange={(statusId) =>
                          handleWardStatusChange(ward.wardId, statusId)
                        }
                        disabled={updateWardStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-48 h-11 text-base font-medium bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-xl">
                          {statusesLoading ? (
                            <SelectItem value="loading" disabled>
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                                <span className="text-gray-600">
                                  Loading...
                                </span>
                              </div>
                            </SelectItem>
                          ) : (
                            wardStatuses.map((status: WardStatus) => (
                              <SelectItem
                                key={status.statusId}
                                value={status.statusId}
                                className="text-base text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                              >
                                {status.statusName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
