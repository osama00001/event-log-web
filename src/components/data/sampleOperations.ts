import { Operation } from "../types/Operation";

export const sampleOperations: Operation[] = [
  {
    id: "1",
    jobNumber: "EDSP-1",
    operatorName: "John Doe",
    date: "2024-03-15",
    time: "09:30:00",
    location: "Main Street",
    substation: "Sub-A",
    panelId: "P-123",
    operationType: "Operation",
    operations: ["Check voltage", "Inspect connections"],
    additionalNotes: "Routine maintenance",
    status: "completed",
    timestamps: {
      requested: "2024-03-15T09:30:00",
      completed: "2024-03-15T10:30:00",
    },
  },
  {
    id: "2",
    jobNumber: "EDSP-2",
    operatorName: "Jane Smith",
    date: "2024-03-15",
    time: "10:15:00",
    location: "North Station",
    substation: "Sub-B",
    panelId: "P-456",
    operationType: "Safety Document",
    operations: ["Replace fuse", "Test circuit"],
    additionalNotes: "Emergency repair",
    status: "acknowledged",
    timestamps: {
      requested: "2024-03-15T10:15:00",
      acknowledged: "2024-03-15T11:15:00",
    },
  },
  {
    id: "3",
    jobNumber: "EDSP-3",
    operatorName: "Mike Johnson",
    date: "2024-03-15",
    time: "11:00:00",
    location: "South Complex",
    substation: "Sub-C",
    panelId: "P-789",
    operationType: "Operation",
    operations: ["System upgrade", "Software update"],
    additionalNotes: "Scheduled maintenance",
    status: "issued",
    timestamps: {
      requested: "2024-03-15T11:00:00",
      issued: "2024-03-15T11:30:00",
    },
  },
  {
    id: "4",
    jobNumber: "EDSP-4",
    operatorName: "Sarah Wilson",
    date: "2024-03-15",
    time: "13:45:00",
    location: "East Wing",
    substation: "Sub-D",
    panelId: "P-101",
    operationType: "Operation",
    operations: ["Load testing", "Calibration"],
    additionalNotes: "Annual inspection",
    status: "received",
    timestamps: {
      requested: "2024-03-15T13:45:00",
      received: "2024-03-15T14:45:00",
    },
  },
  {
    id: "5",
    jobNumber: "EDSP-5",
    operatorName: "Tom Brown",
    date: "2024-03-15",
    time: "14:30:00",
    location: "West Building",
    substation: "Sub-E",
    panelId: "P-202",
    operationType: "Safety Document",
    operations: ["Emergency shutdown", "System restart"],
    additionalNotes: "Critical maintenance",
    status: "requested",
    timestamps: {
      requested: "2024-03-15T14:30:00",
    },
  }
];