import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { userService } from "@/services/services";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Supplier", value: "supplier" },
  { label: "User", value: "user" },
];

const EditUser = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.getUserById(id);
        setForm({
          name: user.name || "",
          email: user.email || "",
          password: "",
          role: user.role || "user",
        });
      } catch (err) {
        toast.error("Failed to fetch user");
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setForm((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    setLoading(true);
    try {
      await userService.updateUser(id, form);
      toast.success("User updated successfully");
      navigate("/users");
    } catch (err) {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ArrowLeft
        className="w-6 h-6 cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg border border-gray-200 mt-10">
        <h1 className="text-2xl font-bold mb-4">Edit User</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Password (leave blank to keep current)
            </label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleRoleChange}
              className="w-full border rounded px-3 py-2"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Update User"
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditUser;
