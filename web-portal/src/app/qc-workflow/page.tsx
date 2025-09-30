"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import QCWorkflowDashboard from "@/components/qc/QCWorkflowDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search, RefreshCw } from "lucide-react";

const QCWorkflowPage: React.FC = () => {
  const [filters, setFilters] = useState({
    qcLevel: "",
    status: "",
    wardId: "",
    mohallaId: "",
    search: "",
  });

  const [activeTab, setActiveTab] = useState("dashboard");

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      qcLevel: "",
      status: "",
      wardId: "",
      mohallaId: "",
      search: "",
    });
  };

  return (
    <ProtectedRoute requiredRoles={["SUPERADMIN", "ADMIN"]}>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                QC Workflow Management
              </h1>
              <p className="text-gray-600">
                Manage multi-level quality control with comprehensive remarks
                system
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="qcLevel">QC Level</Label>
                  <Select
                    value={filters.qcLevel}
                    onValueChange={(value) =>
                      handleFilterChange("qcLevel", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="1">Level 1</SelectItem>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3</SelectItem>
                      <SelectItem value="4">Level 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
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

                <div>
                  <Label htmlFor="wardId">Ward</Label>
                  <input
                    id="wardId"
                    placeholder="Ward ID"
                    value={filters.wardId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleFilterChange("wardId", e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <Label htmlFor="mohallaId">Mohalla</Label>
                  <input
                    id="mohallaId"
                    placeholder="Mohalla ID"
                    value={filters.mohallaId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleFilterChange("mohallaId", e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="search"
                      placeholder="GIS ID, Owner Name..."
                      value={filters.search}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="dashboard">Workflow Dashboard</TabsTrigger>
              <TabsTrigger value="reports">QC Reports</TabsTrigger>
              <TabsTrigger value="settings">QC Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <QCWorkflowDashboard
                qcLevel={
                  filters.qcLevel ? parseInt(filters.qcLevel) : undefined
                }
                status={filters.status || undefined}
                wardId={filters.wardId || undefined}
                mohallaId={filters.mohallaId || undefined}
              />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>QC Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    QC Reports functionality will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>QC Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    QC Settings functionality will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default QCWorkflowPage;
