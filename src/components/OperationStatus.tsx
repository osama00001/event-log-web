import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Operation } from "./types/Operation";

interface OperationStatusProps {
  operation: Operation;
  canUpdateStatus: (operation: Operation) => false | Operation["status"];
  updateStatus: (operationId: string, newStatus: Operation["status"]) => void;
  getStatusColor: (status: Operation["status"]) => string;
}

const OperationStatus = ({
  operation,
  canUpdateStatus,
  updateStatus,
  getStatusColor,
}: OperationStatusProps) => {
  const allStatuses: Operation["status"][] = [
    "requested",
    "issued",
    "received",
    "completed",
    "acknowledged",
  ];

  const currentStatusIndex = allStatuses.indexOf(operation.status);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div
            className={`${getStatusColor(
              operation.status
            )} text-white px-3 py-1 rounded-full text-sm`}
          >
            {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
          </div>
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">
            {new Date(operation.timestamps[operation.status] || "").toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto py-2">
        {allStatuses.map((status, index) => (
          <div key={status} className="flex items-center min-w-fit">
            <div
              className={`px-3 py-1 rounded-full text-sm ${
                index <= currentStatusIndex
                  ? getStatusColor(status)
                  : "bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
            {index < allStatuses.length - 1 && (
              <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {canUpdateStatus(operation) && (
        <Button
          onClick={() =>
            updateStatus(operation._id, canUpdateStatus(operation) as Operation["status"])
          }
          className="w-full"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Update to {canUpdateStatus(operation)}
        </Button>
      )}
    </div>
  );
};

export default OperationStatus;