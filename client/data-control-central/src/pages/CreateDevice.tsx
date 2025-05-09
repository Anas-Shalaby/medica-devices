// src/pages/CreateDevice.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { deviceService } from "@/services/services";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
}

interface ApiError {
  response?: {
    data: ApiErrorResponse;
  };
}

type FormValue = string | number | boolean | Record<string, unknown>;

interface DeviceFormData {
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  type: "diagnostic" | "therapeutic" | "monitoring";
  price: {
    amount: number;
    currency: string;
    discountPercentage?: number;
  };
  availability: {
    inStock: boolean;
    quantity: number;
    leadTimeInDays?: number;
  };
  specifications: {
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    weight: {
      value: number;
      unit: string;
    };
    powerRequirements: string;
    connectivity: string[];
    operatingSystem: string;
    compatibleWith: string[];
  };
  warranty: {
    durationInMonths: number;
    description: string;
    extendedWarrantyAvailable: boolean;
  };
  status: "active" | "inactive" | "maintenance" | "retired";
  location: string;
  department: string;
}

const CreateDevice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DeviceFormData>({
    name: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    type: "diagnostic",
    price: {
      amount: 0,
      currency: "USD",
      discountPercentage: 0,
    },
    availability: {
      inStock: true,
      quantity: 0,
      leadTimeInDays: 0,
    },
    specifications: {
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: "cm",
      },
      weight: {
        value: 0,
        unit: "kg",
      },
      powerRequirements: "",
      connectivity: [],
      operatingSystem: "",
      compatibleWith: [],
    },
    warranty: {
      durationInMonths: 12,
      description: "",
      extendedWarrantyAvailable: false,
    },
    status: "active",
    location: "",
    department: "",
  });

  const createDeviceMutation = useMutation({
    mutationFn: deviceService.createDevice,
    onSuccess: (response) => {
      if (response) {
        toast.success("Device created successfully");
        navigate(`/devices/${response?._id}`);
      } else {
        toast.error("Failed to create device: Invalid response from server");
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create device";
      toast.error(errorMessage);
      console.error("Device creation error:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDeviceMutation.mutateAsync(formData);
    } catch (error) {
      // Error is already handled in onError
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleInputChange = (
    field: keyof DeviceFormData,
    value: FormValue,
    nestedField?: string
  ) => {
    setFormData((prev) => {
      if (nestedField) {
        return {
          ...prev,
          [field]: {
            ...(prev[field] as Record<string, unknown>),
            [nestedField]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Create New Device</h1>
        <p className="text-muted-foreground">
          Add a new medical device to the system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Device Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Manufacturer</Label>
              <Input
                value={formData.manufacturer}
                onChange={(e) =>
                  handleInputChange("manufacturer", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label>Model</Label>
              <Input
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Serial Number</Label>
              <Input
                value={formData.serialNumber}
                onChange={(e) =>
                  handleInputChange("serialNumber", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label>Device Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="therapeutic">Therapeutic</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Pricing and Availability */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Pricing and Availability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Price Amount</Label>
              <Input
                type="number"
                value={formData.price.amount}
                onChange={(e) =>
                  handleInputChange("price", {
                    ...formData.price,
                    amount: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                value={formData.price.currency}
                onValueChange={(value) =>
                  handleInputChange("price", {
                    ...formData.price,
                    currency: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                value={formData.price.discountPercentage}
                onChange={(e) =>
                  handleInputChange("price", {
                    ...formData.price,
                    discountPercentage: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Quantity in Stock</Label>
              <Input
                type="number"
                value={formData.availability.quantity}
                onChange={(e) =>
                  handleInputChange("availability", {
                    ...formData.availability,
                    quantity: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.availability.inStock}
                onCheckedChange={(checked) =>
                  handleInputChange("availability", {
                    ...formData.availability,
                    inStock: checked,
                  })
                }
              />
              <Label>In Stock</Label>
            </div>
          </div>
        </Card>

        {/* Specifications */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Power Requirements</Label>
              <Input
                value={formData.specifications.powerRequirements}
                onChange={(e) =>
                  handleInputChange("specifications", {
                    ...formData.specifications,
                    powerRequirements: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Operating System</Label>
              <Input
                value={formData.specifications.operatingSystem}
                onChange={(e) =>
                  handleInputChange("specifications", {
                    ...formData.specifications,
                    operatingSystem: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Dimensions (Length)</Label>
              <Input
                type="number"
                value={formData.specifications.dimensions.length}
                onChange={(e) =>
                  handleInputChange("specifications", {
                    ...formData.specifications,
                    dimensions: {
                      ...formData.specifications.dimensions,
                      length: parseFloat(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                value={formData.specifications.weight.value}
                onChange={(e) =>
                  handleInputChange("specifications", {
                    ...formData.specifications,
                    weight: {
                      ...formData.specifications.weight,
                      value: parseFloat(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        </Card>

        {/* Warranty Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Warranty Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Warranty Duration (months)</Label>
              <Input
                type="number"
                value={formData.warranty.durationInMonths}
                onChange={(e) =>
                  handleInputChange("warranty", {
                    ...formData.warranty,
                    durationInMonths: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Warranty Description</Label>
              <Textarea
                value={formData.warranty.description}
                onChange={(e) =>
                  handleInputChange("warranty", {
                    ...formData.warranty,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.warranty.extendedWarrantyAvailable}
                onCheckedChange={(checked) =>
                  handleInputChange("warranty", {
                    ...formData.warranty,
                    extendedWarrantyAvailable: checked,
                  })
                }
              />
              <Label>Extended Warranty Available</Label>
            </div>
          </div>
        </Card>

        {/* Location Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Location Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
            <div>
              <Label>Department</Label>
              <Input
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
              />
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/devices")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createDeviceMutation.isPending}>
            {createDeviceMutation.isPending
              ? "Creating Device..."
              : "Create Device"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateDevice;
