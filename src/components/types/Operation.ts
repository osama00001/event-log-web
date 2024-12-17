export interface Operation {
  _id: string;
  jobNumber: string;
  operatorName: string;
  date: string;
  time: string;
  location: string;
  substation: string;
  panelId: string;
  operationType: "Operation" | "Safety Document";
  operations: string[];
  additionalNotes: string;
  attachedImage?: string | null;
  status: "requested" | "issued" | "received" | "completed" | "acknowledged";
  timestamps: {
    requested?: string;
    issued?: string;
    received?: string;
    completed?: string;
    acknowledged?: string;
  };
}