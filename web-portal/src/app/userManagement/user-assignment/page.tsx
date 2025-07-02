"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { masterDataApi, userApi, wardApi } from "@/lib/api";
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
import { toast } from "react-toastify";

// To use toast notifications, run: npm install react-toastify

const USER_TYPES = [
  { label: "Surveyor", value: "SURVEYOR" },
  { label: "Supervisor", value: "SUPERVISOR" },
];

const UserAssignmentPage: React.FC = () => {
  const [userType, setUserType] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [selectedUlb, setSelectedUlb] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedWards, setSelectedWards] = useState<string[]>([]);
  const [selectedMohallas, setSelectedMohallas] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Please select a user to assign.");
      return;
    }
    setSubmitting(true);
    try {
      if (userType === "SURVEYOR") {
        // Assign wards
        if (selectedWards.length > 0) {
          await wardApi.bulkAssign({
            userId: selectedUser,
            type: "WARD",
            wardIds: selectedWards,
            assignmentDate,
          });
        }
        // Assign mohallas
        if (selectedMohallas.length > 0) {
          await wardApi.bulkAssign({
            userId: selectedUser,
            type: "MOHALLA",
            mohallaIds: selectedMohallas,
            assignmentDate,
          });
        }
      } else if (userType === "SUPERVISOR") {
        if (selectedWards.length > 0) {
          await wardApi.bulkAssign({
            userId: selectedUser,
            type: "WARD",
            wardIds: selectedWards,
            assignmentDate,
          });
        }
      }
      toast.success("Assignment successful!");
      setSelectedWards([]);
      setSelectedMohallas([]);
      setSelectedUser("");
    } catch (err: any) {
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
      <Card className="w-full max-w-6xl">
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
                <SelectTrigger className="h-12 text-base font-medium bg-white border text-black border-gray-900 rounded-lg">
                  <SelectValue placeholder="SELECT" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {USER_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="text-black border-2 border-amber-950"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Assignment Date <span className="text-red-500">*</span>
              </Label>
              <input
                type="date"
                className="border rounded px-3 py-2 h-12 text-base font-medium bg-white text-black border-gray-900"
                value={assignmentDate}
                onChange={(e) => setAssignmentDate(e.target.value)}
                required
              />
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
                <SelectTrigger className="h-12 text-base font-medium bg-white border text-black border-gray-900 rounded-lg">
                  <SelectValue placeholder="Select ULB..." />
                </SelectTrigger>
                <SelectContent>
                  {ulbsLoading ? (
                    <SelectItem
                      value="loading"
                      disabled
                      className="text-black border-2 border-amber-50"
                    >
                      Loading...
                    </SelectItem>
                  ) : (
                    ulbs.map((ulb: any) => (
                      <SelectItem
                        key={ulb.ulbId}
                        value={ulb.ulbId}
                        className="text-black border-2 bg-amber-50 border-blue-500"
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
                <SelectTrigger className="h-12 text-base font-medium bg-white border text-black border-gray-900 rounded-lg">
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
                        className="text-white bg-black border border-white "
                      >
                        {zone.zoneNumber}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label>
                Ward(s) <span className="text-red-500">*</span>
              </Label>
              {wardsLoading ? (
                <div>Loading...</div>
              ) : wards.length === 0 ? (
                <div>No wards found</div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {wards.map((ward: any) => (
                    <label
                      key={ward.wardId}
                      className="flex items-center gap-2"
                    >
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
                      />
                      {ward.wardName}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label>
                Mohalla(s) <span className="text-red-500">*</span>
              </Label>
              {mohallasLoading ? (
                <div>Loading...</div>
              ) : mohallas.length === 0 ? (
                <div>No mohallas found</div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {mohallas.map((mohalla: any) => (
                    <label
                      key={mohalla.mohallaId}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMohallas.includes(mohalla.mohallaId)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedMohallas((prev) =>
                            checked
                              ? [...prev, mohalla.mohallaId]
                              : prev.filter((id) => id !== mohalla.mohallaId)
                          );
                        }}
                      />
                      {mohalla.mohallaName}
                    </label>
                  ))}
                </div>
              )}
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
                <SelectTrigger className="h-12 text-base font-medium bg-white border text-black border-gray-900 rounded-lg">
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
                        className="text-white border-2 border-black"
                      >
                        {user.name || user.username}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <Button type="submit" className="px-8 py-2" disabled={submitting}>
                Submit
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
                <b>Assignment Date:</b> {assignmentDate}
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
                {mohallas
                  .filter((m: any) => selectedMohallas.includes(m.mohallaId))
                  .map((m: any) => m.mohallaName)
                  .join(", ") || "-"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default UserAssignmentPage;
