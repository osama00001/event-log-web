import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { Operation } from "./types/Operation";

interface OperationsListProps {
  operation: Operation;
  updateOperation: (operationId: string, field: keyof Operation, value: any) => void;
  addOperationLine: (operationId: string) => void;
  disabled: boolean;
}

const OperationsList = ({
  operation,
  updateOperation,
  addOperationLine,
  disabled
}: OperationsListProps) => {
  const removeOperation = (index: number) => {
    if (operation.operations.length <= 1) return;
    const newOperations = operation.operations.filter((_, i) => i !== index);
    updateOperation(operation._id, "operations", newOperations);
  };

  return (
    <div className="space-y-4">
      {operation.operations.map((op, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="flex-none w-8 text-gray-500 flex items-center justify-center">
              {index + 1}.
            </div>
            <Input
              value={operation.location}
              onChange={(e) =>
                updateOperation(operation._id, "location", e.target.value)
              }
              disabled={disabled}
              placeholder="Location"
              className="min-h-[45px] text-base"
            />
          </div>
          <Input
            value={operation.substation}
            onChange={(e) =>
              updateOperation(operation._id, "substation", e.target.value)
            }
            disabled={disabled}
            placeholder="Substation"
            className="min-h-[45px] text-base"
          />
          <Input
            value={operation.panelId}
            onChange={(e) =>
              updateOperation(operation._id, "panelId", e.target.value)
            }
            disabled={disabled}
            placeholder="Panel ID"
            className="min-h-[45px] text-base"
          />
          <div className="flex gap-2">
            <Input
              value={op}
              onChange={(e) =>
                updateOperation(operation._id, "operations", [
                  ...operation.operations.slice(0, index),
                  e.target.value,
                  ...operation.operations.slice(index + 1),
                ])
              }
              disabled={disabled}
              placeholder="Operation/Safety Document"
              className="min-h-[45px] text-base"
            />
            {!disabled && operation.operations.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeOperation(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
      {!disabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => addOperationLine(operation._id)}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default OperationsList;
