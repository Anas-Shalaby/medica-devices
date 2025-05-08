import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Supplier, fetchSuppliers } from "@/services/dataService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";

const Suppliers = () => {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Supplier,
    },
    {
      header: "Contact",
      accessorKey: "contact" as keyof Supplier,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof Supplier,
    },
    {
      header: "Phone",
      accessorKey: "phone" as keyof Supplier,
    },
    {
      header: "Category",
      accessorKey: "category" as keyof Supplier,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Supplier,
      cell: (row: Supplier) => (
        <Badge
          variant="outline"
          className={`${
            row.status === "active"
              ? "border-green-500 text-green-500"
              : "border-gray-500 text-gray-500"
          }`}
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Suppliers</h1>
        <p className="text-muted-foreground">Manage supplier relationships</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={suppliers || []}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Suppliers;
