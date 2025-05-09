import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import { deviceService } from "@/services/services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

// Define the data? interface based on your MongoDB schema
interface device {
  _id: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  type: "diagnostic" | "therapeutic" | "monitoring";
  price?: {
    amount: number;
    currency: string;
    discountPercentage?: number;
  };
  availability?: {
    inStock: boolean;
    quantity: number;
    leadTimeInDays: number;
  };
  regulatory?: {
    fdaApproved: boolean;
    ceMarked: boolean;
    approvalDocuments: Array<{
      type: string;
      documentUrl: string;
      issueDate: Date;
      expiryDate: Date;
    }>;
  };
  specifications?: {
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    weight?: {
      value: number;
      unit: string;
    };
    powerRequirements?: string;
    connectivity?: string[];
    operatingSystem?: string;
    compatibleWith?: string[];
  };
  images?: Array<{
    url: string;
    isPrimary: boolean;
    caption: string;
  }>;
  videos?: Array<{
    url: string;
    caption: string;
  }>;
  documentation?: Array<{
    type: string;
    url: string;
    title: string;
  }>;
  warranty?: {
    durationInMonths: number;
    description: string;
    extendedWarrantyAvailable: boolean;
  };
  status: "active" | "inactive" | "maintenance" | "retired";
  lastCalibrationDate?: Date;
  nextCalibrationDate?: Date;
  location?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const fetchDevice = React.useCallback(() => {
    if (!id) return Promise.reject("No data? ID provided");
    return deviceService.getDevice(id);
  }, [id]);

  const { data, loading, error, execute } = useApi(fetchDevice);

  useEffect(() => {
    if (id) {
      execute();
    }
  }, [id]);

  const handleMaintenanceRequest = () => {
    toast.success("Maintenance request submitted");
  };

