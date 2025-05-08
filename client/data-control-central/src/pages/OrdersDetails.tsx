// src/pages/OrderDetails.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { orderService } from "@/services/services";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderPDF from "@/components/pdf/OrderPDF";
import { Button } from "@/components/ui/button";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchOrder = React.useCallback(() => {
    if (!id) return Promise.reject("No order ID provided");
    return orderService.getOrder(id);
  }, [id]);

  const { data, loading, error, execute } = useApi(fetchOrder);

  useEffect(() => {
    if (id) {
      execute();
    }
  }, [id]); // Only depend on id, not execute
  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="text-red-500">Error loading order details</div>
      </DashboardLayout>
    );
  }

  const order = data?.data;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/orders")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Order #{order.orderNumber}
              </h1>
              <p className="text-muted-foreground">
                Created on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <PDFDownloadLink
              document={<OrderPDF order={order} />}
              fileName={`order-${order.orderNumber}.pdf`}
              className="inline-flex"
            >
              {({ loading }) => (
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {loading ? "Generating PDF..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Information */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Order Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <div className="mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Payment Status</label>
              <div className="mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.paymentInfo.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.paymentInfo.status}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Payment Method</label>
              <div className="mt-1">{order.paymentInfo.method}</div>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Subtotal</label>
              <div className="mt-1">
                {order.billing.subtotal} {order.billing.currency}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Tax</label>
              <div className="mt-1">
                {order.billing.tax} {order.billing.currency}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Shipping</label>
              <div className="mt-1">
                {order.billing.shipping} {order.billing.currency}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Discount</label>
              <div className="mt-1">
                {order.billing.discount} {order.billing.currency}
              </div>
            </div>
            <div className="pt-4 border-t">
              <label className="text-sm text-gray-500">Total</label>
              <div className="mt-1 font-semibold">
                {order.billing.total} {order.billing.currency}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item: any) => (
                    <tr key={item._id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium">{item.name}</div>
                        {item.device && typeof item.device === "object" ? (
                          <div className="text-sm text-gray-500">
                            {item.device.manufacturer} - {item.device.model}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            {item.device}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.unitPrice.amount} {item.unitPrice.currency}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.totalPrice.amount} {item.totalPrice.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Recipient</label>
              <div className="mt-1">{order.shippingAddress.recipient}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Address</label>
              <div className="mt-1">
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
                <br />
                {order.shippingAddress.country}
              </div>
            </div>
          </div>
        </div>

        {/* Status History */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Status History</h2>
          <div className="space-y-4">
            {order.statusHistory.map((status: any, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-dashboard-blue"></div>
                <div>
                  <div className="font-medium">{status.status}</div>
                  <div className="text-sm text-gray-500">
                    {formatDate(status.date)}
                  </div>
                  {status.note && (
                    <div className="text-sm text-gray-600 mt-1">
                      {status.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetails;
