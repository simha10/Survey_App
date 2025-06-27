"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, wardApi, masterDataApi } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, RefreshCw, X } from "lucide-react";
import AssignmentModal from "@/app/wards/AssignmentModal";

interface User {
  userId: string;
  username: string;
  name: string | null;
  mobileNumber?: string;
  isActive: boolean;
  userRoleMaps?: Array<{
    role: {
      roleName: string;
    };
  }>;
}

interface Assignment {
  assignmentId: string;
  userId: string;
  wardId: string;
  mohallaId: string;
  assignmentType: string;
  isActive: boolean;
  user: {
    username: string;
    name?: string;
  };
  ward: {
    wardNumber: string;
    wardName: string;
  };
  mohalla: {
    mohallaName: string;
  };
}

export default function WardAssignmentTab() {
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Fetch Surveyors and Supervisors
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users", "SURVEYOR", "SUPERVISOR"],
    queryFn: () => userApi.getUsersByRole("SURVEYOR"),
  });
  const users = usersData?.users ?? [];

  // Fetch Assignments
  const {
    data: assignmentsData,
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useQuery({
    queryKey: ["assignments"],
    queryFn: wardApi.getAssignments,
  });
  const assignments = Array.isArray(assignmentsData)
    ? assignmentsData
    : Array.isArray(assignmentsData?.assignments)
    ? assignmentsData.assignments
    : [];

  // Toggle Assignment Mutation
  const toggleAssignmentMutation = useMutation({
    mutationFn: ({
      assignmentId,
      isActive,
    }: {
      assignmentId: string;
      isActive: boolean;
    }) => wardApi.updateAssignment({ assignmentId, isActive }),
    onSuccess: () => {
      toast.success("Assignment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update assignment");
    },
  });

  // Handle assignment toggle
  const handleToggleAssignment = (assignmentId: string, isActive: boolean) => {
    toggleAssignmentMutation.mutate({ assignmentId, isActive: !isActive });
  };

  // Handle assign button click
  const handleAssignClick = (user: User) => {
    setSelectedUser(user);
    setShowAssignmentModal(true);
  };

  // Get user role
  const getUserRole = (user: User) => {
    return user.userRoleMaps?.[0]?.role?.roleName || "Unknown";
  };

  // Get user assignments
  const getUserAssignments = (userId: string) => {
    return assignments.filter(
      (assignment: Assignment) => assignment.userId === userId
    );
  };

  if (usersError || assignmentsError) {
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
      {/* Header */}
      <Card className="shadow-xl border border-gray-200 rounded-2xl bg-white transition-all hover:shadow-2xl max-w-4xl mx-auto">
        <CardHeader className="border-b border-gray-100 flex items-center justify-between p-6">
          <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
            Ward Assignment
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="font-semibold text-base px-5 py-2 border border-gray-300 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-400 transition-all"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["assignments"] });
              queryClient.invalidateQueries({
                queryKey: ["users", "SURVEYOR", "SUPERVISOR"],
              });
            }}
            disabled={assignmentsLoading || usersLoading}
          >
            <RefreshCw className="h-5 w-5 mr-2 text-indigo-500" />
            Refresh
          </Button>
        </CardHeader>
      </Card>

      {/* Users Table */}
      <Card className="shadow-xl border border-gray-200 rounded-2xl bg-white transition-all hover:shadow-2xl max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
            Users (Surveyors & Supervisors)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {usersLoading ? (
            <div className="flex items-center justify-center p-10">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
              <span className="ml-3 text-lg font-medium text-gray-700">
                Loading users...
              </span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500 p-10 text-lg font-semibold">
              No surveyors or supervisors found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-base font-bold text-gray-800 py-4">
                    Username
                  </TableHead>
                  <TableHead className="text-base font-bold text-gray-800 py-4">
                    Name
                  </TableHead>
                  <TableHead className="text-base font-bold text-gray-800 py-4">
                    Role
                  </TableHead>
                  <TableHead className="text-base font-bold text-gray-800 py-4">
                    Status
                  </TableHead>
                  <TableHead className="text-base font-bold text-gray-800 py-4">
                    Current Assignments
                  </TableHead>
                  <TableHead className="text-base font-bold text-gray-800 py-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: User) => {
                  const userAssignments = getUserAssignments(user.userId);
                  return (
                    <TableRow
                      key={user.userId}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-semibold text-base text-gray-900 py-4">
                        {user.username}
                      </TableCell>
                      <TableCell className="text-base text-gray-800 py-4">
                        {user.name || "N/A"}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className="text-base px-3 py-1 border border-gray-300"
                        >
                          {getUserRole(user)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant={user.isActive ? "default" : "secondary"}
                          className={`text-base px-4 py-1 rounded-full ${
                            user.isActive
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        {userAssignments.length > 0 ? (
                          <div className="space-y-2">
                            {userAssignments.map((assignment: Assignment) => (
                              <div
                                key={assignment.assignmentId}
                                className="text-sm flex items-center"
                              >
                                <span className="font-medium">
                                  {assignment.ward.wardNumber} -{" "}
                                  {assignment.ward.wardName}
                                </span>
                                <br />
                                <span className="text-gray-500">
                                  {assignment.mohalla.mohallaName} (
                                  {assignment.assignmentType})
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleToggleAssignment(
                                      assignment.assignmentId,
                                      assignment.isActive
                                    )
                                  }
                                  disabled={toggleAssignmentMutation.isPending}
                                  className="ml-2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">No assignments</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <Button
                          size="sm"
                          onClick={() => handleAssignClick(user)}
                          disabled={!user.isActive}
                          className="flex items-center text-base font-medium px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assignment Modal */}
      {showAssignmentModal && selectedUser && (
        <AssignmentModal
          user={selectedUser}
          isOpen={showAssignmentModal}
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowAssignmentModal(false);
            setSelectedUser(null);
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
          }}
        />
      )}
    </div>
  );
}
