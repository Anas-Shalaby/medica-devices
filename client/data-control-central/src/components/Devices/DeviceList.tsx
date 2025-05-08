// src/components/Devices/DeviceList.tsx
import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import type { Device } from "../../services/api/types";
import {
  deviceService,
  supplierService,
  orderService,
} from "../../services/services";
const DeviceList: React.FC = () => {
  const { data, loading, error, execute } = useApi(deviceService.getAllDevices);

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data?.devices) return <div>No devices found</div>;

  return (
    <div>
      <h2>Devices</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {data?.devices.map((device) => (
            <tr key={device._id}>
              <td>{device.name}</td>
              <td>{device.manufacturer}</td>
              <td>{device.model}</td>
              <td>
                {device.price.amount} {device.price.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceList;
