"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";

export default function FinancialYearClosingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for consistency
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Financial Year Closing</h1>
      </div>
    </MainLayout>
  );
}
