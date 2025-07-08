"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { masterDataApi, userApi, wardApi, assignmentApi } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader2 } from "lucide-react"; // For loading spinner
import { useAuth } from "@/features/auth/AuthContext";


const USER_TYPES = [
  { label: "Surveyor", value: "SURVEYOR" },
  { label: "Supervisor", value: "SUPERVISOR" },
];

const UserAssignmentPage: React.FC = () => {
  const { user } = useAuth();
  const [userType, setUserType] = useState("");
  const [selectedUlb, setSelectedUlb] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedWards, setSelectedWards] = useState<string[]>([]);
  const [selectedMohallas, setSelectedMohallas] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wardMohallaMap, setWardMohallaMap] = useState<{
    [wardId: string]: string[];
  }>({});
  const [mohallaAssignments, setMohallaAssignments] = useState<{
    [wardId: string]: { [mohallaId: string]: any };
  }>({});
  const [wardAssignments, setWardAssignments] = useState<{
    [wardId: string]: any;
  }>({});

  useEffect(() => {
    // Simulate loading time for consistency
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch ULBs
  const { data: ulbs = [], isLoading: ulbsLoading } = useQuery({
    queryKey: ["ulbs"],
    queryFn: masterDataApi.getAllUlbs,
  });

  // Fetch Zones by ULB
  const { data: zones = [], isLoading: zonesLoading } = useQuery({
    queryKey: ["zones", selectedUlb],
    queryFn: () => masterDataApi.getZonesByUlb(selectedUlb),
    enabled: !!selectedUlb,
  });

  // Fetch Wards by Zone (status 'STARTED')
  const { data: wards = [], isLoading: wardsLoading } = useQuery({
    queryKey: ["wards", selectedZone, "STARTED"],
    queryFn: () =>
      masterDataApi.getWardsByZoneWithStatus(selectedZone, "STARTED"),
    enabled: !!selectedZone,
  });

  // Fetch Mohallas by selected Wards (aggregate all mohallas from selected wards)
  const { data: mohallas = [], isLoading: mohallasLoading } = useQuery({
    queryKey: ["mohallas", selectedWards],
    queryFn: async () => {
      if (!selectedWards.length) return [];
      const allMohallas = await Promise.all(
        selectedWards.map((wardId) => masterDataApi.getMohallasByWard(wardId))
      );
      const flat = allMohallas.flat();
      const unique = Array.from(
        new Map(flat.map((m) => [m.mohallaId, m])).values()
      );
      return unique;
    },
    enabled: !!selectedWards.length,
  });

  // Fetch users by role
  useEffect(() => {
    if (userType) {
      userApi.getUsersByRole(userType).then((res) => setUsers(res.users || []));
    } else {
      setUsers([]);
    }
    setSelectedUser("");
  }, [userType]);

  // Fetch mohallas and assignment status for selected wards
  useEffect(() => {
    const fetchMohallasAndAssignments = async () => {
      const newWardMohallaMap: { [wardId: string]: string[] } = {};
      const newMohallaAssignments: {
        [wardId: string]: { [mohallaId: string]: any };
      } = {};
      const newWardAssignments: { [wardId: string]: any } = {};
      const token = localStorage.getItem("auth_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      for (const wardId of selectedWards) {
        // Fetch mohallas for this ward
        const mohallas = await masterDataApi.getMohallasByWard(wardId);
        newWardMohallaMap[wardId] = mohallas.map((m: any) => m.mohallaId);
        // Fetch assignment status for this ward
        const res = await axios.get(`/api/assignments/ward/${wardId}`, {
          headers,
        });
        const assignments = res.data.assignments || [];
        // Track ward-level assignments
        if (assignments.length > 0) {
          newWardAssignments[wardId] = assignments[0].user;
        }
        const mohallaMap: { [mohallaId: string]: any } = {};
        assignments.forEach((a: any) => {
          a.mohallaIds.forEach((mid: string) => {
            mohallaMap[mid] = a.user;
          });
        });
        newMohallaAssignments[wardId] = mohallaMap;
      }
      setWardMohallaMap(newWardMohallaMap);
      setMohallaAssignments(newMohallaAssignments);
      setWardAssignments(newWardAssignments);
    };
    if (selectedWards.length > 0) {
      fetchMohallasAndAssignments();
    } else {
      setWardMohallaMap({});
      setMohallaAssignments({});
      setWardAssignments({});
    }
  }, [selectedWards]);

  // Auto-select all unassigned mohallas for each ward
  useEffect(() => {
    if (Object.keys(wardMohallaMap).length > 0) {
      const newSelectedMohallas: string[] = [];
      Object.entries(wardMohallaMap).forEach(([wardId, mohallaIds]) => {
        mohallaIds.forEach((mid) => {
          if (!mohallaAssignments[wardId] || !mohallaAssignments[wardId][mid]) {
            newSelectedMohallas.push(mid);
          }
        });
      });
      setSelectedMohallas(newSelectedMohallas);
    }
  }, [wardMohallaMap, mohallaAssignments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Please select a user to assign.");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to assign the selected mohallas to this user?"
    );
    if (!confirmed) return;
    setSubmitting(true);
    try {
      // Build assignments array: [{ wardId, mohallaIds }]
      const assignments = Object.entries(wardMohallaMap)
        .map(([wardId, mohallaIds]) => ({
          wardId,
          mohallaIds: mohallaIds.filter((mid) =>
            selectedMohallas.includes(mid)
          ),
        }))
        .filter((a) => a.mohallaIds.length > 0);
      if (assignments.length === 0) {
        toast.error("No mohallas selected for assignment.");
        setSubmitting(false);
        return;
      }
      const payload = {
        userId: selectedUser,
        assignmentType: userType,
        assignments,
      };
      const token = localStorage.getItem("auth_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post("/api/assignments/bulk", payload, {
        headers,
      });
      console.log("Assignment API response:", res.data);
      if (
        res.data.success &&
        res.data.assigned &&
        res.data.assigned.length > 0
      ) {
        toast.success("Assignment successful!");
        if (res.data.conflicts && res.data.conflicts.length > 0) {
          toast("Some mohallas were already assigned and skipped.", {
            icon: "⚠️",
          });
        }
        setSelectedWards([]);
        setSelectedMohallas([]);
        setSelectedUser("");
      } else if (
        res.data.success &&
        (!res.data.assigned || res.data.assigned.length === 0)
      ) {
        toast(
          "No new mohallas were assigned. All selected mohallas may already be assigned.",
          { icon: "⚠️" }
        );
      } else {
        toast.error("Assignment failed");
      }
    } catch (err: any) {
      console.error("Assignment API error:", err);
      toast.error(err?.response?.data?.error || "Assignment failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <MainLayout>
      <Card className="w-full ">
        <CardHeader className="bg-black text-white text-2xl font-bold p-4 mb-4 border-2 border-amber-50 rounded-lg">
          User Assignment
        </CardHeader>
        <CardContent className="p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col gap-2">
              <Label>
                User Type <span className="text-red-500">*</span>
              </Label>
              <Select value={userType} onValueChange={setUserType} required>
                <SelectTrigger className="h-12 text-base font-medium">
                  <SelectValue placeholder="SELECT" />
                </SelectTrigger>
                <SelectContent>
                  {USER_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="text-black bg-white border-2 border-black hover:bg-blue-300"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                User <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedUser}
                onValueChange={setSelectedUser}
                required
                disabled={!userType}
              >
                <SelectTrigger className="h-12 text-base font-medium">
                  <SelectValue placeholder="Select User..." />
                </SelectTrigger>
                <SelectContent>
                  {users.length === 0 ? (
                    <SelectItem value="loading" disabled>
                      {userType ? "No users found" : "Select user type first"}
                    </SelectItem>
                  ) : (
                    users.map((user: any) => (
                      <SelectItem
                        key={user.userId}
                        value={user.userId}
                        className="text-black bg-white border-2 border-black hover:bg-blue-300"
                      >
                        {user.name || user.username}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                ULB <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedUlb}
                onValueChange={setSelectedUlb}
                required
              >
                <SelectTrigger className="h-12 text-base font-medium">
                  <SelectValue placeholder="Select ULB..." />
                </SelectTrigger>
                <SelectContent>
                  {ulbsLoading ? (
                    <SelectItem
                      value="loading"
                      disabled
                      className="text-black bg-white border-2 border-black hover:bg-blue-300"
                    >
                      Loading...
                    </SelectItem>
                  ) : (
                    ulbs.map((ulb: any) => (
                      <SelectItem
                        key={ulb.ulbId}
                        value={ulb.ulbId}
                        className="text-black bg-white border-2 border-black hover:bg-blue-300"
                      >
                        {ulb.ulbName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Zone Name <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedZone}
                onValueChange={setSelectedZone}
                required
                disabled={!selectedUlb}
              >
                <SelectTrigger className="h-12 text-base font-medium">
                  <SelectValue placeholder="Select Zone..." />
                </SelectTrigger>
                <SelectContent>
                  {zonesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    zones.map((zone: any) => (
                      <SelectItem
                        key={zone.zoneId}
                        value={zone.zoneId}
                        className="text-black bg-white border-2 border-black hover:bg-blue-300"
                      >
                        {zone.zoneNumber}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* Wards Table */}
            <div className="md:col-span-2">
              <Label className="text-lg font-semibold mb-4 block">
                Wards <span className="text-red-500">*</span>
              </Label>
              {wardsLoading ? (
                <div className="text-center py-4">Loading wards...</div>
              ) : wards.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No wards found
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ward Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {wards.map((ward: any) => {
                        const assignedUser = wardAssignments[ward.wardId];
                        const isAssigned = Boolean(assignedUser);
                        return (
                          <tr key={ward.wardId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedWards.includes(ward.wardId)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setSelectedWards((prev) =>
                                    checked
                                      ? [...prev, ward.wardId]
                                      : prev.filter((id) => id !== ward.wardId)
                                  );
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {ward.wardName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  isAssigned
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {isAssigned ? "Assigned" : "Available"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {assignedUser
                                ? assignedUser.name || assignedUser.username
                                : "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Mohallas Table */}
            <div className="md:col-span-2">
              <Label className="text-lg font-semibold mb-4 block">
                Mohallas <span className="text-red-500">*</span>
              </Label>
              {selectedWards.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Select wards first to view mohallas
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mohalla Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedWards
                        .map((wardId) => {
                          const mohallaIds = wardMohallaMap[wardId] || [];
                          const wardName = wards.find(
                            (w: any) => w.wardId === wardId
                          )?.wardName;
                          return mohallaIds.map((mohallaId) => {
                            const assignedUser =
                              mohallaAssignments[wardId]?.[mohallaId];
                            const isAssigned = Boolean(assignedUser);
                            const mohalla = mohallas.find(
                              (m: any) => m.mohallaId === mohallaId
                            );

                            return (
                              <tr key={mohallaId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    checked={selectedMohallas.includes(
                                      mohallaId
                                    )}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      setSelectedMohallas((prev) =>
                                        checked
                                          ? [...prev, mohallaId]
                                          : prev.filter(
                                              (id) => id !== mohallaId
                                            )
                                      );
                                    }}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {mohalla ? mohalla.mohallaName : mohallaId}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      isAssigned
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {isAssigned ? "Assigned" : "Available"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {assignedUser
                                    ? assignedUser.name || assignedUser.username
                                    : "-"}
                                </td>
                              </tr>
                            );
                          });
                        })
                        .flat()}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <Button
                type="submit"
                className="px-10 py-3 text-lg font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-black rounded-lg shadow-lg hover:from-yellow-400 hover:to-amber-500 transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-center"
                disabled={submitting}
              >
                {submitting && <Loader2 className="animate-spin w-5 h-5" />}
                {submitting ? "Assigning..." : "Submit"}
              </Button>
            </div>
          </form>
          {/* Assignment Summary */}
          <div className="col-span-2 mt-6">
            <h3 className="font-bold mb-2">Assignment Summary</h3>
            <div className="bg-black p-4 rounded-lg text-white">
              <div>
                <b>User Type:</b> {userType}
              </div>
              <div>
                <b>User:</b>{" "}
                {users.find((u: any) => u.userId === selectedUser)?.name || "-"}
              </div>
              <div>
                <b>ULB:</b>{" "}
                {ulbs.find((u: any) => u.ulbId === selectedUlb)?.ulbName || "-"}
              </div>
              <div>
                <b>Zone:</b>{" "}
                {zones.find((z: any) => z.zoneId === selectedZone)
                  ?.zoneNumber || "-"}
              </div>
              <div>
                <b>Wards:</b>{" "}
                {wards
                  .filter((w: any) => selectedWards.includes(w.wardId))
                  .map((w: any) => w.wardName)
                  .join(", ") || "-"}
              </div>
              <div>
                <b>Mohallas:</b>{" "}
                {selectedWards
                  .map((wardId) => {
                    const mohallaIds = wardMohallaMap[wardId] || [];
                    const mohallaNames = mohallaIds
                      .filter((mid) => selectedMohallas.includes(mid))
                      .map((mid) => {
                        const mohalla = mohallas.find(
                          (m: any) => m.mohallaId === mid
                        );
                        return mohalla ? mohalla.mohallaName : mid;
                      });
                    return mohallaNames.length > 0
                      ? `${
                          wards.find((w: any) => w.wardId === wardId)?.wardName
                        }: ${mohallaNames.join(", ")}`
                      : null;
                  })
                  .filter(Boolean)
                  .join("; ") || "-"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default UserAssignmentPage;
