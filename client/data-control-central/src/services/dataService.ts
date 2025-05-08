// Mock data service that would normally fetch from an API endpoint

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  craeatedAt: string;
  lastLogout: string;
}

// Device types
export interface Device {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline" | "maintenance";
  lastPing: string;
  owner: string;
}

// Supplier types
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  category: string;
  status: "active" | "inactive";
}

// Mock devices data
const devices: Device[] = [
  {
    id: "1",
    name: "Server A",
    type: "Server",
    status: "online",
    lastPing: "2023-05-08T11:00:00",
    owner: "IT Department",
  },
  {
    id: "2",
    name: "Laptop B-2022",
    type: "Laptop",
    status: "online",
    lastPing: "2023-05-08T10:45:00",
    owner: "John Doe",
  },
  {
    id: "3",
    name: "Router C",
    type: "Network",
    status: "maintenance",
    lastPing: "2023-05-07T09:30:00",
    owner: "IT Department",
  },
  {
    id: "4",
    name: "Printer D",
    type: "Peripheral",
    status: "offline",
    lastPing: "2023-05-05T14:20:00",
    owner: "Office Management",
  },
  {
    id: "5",
    name: "Desktop E-2023",
    type: "Desktop",
    status: "online",
    lastPing: "2023-05-08T10:55:00",
    owner: "Sarah Smith",
  },
  {
    id: "6",
    name: "Tablet F",
    type: "Mobile",
    status: "online",
    lastPing: "2023-05-08T09:15:00",
    owner: "Mike Johnson",
  },
];

// Mock suppliers data
const suppliers: Supplier[] = [
  {
    id: "1",
    name: "Tech Solutions Inc",
    contact: "Jim Brown",
    email: "jim@techsolutions.com",
    phone: "555-1234",
    category: "Hardware",
    status: "active",
  },
  {
    id: "2",
    name: "Network Pro Services",
    contact: "Lisa Gray",
    email: "lisa@networkpro.com",
    phone: "555-2345",
    category: "Network",
    status: "active",
  },
  {
    id: "3",
    name: "Software Experts",
    contact: "David Miller",
    email: "david@softwareexperts.com",
    phone: "555-3456",
    category: "Software",
    status: "inactive",
  },
  {
    id: "4",
    name: "Office Supplies Co",
    contact: "Amanda White",
    email: "amanda@officesupplies.com",
    phone: "555-4567",
    category: "Office",
    status: "active",
  },
];

// Mock API service functions
export const fetchUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...users];
};

export const fetchDevices = async (): Promise<Device[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...devices];
};

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...suppliers];
};

export const fetchStats = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.status === "active").length,
    totalDevices: devices.length,
    onlineDevices: devices.filter((device) => device.status === "online")
      .length,
    totalSuppliers: suppliers.length,
    activeSuppliers: suppliers.filter(
      (supplier) => supplier.status === "active"
    ).length,
  };
};
