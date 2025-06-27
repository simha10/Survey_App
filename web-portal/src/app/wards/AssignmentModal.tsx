"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { wardApi, masterDataApi } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

interface User {
  userId: string;
  username: string;
  name: string | null;
  userRoleMaps?: Array<{
    role: {
      roleName: string;
    };
  }>;
}

interface ULB {
  ulbId: string;
  ulbName: string;
}

interface Zone {
  zoneId: string;
  zoneNumber: string;
}

interface Ward {
  wardId: string;
  wardNumber: string;
  wardName: string;
}

interface Mohalla {
  mohallaId: string;
  mohallaName: string;
}

interface AssignmentModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignmentModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: AssignmentModalProps) {
  const [selectedUlb, setSelectedUlb] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [selectedMohalla, setSelectedMohalla] = useState<string>("");
  const [assignmentType, setAssignmentType] = useState<string>("PRIMARY");

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

  // Fetch Wards by Zone
  const { data: wards = [], isLoading: wardsLoading } = useQuery({
    queryKey: ["wards", selectedZone],
    queryFn: () => masterDataApi.getWardsByZone(selectedZone),
    enabled: !!selectedZone,
  });

  // Fetch Mohallas by Ward
  const { data: mohallas = [], isLoading: mohallasLoading } = useQuery({
    queryKey: ["mohallas", selectedWard],
    queryFn: () => masterDataApi.getMohallasByWard(selectedWard),
    enabled: !!selectedWard,
  });

  // Create Assignment Mutation
  const createAssignmentMutation = useMutation({
    mutationFn: (data: any) => wardApi.assignSurveyor(data),
    onSuccess: () => {
      toast.success("Assignment created successfully");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create assignment");
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUlb("");
      setSelectedZone("");
      setSelectedWard("");
      setSelectedMohalla("");
      setAssignmentType("PRIMARY");
    }
  }, [isOpen]);

  // Handle ULB change
  const handleUlbChange = (ulbId: string) => {
    setSelectedUlb(ulbId);
    setSelectedZone("");
    setSelectedWard("");
    setSelectedMohalla("");
  };

  // Handle Zone change
  const handleZoneChange = (zoneId: string) => {
    setSelectedZone(zoneId);
    setSelectedWard("");
    setSelectedMohalla("");
  };

  // Handle Ward change
  const handleWardChange = (wardId: string) => {
    setSelectedWard(wardId);
    setSelectedMohalla("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUlb || !selectedZone || !selectedWard || !selectedMohalla) {
      toast.error("Please fill in all fields");
      return;
    }

    // For now, we'll use placeholder values for the mapping IDs
    // In a real implementation, you'd need to fetch these from the backend
    const assignmentData = {
      userId: user.userId,
      wardId: selectedWard,
      mohallaId: selectedMohalla,
      wardMohallaMapId: "placeholder", // This should be fetched from backend
      zoneWardMapId: "placeholder", // This should be fetched from backend
      ulbZoneMapId: "placeholder", // This should be fetched from backend
      assignmentType,
    };

    createAssignmentMutation.mutate(assignmentData);
  };

  const isFormValid =
    selectedUlb && selectedZone && selectedWard && selectedMohalla;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Ward to {user.name || user.username}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ULB Selection */}
          <div className="space-y-2">
            <Label htmlFor="ulb">ULB</Label>
            <Select value={selectedUlb} onValueChange={handleUlbChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select ULB" />
              </SelectTrigger>
              <SelectContent>
                {ulbsLoading ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading ULBs...
                  </SelectItem>
                ) : (
                  ulbs.map((ulb: ULB) => (
                    <SelectItem key={ulb.ulbId} value={ulb.ulbId}>
                      {ulb.ulbName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Zone Selection */}
          <div className="space-y-2">
            <Label htmlFor="zone">Zone</Label>
            <Select
              value={selectedZone}
              onValueChange={handleZoneChange}
              disabled={!selectedUlb}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                {zonesLoading ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Zones...
                  </SelectItem>
                ) : (
                  zones.map((zone: Zone) => (
                    <SelectItem key={zone.zoneId} value={zone.zoneId}>
                      {zone.zoneNumber}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Ward Selection */}
          <div className="space-y-2">
            <Label htmlFor="ward">Ward</Label>
            <Select
              value={selectedWard}
              onValueChange={handleWardChange}
              disabled={!selectedZone}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ward" />
              </SelectTrigger>
              <SelectContent>
                {wardsLoading ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Wards...
                  </SelectItem>
                ) : (
                  wards.map((ward: Ward) => (
                    <SelectItem key={ward.wardId} value={ward.wardId}>
                      {ward.wardNumber} - {ward.wardName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Mohalla Selection */}
          <div className="space-y-2">
            <Label htmlFor="mohalla">Mohalla</Label>
            <Select
              value={selectedMohalla}
              onValueChange={setSelectedMohalla}
              disabled={!selectedWard}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Mohalla" />
              </SelectTrigger>
              <SelectContent>
                {mohallasLoading ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Mohallas...
                  </SelectItem>
                ) : (
                  mohallas.map((mohalla: Mohalla) => (
                    <SelectItem
                      key={mohalla.mohallaId}
                      value={mohalla.mohallaId}
                    >
                      {mohalla.mohallaName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Assignment Type */}
          <div className="space-y-2">
            <Label htmlFor="assignmentType">Assignment Type</Label>
            <Select value={assignmentType} onValueChange={setAssignmentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIMARY">Primary</SelectItem>
                <SelectItem value="SECONDARY">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || createAssignmentMutation.isPending}
            >
              {createAssignmentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Assignment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
