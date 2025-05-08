import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, fetchUsers } from "@/services/dataService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { userService } from "@/services/services";

const Users = () => {
  const { data, loading, error, execute } = useApi(userService.getAllUsers);

  useEffect(() => {
    execute();
  }, [execute]);
  const columns = [
    {
      header: "Name",
      accessor: (row: User) => row.name, // Changed from accessorKey to accessor
    },
    {
      header: "Email",
      accessor: (row: User) => row.email,
    },
    {
      header: "Role",
      accessor: (row: User) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : row.role === "supplier"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: "Created At",
      accessor: (row: User) => formatDate(row.createdAt),
    },
    {
      header: "Last Active",
      accessor: (row: User) =>
        row.lastLogout ? formatDate(row.lastLogout) : "Never",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Users</h1>
        <p className="text-muted-foreground">Manage system users</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <DataTable columns={columns} data={data || []} isLoading={loading} />
      </div>
    </DashboardLayout>
  );
};

export default Users;
