import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Trash2 } from "lucide-react";
import { Operation } from "./types/Operation";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import OperationsList from "./OperationsList";

interface OperationFormProps {
  operation: Operation;
  updateOperation: (operationId: string, field: keyof Operation, value: any) => void;
  addOperationLine: (operationId: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

const OperationForm = ({
  operation,
  updateOperation,
  addOperationLine,
  onSubmit,
  disabled
}: OperationFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        updateOperation(operation._id, "attachedImage", file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Job Number</Label>
          <Input value={operation.jobNumber} disabled />
        </div>
        <div>
          <Label>Operator Name</Label>
          <Input value={operation.operatorName} disabled />
        </div>
        <div>
          <Label>Date</Label>
          <Input value={operation.date} disabled />
        </div>
      </div>

      <OperationsList
        operation={operation}
        updateOperation={updateOperation}
        addOperationLine={addOperationLine}
        disabled={disabled}
      />

      <div className="space-y-2">
        <Label>Additional Notes</Label>
        <Textarea
          value={operation.additionalNotes}
          onChange={(e) =>
            updateOperation(operation._id, "additionalNotes", e.target.value)
          }
          disabled={disabled}
          className="min-h-[100px] text-base"
        />
        
        {!disabled && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
                className="w-full"
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Uploaded preview"
                  className="max-w-full h-auto rounded-md"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImagePreview(null);
                    updateOperation(operation._id, "attachedImage", null);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {!disabled && (
        <Button onClick={onSubmit} className="w-full">
          Submit
        </Button>
      )}
    </div>
  );
};

export default OperationForm;