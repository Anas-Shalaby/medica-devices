// src/pages/CreateOrder.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { deviceService } from "@/services/services";
import { orderService } from "@/services/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface OrderItem {
  device: string;
  quantity: number;
}

interface Address {
  recipient: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  specialInstructions?: string;
}

const CreateOrder = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    recipient: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    specialInstructions: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");

  // Fetch available devices
  const { data: devices, isLoading: devicesLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: deviceService.getAllDevices,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (data) => {
      toast.success("Order created successfully");
      navigate(`/orders/${data.data._id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create order");
    },
  });

  const handleAddItem = () => {
    setItems([...items, { device: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Please add at least one item to the order");
      return;
    }

    // Validate that all items have a device selected
    const invalidItems = items.filter((item) => !item.device);
    if (invalidItems.length > 0) {
      toast.error("Please select a device for all items");
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        device: item.device,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
      },
    };

    createOrderMutation.mutate(orderData);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Create New Order</h1>
        <p className="text-muted-foreground">
          Fill in the details to create a new order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Items Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <Label>Device</Label>
                  <Select
                    value={item.device}
                    onValueChange={(value) =>
                      handleItemChange(index, "device", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a device" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices?.devices.map((device) => (
                        <SelectItem key={device._id} value={device._id}>
                          {device.name} - {device.manufacturer} {device.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value)
                      )
                    }
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveItem(index)}
                  className="mt-8"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddItem}>
              Add Item
            </Button>
          </div>
        </Card>

        {/* Shipping Address Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Recipient Name</Label>
              <Input
                value={shippingAddress.recipient}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    recipient: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Street Address</Label>
              <Input
                value={shippingAddress.street}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    street: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>State/Province</Label>
              <Input
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    state: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>ZIP/Postal Code</Label>
              <Input
                value={shippingAddress.zipCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    zipCode: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Country</Label>
              <Input
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label>Special Instructions (Optional)</Label>
              <Input
                value={shippingAddress.specialInstructions}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    specialInstructions: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </Card>

        {/* Payment Method Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          <div>
            <Label>Select Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="purchase_order">Purchase Order</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/orders")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createOrderMutation.isPending}>
            {createOrderMutation.isPending
              ? "Creating Order..."
              : "Create Order"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateOrder;
