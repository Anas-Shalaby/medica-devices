// src/pages/Dashboard.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/services";
import { deviceService } from "@/services/services";
import { orderService } from "@/services/services";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import {
  Users,
  Laptop,
  Database,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Dashboard = () => {
  // Fetch all required data
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAllUsers,
  });

  const { data: devices, isLoading: devicesLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: deviceService.getAllDevices,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getAllOrders,
  });

  const isLoading = usersLoading || devicesLoading || ordersLoading;

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!users || !devices || !orders) return null;

    // User stats
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.lastLogout === null).length;
    const totalSuppliers = users.filter(
      (user) => user.role === "supplier"
    ).length;

    // Device stats
    const totalDevices = devices?.devices?.length;
    const deviceCategories = {
      diagnostic: devices?.devices.filter(
        (device) => device.type === "diagnostic"
      ).length,
      therapeutic: devices?.devices.filter(
        (device) => device.type === "therapeutic"
      ).length,
      monitoring: devices?.devices.filter(
        (device) => device.type === "monitoring"
      ).length,
    };
    // Order stats
    const totalOrders = orders?.data.length;
    const orderStatus = {
      draft: orders?.data.filter((order) => order.status === "draft").length,
      placed: orders?.data.filter((order) => order.status === "placed").length,
      confirmed: orders?.data.filter((order) => order.status === "confirmed")
        .length,
      processing: orders?.data.filter((order) => order.status === "processing")
        .length,
      shipped: orders?.data.filter((order) => order.status === "shipped")
        .length,
      delivered: orders?.data.filter((order) => order.status === "delivered")
        .length,
      cancelled: orders?.data.filter((order) => order.status === "cancelled")
        .length,
    };

    // Calculate total revenue
    const totalRevenue = orders?.data
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + order.billing.total, 0);

    return {
      totalUsers,
      activeUsers,
      totalSuppliers,
      totalDevices,
      deviceCategories,
      totalOrders,
      orderStatus,
      totalRevenue,
      pendingOrders:
        orderStatus.placed + orderStatus.confirmed + orderStatus.processing,
      completedOrders: orderStatus.delivered,
      cancelledOrders: orderStatus.cancelled,
    };
  }, [users, devices, orders]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<Users className="h-5 w-5 text-dashboard-blue" />}
              description={`${stats.activeUsers} active users`}
              colorClass="bg-dashboard-blue"
            />

            <StatCard
              title="Devices"
              value={stats.totalDevices}
              icon={<Laptop className="h-5 w-5 text-dashboard-green" />}
              description={`${stats.deviceCategories.diagnostic} diagnostic devices`}
              colorClass="bg-dashboard-green"
            />

            <StatCard
              title="Suppliers"
              value={stats.totalSuppliers}
              icon={<Database className="h-5 w-5 text-dashboard-purple" />}
              description="Active suppliers"
              colorClass="bg-dashboard-purple"
            />

            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="h-5 w-5 text-dashboard-yellow" />}
              description="Total sales revenue"
              colorClass="bg-dashboard-yellow"
            />
          </div>

          {/* Order Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingCart className="h-5 w-5 text-dashboard-blue" />}
              description="All orders"
              colorClass="bg-dashboard-blue"
            />

            <StatCard
              title="Pending Orders"
              value={stats.pendingOrders}
              icon={<Clock className="h-5 w-5 text-dashboard-yellow" />}
              description="Orders in progress"
              colorClass="bg-dashboard-yellow"
            />

            <StatCard
              title="Completed Orders"
              value={stats.completedOrders}
              icon={<CheckCircle className="h-5 w-5 text-dashboard-green" />}
              description="Successfully delivered"
              colorClass="bg-dashboard-green"
            />

            <StatCard
              title="Cancelled Orders"
              value={stats.cancelledOrders}
              icon={<XCircle className="h-5 w-5 text-dashboard-red" />}
              description="Failed or cancelled"
              colorClass="bg-dashboard-red"
            />
          </div>

          {/* Device Categories */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-lg font-semibold mb-4">Device Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">Diagnostic</div>
                <div className="text-2xl font-bold">
                  {stats.deviceCategories.diagnostic}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 mb-1">Therapeutic</div>
                <div className="text-2xl font-bold">
                  {stats.deviceCategories.therapeutic}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">Monitoring</div>
                <div className="text-2xl font-bold">
                  {stats.deviceCategories.monitoring}
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              Order Status Distribution
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.orderStatus).map(([status, count]) => (
                <div key={status} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1 capitalize">
                    {status}
                  </div>
                  <div className="text-2xl font-bold">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </DashboardLayout>
  );
};

export default Dashboard;
