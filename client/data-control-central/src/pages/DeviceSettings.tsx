import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const DeviceSettings = () => {
  const handleSave = () => {
    toast.success("Device settings saved successfully");
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Device Settings</h1>
        <p className="text-muted-foreground">
          Configure device management settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure general device management settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-discovery">Auto Device Discovery</Label>
              <Switch id="auto-discovery" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-updates">Automatic Updates</Label>
              <Switch id="auto-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="device-monitoring">Real-time Monitoring</Label>
              <Switch id="device-monitoring" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure device-related notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-alerts">Maintenance Alerts</Label>
              <Switch id="maintenance-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="error-notifications">Error Notifications</Label>
              <Switch id="error-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="status-updates">Status Updates</Label>
              <Switch id="status-updates" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Configure device data handling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data-retention">
                Data Retention Period (days)
              </Label>
              <Input
                id="data-retention"
                type="number"
                defaultValue={30}
                min={1}
                max={365}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure device security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="encryption">Data Encryption</Label>
              <Switch id="encryption" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="access-control">Strict Access Control</Label>
              <Switch id="access-control" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="audit-logging">Audit Logging</Label>
              <Switch id="audit-logging" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </DashboardLayout>
  );
};

export default DeviceSettings;
