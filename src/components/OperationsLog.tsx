import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download } from "lucide-react";
import { Operation } from "./types/Operation";
import OperationForm from "./OperationForm";
import OperationStatus from "./OperationStatus";
import OperationsTable from "./OperationsTable";
import { convertToCSV } from "./utils/csvExport";
import { useOperations } from "./hooks/useOperations";
import { exportToPDF } from "./utils/pdfExport";

interface OperationsLogProps {
  userRole: "operator" | "control" | null;
  userName: string;
}

const OperationsLog = ({ userRole, userName }: OperationsLogProps) => {
  const {
    operations,
    createNewOperation,
    addOperation,
    updateOperation,
    addOperationLine,
    updateStatus,
    handleSubmit
  } = useOperations(userName);

  const [currentOperation, setCurrentOperation] = useState<Operation | null>(null);

  const createAndSetNewOperation = () => {
    if (userRole !== "operator") {
      return;
    }
    const newOperation = createNewOperation();
    setCurrentOperation(newOperation);
  };

  const submitCurrentOperation = () => {
    if (!currentOperation) return;

    const isValid = handleSubmit(currentOperation);
    if (isValid) {
      addOperation(currentOperation);
      setCurrentOperation(null);
    }
  };

  const getStatusColor = (status: Operation["status"]) => {
    const colors = {
      requested: "bg-warning",
      issued: "bg-blue-500",
      received: "bg-indigo-500",
      completed: "bg-success",
      acknowledged: "bg-gray-500",
    };
    return colors[status];
  };

  const canUpdateStatus = (operation: Operation): false | Operation["status"] => {
    if (!userRole) return false;

    if (userRole === "operator") {
      switch (operation.status) {
        case "issued":
          return "received";
        case "received":
          return "completed";
        default:
          return false;
      }
    }

    if (userRole === "control") {
      switch (operation.status) {
        case "requested":
          return "issued";
        case "completed":
          return "acknowledged";
        default:
          return false;
      }
    }

    return false;
  };

  return (
    <div className="space-y-6">
      {userRole === "operator" && (
        <Button onClick={createAndSetNewOperation} className="mb-4">
          <PlusCircle className="mr-2 h-4 w-4" /> New Operation
        </Button>
      )}

      {currentOperation && userRole === "operator" && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <OperationStatus
            operation={currentOperation}
            canUpdateStatus={canUpdateStatus}
            updateStatus={(id, status) => {
              updateStatus(id, status);
              setCurrentOperation(prev => prev ? { ...prev, status } : null);
            }}
            getStatusColor={getStatusColor}
          />
          <OperationForm
            operation={currentOperation}
            updateOperation={(id, field, value) => {
              updateOperation(id, field, value);
              setCurrentOperation(prev => prev ? { ...prev, [field]: value } : null);
            }}
            addOperationLine={(id) => {
              addOperationLine(id);
              setCurrentOperation(prev => {
                if (!prev) return null;
                return { ...prev, operations: [...prev.operations, ""] };
              });
            }}
            onSubmit={submitCurrentOperation}
            disabled={currentOperation.status !== "requested"}
          />
        </div>
      )}

      

      {operations.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Operations Log</h2>
            <Button onClick={() => exportToPDF(operations)} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export to PDF
            </Button>
          </div>
          
          <OperationsTable 
            operations={operations}
            getStatusColor={getStatusColor}
            canUpdateStatus={canUpdateStatus}
            updateStatus={updateStatus}
          />
        </div>
      )}
    </div>
  );
};

export default OperationsLog;
