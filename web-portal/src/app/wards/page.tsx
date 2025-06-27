"use client";

import React from "react";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Ensure CardContent is imported

// Lazy load the tab components
const WardManagementTab = dynamic(() => import("./WardManagementTab"), {
  loading: () => <div>Loading Ward Management...</div>,
});

const WardAssignmentTab = dynamic(() => import("./WardAssignmentTab"), {
  loading: () => <div>Loading Ward Assignment...</div>,
});

const WardManagementPage: React.FC = () => {
  return (
    <ProtectedRoute requireWebPortalAccess>
      <MainLayout>
        <div className="bg-gray-50 min-h-screen">
          <Card className="shadow-xl border border-gray-200 rounded-2xl bg-white max-w-4xl mx-auto">
            <CardHeader className="border-b border-gray-100 p-6">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Ward Management & Assignment
              </h1>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="management" className="w-full">
                <TabsList className="grid w-full grid-cols-2 gap-2 mb-6">
                  <TabsTrigger
                    value="management"
                    className="text-base font-semibold text-gray-700 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2 transition-all hover:bg-gray-100"
                  >
                    Ward Management
                  </TabsTrigger>
                  <TabsTrigger
                    value="assignment"
                    className="text-base font-semibold text-gray-700 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2 transition-all hover:bg-gray-100"
                  >
                    Ward Assignment
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="management" className="mt-0">
                  <WardManagementTab />
                </TabsContent>
                <TabsContent value="assignment" className="mt-0">
                  <WardAssignmentTab />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default WardManagementPage;