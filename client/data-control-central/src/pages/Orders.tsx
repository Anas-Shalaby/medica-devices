// src/pages/Orders.tsx
import React, { useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { orderService } from "@/services/services";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/table/DataTable";
import { formatDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Orders = () => {
  const { data, loading, error, execute } = useApi(orderService.getAllOrders);
  const navigate = useNavigate();
  useEffect(() => {
    execute();
  }, [execute]);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      placed: "bg-blue-100 text-blue-800",
      confirmed: "bg-yellow-100 text-yellow-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      returned: "bg-orange-100 text-orange-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const columns = [
    {
      header: "Order Number",
      accessor: (row: any) => (
        <div className="font-medium text-dashboard-blue">
          #{row.orderNumber}
        </div>
      ),
    },
    {
      header: "Buyer",
      accessor: (row: any) => (
        <div>
          <div className="font-medium">{row.buyer.name}</div>
          <div className="text-sm text-gray-500">{row.buyer.email}</div>
        </div>
      ),
    },
    {
      header: "Supplier",
      accessor: (row: any) => (
        <div>
          <div className="font-medium">{row.supplier.companyName}</div>
          <div className="text-sm text-gray-500">
            {row.supplier.contactPerson}
          </div>
        </div>
      ),
    },
    {
      header: "Items",
      accessor: (row: any) => (
        <div>
          <div className="font-medium">{row.items.length} items</div>
          <div className="text-sm text-gray-500">
            {row.items.map((item: any) => item.name).join(", ")}
          </div>
        </div>
      ),
    },
    {
      header: "Total Amount",
      accessor: (row: any) => (
        <div>
          <div className="font-medium">
            {row.billing.total} {row.billing.currency}
          </div>
          {row.billing.discount > 0 && (
            <div className="text-sm text-green-600">
              {row.billing.discount} {row.billing.currency} discount
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <div className="flex flex-col gap-1">
          <span
            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
              row.status
            )}`}
          >
            {row.status}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(row.statusHistory[row.statusHistory.length - 1]?.date)}
          </span>
        </div>
      ),
    },
    {
      header: "Payment",
      accessor: (row: any) => (
        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              row.paymentInfo.status === "completed"
                ? "bg-green-100 text-green-800"
                : row.paymentInfo.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.paymentInfo.status}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            {row.paymentInfo.method}
          </div>
        </div>
      ),
    },
    {
      header: "Shipping",
      accessor: (row: any) => (
        <div>
          <div className="text-sm">{row.shippingAddress.recipient}</div>
          <div className="text-xs text-gray-500">
            {row.shippingAddress.city}, {row.shippingAddress.country}
          </div>
        </div>
      ),
    },
    {
      header: "Created",
      accessor: (row: any) => formatDate(row.createdAt),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex gap-2">
          <button
            className="px-2 py-1 text-xs bg-dashboard-blue text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => navigate(`/orders/${row._id}`)}
          >
            View
          </button>
          {row.status === "draft" && (
            <button
              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              onClick={() => console.log("Place order:", row._id)}
            >
              Place Order
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Orders</h1>
            <p className="text-muted-foreground">Manage and track all orders</p>
          </div>
          <Button onClick={() => navigate("/orders/create")}>
            <span className="mr-2">+</span>
            New Order
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Orders;
