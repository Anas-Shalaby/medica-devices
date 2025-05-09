import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import { userService } from "@/services/services";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Supplier", value: "supplier" },
  { label: "User", value: "user" },
];

const CreateUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setForm((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      await userService.createUser(form);
      toast.success("User created successfully");
      navigate("/users");
    } catch (err) {
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ArrowLeft
        className="w-6 h-6 cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg border border-gray-200 mt-10">
        <h1 className="text-2xl font-bold mb-4">Create New User</h1>
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
            <label className="block mb-1 font-medium">Password</label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
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
              "Create User"
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateUser;
