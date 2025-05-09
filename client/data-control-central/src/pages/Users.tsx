import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, fetchUsers } from "@/services/dataService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/table/DataTable";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { userService } from "@/services/services";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Plus, Trash, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const Users = () => {
  const { data, loading, error, execute } = useApi(userService.getAllUsers);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await userService.deleteUser(userToDelete?._id);
      setShowDeleteModal(false);
      setUserToDelete(null);
      execute();
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };
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
    {
      header: "Actions",
      accessor: (row: User) => (
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setUserToDelete(row);
              setShowDeleteModal(true);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              navigate(`/users/${row?._id}`);
            }}
          >
            <Edit className="w-4 h-4 text-black-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Users</h1>
        <p className="text-muted-foreground">Manage system users</p>
      </div>
      <div className="mb-3 flex justify-end">
        <Button onClick={() => navigate("/users/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <DataTable columns={columns} data={data || []} isLoading={loading} />
      </div>
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete user <b>{userToDelete?.name}</b>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Users;
