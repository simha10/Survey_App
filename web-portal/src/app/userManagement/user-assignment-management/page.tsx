"use client";
import { assignmentApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";

// --- UserAssignments Management Division ---
function UserAssignmentsTable({
  ulbId,
  zoneId,
  wardId,
}: {
  ulbId?: string;
  zoneId?: string;
  wardId?: string;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  // For demo, fetch all assignments for all users (could be filtered by ULB/Zone/Ward)
  const { data, isLoading, error } = useQuery({
    queryKey: ["allAssignments"],
    queryFn: assignmentApi.getAllAssignments,
  });

  const mutationUpdate = useMutation({
    mutationFn: ({
      assignmentId,
      isActive,
    }: {
      assignmentId: string;
      isActive: boolean;
    }) => assignmentApi.updateAssignmentStatus(assignmentId, isActive),
    onSuccess: () => {
      // Invalidate multiple query keys to refresh all related data
      queryClient.invalidateQueries({
        queryKey: ["allAssignments", ulbId, zoneId, wardId],
      });
      queryClient.invalidateQueries({ queryKey: ["wards"] });
      queryClient.invalidateQueries({ queryKey: ["mohallas"] });
      queryClient.invalidateQueries({ queryKey: ["available-wards"] });
      queryClient.invalidateQueries({ queryKey: ["all-wards"] });

      // Trigger global update notification
      localStorage.setItem("assignment_updated", Date.now().toString());
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "assignment_updated",
          newValue: Date.now().toString(),
        })
      );

      alert("Assignment status updated successfully.");
    },
    onError: (error: any) => {
      alert(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to update assignment status."
      );
    },
  });
  const mutationDelete = useMutation({
    mutationFn: (assignmentId: string) =>
      assignmentApi.deleteAssignment(assignmentId),
    onSuccess: () => {
      // Invalidate multiple query keys to refresh all related data
      queryClient.invalidateQueries({
        queryKey: ["allAssignments", ulbId, zoneId, wardId],
      });
      queryClient.invalidateQueries({ queryKey: ["wards"] });
      queryClient.invalidateQueries({ queryKey: ["mohallas"] });
      queryClient.invalidateQueries({ queryKey: ["available-wards"] });
      queryClient.invalidateQueries({ queryKey: ["all-wards"] });

      // Trigger global update notification
      localStorage.setItem("assignment_updated", Date.now().toString());
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "assignment_updated",
          newValue: Date.now().toString(),
        })
      );

      // Show success message
      alert(
        "Assignment deleted successfully. Ward is now available for reassignment."
      );
    },
    onError: (error: any) => {
      alert(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to delete assignment."
      );
    },
  });

  if (isLoading) return <div className="mt-8">Loading assignments...</div>;
  if (error)
    return <div className="mt-8 text-red-500">Error loading assignments</div>;
  if (!data || !data.assignments || data.assignments.length === 0)
    return <div className="mt-8">No assignments found.</div>;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">User Assignments Management</h2>
      <div className="overflow-x-auto bg-black rounded-lg shadow-md text-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="text-blue-400 text-sm">
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Wards Assigned</th>
              <th className="px-4 py-2">Mohallas Assigned</th>
              <th className="px-4 py-2">Assigned By</th>
              <th className="px-4 py-2">Is Active</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.assignments.map((a: any) => (
              <tr key={a.assignmentId}>
                <td className="px-4 py-2">
                  {a.user?.name || a.user?.username || "-"}
                </td>
                <td className="px-4 py-2">{a.ward?.wardName || "-"}</td>
                <td className="px-4 py-2">
                  {a.mohallas
                    ? a.mohallas.map((m: any) => m.mohallaName).join(", ")
                    : a.mohallaIds
                    ? a.mohallaIds.join(", ")
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {a.assignedBy?.name || a.assignedBy?.username || "-"}
                </td>
                <td className="px-4 py-2">
                  <button
                    className={`inline-flex items-center gap-1 cursor-pointer ${
                      mutationUpdate.isPending
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                    onClick={() =>
                      mutationUpdate.mutate({
                        assignmentId: a.assignmentId,
                        isActive: !a.isActive,
                      })
                    }
                    title={a.isActive ? "Deactivate" : "Activate"}
                    disabled={mutationUpdate.isPending}
                  >
                    {mutationUpdate.isPending &&
                    mutationUpdate.variables?.assignmentId ===
                      a.assignmentId ? (
                      <span className="loader mr-2" />
                    ) : a.isActive ? (
                      <ToggleRight className="text-green-600" />
                    ) : (
                      <ToggleLeft className="text-gray-400" />
                    )}
                    {a.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-2 flex gap-2 ">
                  {/* Edit action could open a modal for reassignment, not implemented here */}
                  {/* <button className="text-blue-600 hover:text-blue-900" title="Edit">
                      <Pencil size={18} />
                    </button> */}
                  <button
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                    title="Delete Assignment"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this assignment?"
                        )
                      ) {
                        mutationDelete.mutate(a.assignmentId);
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UserAssignmentManagementPage() {
  return (
    <MainLayout>
      <UserAssignmentsTable />
    </MainLayout>
  );
}