  const handleCalibrationRequest = () => {
    toast.success("Calibration request submitted");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "maintenance":
        return "bg-yellow-500";
      case "retired":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

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
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-lg text-red-500">{error || "data? not found"}</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/devices")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold mb-1">{data?.name}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {data?.manufacturer} • Model: {data?.model}
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge className={getStatusColor(data?.status)}>
            {data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Mobile Tab Selector (visible on small screens) */}
      <div className="block md:hidden mb-4">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="specifications">Specifications</SelectItem>
            <SelectItem value="documentation">Documentation</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="media">Media</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tabs (hidden on small screens) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 gap-1 hidden md:flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        {/* Tab Content (works with both mobile select and desktop tabs) */}
        <div className="mt-4">
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Device Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Device Information</CardTitle>
                    <CardDescription>Basic data? details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Serial Number
                        </p>
                        <p>{data?.serialNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Type
                        </p>
                        <p className="capitalize">{data?.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Location
                        </p>
                        <p>{data?.location || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Department
                        </p>
                        <p>{data?.department || "Not specified"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Availability & Pricing</CardTitle>
                    <CardDescription>
                      Stock and pricing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data?.availability ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            In Stock
                          </p>
                          <p>{data?.availability.inStock ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Quantity
                          </p>
                          <p>{data?.availability.quantity || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Lead Time
                          </p>
                          <p>{data?.availability.leadTimeInDays || 0} days</p>
                        </div>
                      </div>
                    ) : (
                      <p>No availability information</p>
                    )}

                    <Separator className="my-4" />

                    {data?.price ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Price
                          </p>
                          <p className="text-lg font-semibold">
                            {data?.price.currency}{" "}
                            {data?.price.amount.toFixed(2)}
                          </p>
                        </div>
                        {data?.price.discountPercentage ? (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Discount
                            </p>
                            <p className="text-green-600">
                              {data?.price.discountPercentage}% off
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <p>No pricing information</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regulatory Information</CardTitle>
                    <CardDescription>
                      Compliance and certifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data?.regulatory ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              FDA Approved
                            </p>
                            <p>{data?.regulatory.fdaApproved ? "Yes" : "No"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              CE Marked
                            </p>
                            <p>{data?.regulatory.ceMarked ? "Yes" : "No"}</p>
                          </div>
                        </div>

                        {data?.regulatory.approvalDocuments &&
                          data?.regulatory.approvalDocuments.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">
                                Approval Documents
                              </p>
                              <ul className="space-y-2">
                                {data?.regulatory.approvalDocuments.map(
                                  (doc, index) => (
                                    <li key={index}>
                                      <a
                                        href={doc.documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        {doc.type}
                                      </a>
                                      <p className="text-xs text-muted-foreground">
                                        Valid until:{" "}
                                        {new Date(
                                          doc.expiryDate
                                        ).toLocaleDateString()}
                                      </p>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    ) : (
                      <p>No regulatory information</p>
                    )}
                  </CardContent>
                </Card>
                <TabsContent value="warranty">
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Warranty Information</CardTitle>
                        <CardDescription>
                          Warranty details and coverage
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {data?.warranty ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Duration
                                </p>
                                <p>{data?.warranty.durationInMonths} months</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Extended Available
                                </p>
                                <p>
                                  {data?.warranty.extendedWarrantyAvailable
                                    ? "Yes"
                                    : "No"}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Description
                              </p>
                              <p>{data?.warranty.description}</p>
                            </div>
                          </div>
                        ) : (
                          <p>No warranty information</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>
                  Detailed device specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data?.specifications ? (
                  <div className="space-y-6">
                    {data?.specifications.dimensions && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Dimensions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Length
                            </p>
                            <p>
                              {data?.specifications.dimensions.length}{" "}
                              {data?.specifications.dimensions.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Width
                            </p>
                            <p>
                              {data?.specifications.dimensions.width}{" "}
                              {data?.specifications.dimensions.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Height
                            </p>
                            <p>
                              {data?.specifications.dimensions.height}{" "}
                              {data?.specifications.dimensions.unit}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {data?.specifications.weight && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Weight</h3>
                        <p>
                          {data?.specifications.weight.value}{" "}
                          {data?.specifications.weight.unit}
                        </p>
                      </div>
                    )}

                    {data?.specifications.powerRequirements && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Power Requirements
                        </h3>
                        <p>{data?.specifications.powerRequirements}</p>
                      </div>
                    )}

                    {data?.specifications.connectivity &&
                      data?.specifications.connectivity.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            Connectivity
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {data?.specifications.connectivity.map(
                              (item, index) => (
                                <Badge key={index} variant="outline">
                                  {item}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {data?.specifications.operatingSystem && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Operating System
                        </h3>
                        <p>{data?.specifications.operatingSystem}</p>
                      </div>
                    )}

                    {data?.specifications.compatibleWith &&
                      data?.specifications.compatibleWith.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            Compatible With
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {data?.specifications.compatibleWith.map(
                              (item, index) => (
                                <Badge key={index} variant="outline">
                                  {item}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <p>No specifications available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>
                  User manuals, guides, and technical documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data?.documentation && data?.documentation.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.documentation.map((doc, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <h3 className="font-medium mb-2">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 capitalize">
                            {doc.type}
                          </p>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Document
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No documentation available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History</CardTitle>
                  <CardDescription>
                    Calibration and service records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Last Calibration
                        </p>
                        <p>
                          {data?.lastCalibrationDate
                            ? new Date(
                                data?.lastCalibrationDate
                              ).toLocaleDateString()
                            : "Not available"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Next Calibration
                        </p>
                        <p>
                          {data?.nextCalibrationDate
                            ? new Date(
                                data?.nextCalibrationDate
                              ).toLocaleDateString()
                            : "Not scheduled"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Requests</CardTitle>
                  <CardDescription>
                    Request maintenance or calibration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      onClick={handleMaintenanceRequest}
                      className="w-full"
                    >
                      Request Maintenance
                    </Button>
                    <Button
                      onClick={handleCalibrationRequest}
                      variant="outline"
                      className="w-full"
                    >
                      Schedule Calibration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Images & Videos</CardTitle>
                <CardDescription>Visual media for this device</CardDescription>
              </CardHeader>
              <CardContent>
                {(data?.images && data?.images.length > 0) ||
                (data?.videos && data?.videos.length > 0) ? (
                  <div className="space-y-6">
                    {data?.images && data?.images.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Images</h3>
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {data?.images.map((image, index) => (
                            <div
                              key={index}
                              className="overflow-hidden rounded-md border"
                            >
                              <img
                                src={image.url}
                                alt={
                                  image.caption ||
                                  `${data?.name} image ${index + 1}`
                                }
                                className="h-auto w-full object-cover transition-all hover:scale-105"
                              />
                              {image.caption && (
                                <div className="p-2 text-sm text-muted-foreground">
                                  {image.caption}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data?.videos && data?.videos.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Videos</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {data?.videos.map((video, index) => (
                            <div
                              key={index}
                              className="overflow-hidden rounded-md border"
                            >
                              <div className="aspect-video">
                                <iframe
                                  src={video.url}
                                  title={
                                    video.caption ||
                                    `${data?.name} video ${index + 1}`
                                  }
                                  className="h-full w-full"
                                  allowFullScreen
                                ></iframe>
                              </div>
                              {video.caption && (
                                <div className="p-2 text-sm text-muted-foreground">
                                  {video.caption}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>No media available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </DashboardLayout>
  );
};

export default DeviceDetails;
