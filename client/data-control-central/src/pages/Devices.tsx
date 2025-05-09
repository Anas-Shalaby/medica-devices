import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Device, fetchDevices } from "@/services/dataService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/table/DataTable";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { deviceService } from "@/services/services";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Eye } from "lucide-react";
import { toast } from "sonner";

const Devices = () => {
  const { data: devices, isLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
  });
  const { data, loading, error, execute } = useApi(deviceService.getAllDevices);
  const navigate = useNavigate();
  useEffect(() => {
    execute();
  }, [execute]);
  const columns = [
    {
      header: "Name",
      accessor: (row: any) => row.name,
    },
    {
      header: "Manufacturer",
      accessor: (row: any) => row.manufacturer,
    },

    {
      header: "Supplier",
      accessor: (row: any) => row.supplier?.name,
    },
    {
      header: "Type",
      accessor: (row: any) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {row.type}
        </span>
      ),
    },
    {
      header: "Price",
      accessor: (row: any) => (
        <div>
          <span className="font-medium">
            {row.price.amount} {row.price.currency}
          </span>
          {row.price.discountPercentage > 0 && (
            <span className="ml-2 text-xs text-green-600">
              {row.price.discountPercentage}% off
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Stock",
      accessor: (row: any) => (
        <div className="flex items-center">
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              row.availability.inStock ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span>{row.availability.quantity} units</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/devices/${row._id}`)}
          className="flex items-center"
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      ),
    },
  ];
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Devices</h1>
        <p className="text-muted-foreground">Monitor and manage devices</p>
      </div>
      <div className="mb-10 flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => toast.warning("This feature is under developing.")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Device Settings
        </Button>
        <Button onClick={() => navigate("/devices/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Device
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={data?.devices || []}
          isLoading={loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Devices;
