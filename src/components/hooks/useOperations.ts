import { useEffect, useState } from "react";
import { Operation } from "../types/Operation";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOperations, createOperation, updateOperationStatus } from "@/api/operations";
import {useAuth} from "@/components/hooks/userAuth"
export const useOperations = (userName: string) => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [update,setupdate]= useState(false)
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {auth} = useAuth()
  let {user} = auth
  let userToken =auth.accessToken
  

  // Fetch operations
  const { data: fetchedOperations } = useQuery({
    queryKey: ['operations'],
    queryFn: () => fetchOperations(userToken || ''),
    enabled: !!userToken,
  });
  
  useEffect(() => {
    if (fetchedOperations) {
      setOperations(fetchedOperations.operations);
    }
  }, [fetchedOperations,update]);
  // Create operation mutation
  const createMutation = useMutation({
    mutationFn: (newOperation: Operation) => createOperation(newOperation, userToken || ''),
    onSuccess: (data) => {
     
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      toast({
        title: "Operation Created",
        description: "New operation has been created successfully",
      });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ operationId, status }: { operationId: string; status: string }) =>
      updateOperationStatus(operationId, status, userToken || ''),
    onError:(error)=>{
     console.warn(error)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      toast({
        title: "Status Updated",
        description: "Operation status has been updated successfully",
      });
    },
  });

  const createNewOperation = (): Operation => ({
    _id: Date.now().toString(),
    jobNumber: `EDSP-${operations.length + 1}`,
    operatorName: user?.userName||user?.email,
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
  });

  const addOperation = (operation: Operation) => {
    createMutation.mutate(operation);
  };

  const updateOperation = (operationId: string, field: keyof Operation, value: any) => {
    console.log("Updating operation:", operationId, field, value);
    setOperations(prev =>
      prev.map(op =>
        op._id === operationId ? { ...op, [field]: value } : op
      )
    );
  };

  const addOperationLine = (operationId: string) => {
    console.log("Adding operation line to:", operationId);
    setOperations(prev =>
      prev.map(op =>
        op._id === operationId
          ? { ...op, operations: [...op.operations, ""] }
          : op
      )
    );
  };

  const updateStatus = (operationId: string, status: Operation["status"]) => {
    updateStatusMutation.mutate({ operationId, status });
  };

  const handleSubmit = (operation: Operation): boolean => {
    if (!operation.location || !operation.substation || !operation.panelId || operation.operations.some(op => !op)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return {
    operations,
    createNewOperation,
    addOperation,
    updateOperation,
    addOperationLine,
    updateStatus,
    handleSubmit
  };
};
