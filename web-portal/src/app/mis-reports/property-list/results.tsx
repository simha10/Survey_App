"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Loading from "@/components/ui/loading";
import toast from "react-hot-toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";

interface Property {
  surveyUniqueCode: string;
  mapId: string;
  gisId: string;
  propertyType: string;
  ownerName: string;
  mohalla: { mohallaName: string } | null;
  ward: { wardName: string } | null;
  zone: { zoneName: string } | null;
  respondentName: string;
  createdAt: string;
  // ...add more fields as needed
}

export default function PropertyListResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ulbId = searchParams.get("ulb");
  const zoneId = searchParams.get("zone");
  const wardId = searchParams.get("ward");

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (!ulbId || !zoneId || !wardId) {
      toast.error(
        "Missing filter parameters. Please select ULB, Zone, and Ward."
      );
      router.replace("/mis-reports/property-list");
      return;
    }
    fetchProperties();
    // eslint-disable-next-line
  }, [ulbId, zoneId, wardId]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/qc/property-list?ulbId=${ulbId}&zoneId=${zoneId}&wardId=${wardId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setProperties(data.data || []);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to fetch property list");
      }
    } catch (e) {
      toast.error("Error fetching property list");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Property List (QC Results)</h1>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Map ID</TableHead>
                <TableHead>GIS ID</TableHead>
                <TableHead>Property Type</TableHead>
                <TableHead>Owner Name</TableHead>
                <TableHead>Mohalla</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Respondent</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">
                    No properties found.
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((prop) => (
                  <TableRow key={prop.surveyUniqueCode}>
                    <TableCell>{prop.mapId}</TableCell>
                    <TableCell>{prop.gisId}</TableCell>
                    <TableCell>{prop.propertyType}</TableCell>
                    <TableCell>{prop.ownerName}</TableCell>
                    <TableCell>{prop.mohalla?.mohallaName || "-"}</TableCell>
                    <TableCell>{prop.ward?.wardName || "-"}</TableCell>
                    <TableCell>{prop.respondentName}</TableCell>
                    <TableCell>
                      {new Date(prop.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit QC"
                        onClick={() =>
                          router.push(
                            `/mis-reports/property-list/${prop.surveyUniqueCode}/edit`
                          )
                        }
                      >
                        <Pencil size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
