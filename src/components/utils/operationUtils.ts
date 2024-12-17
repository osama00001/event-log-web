import { Operation } from "../types/Operation";

export const getNextJobNumber = (operations: Operation[]) => {
  const numbers = operations.map(op => {
    const match = op.jobNumber.match(/EDSP-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });
  const maxNumber = Math.max(0, ...numbers);
  return `EDSP-${maxNumber + 1}`;
};

export const createNewOperation = (userName: string): Operation => {
  return {
    id: Date.now().toString(),
    jobNumber: "EDSP-1", // This will be updated with the correct number when added
    operatorName: userName,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0],
    location: "",
    substation: "",
    panelId: "",
    operationType: "Operation",
    operations: [""],
    additionalNotes: "",
    status: "requested",
    timestamps: {
      requested: new Date().toISOString(),
    },
  };
};

export const validateOperation = (operation: Operation): boolean => {
  return !(!operation.location || 
    !operation.substation || 
    !operation.panelId || 
    operation.operations.some(op => !op));
};