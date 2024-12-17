import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download } from "lucide-react";
import { Operation } from "./types/Operation";
import { exportToPDF } from "./utils/pdfExport";
import { Link } from "react-router-dom";

interface OperationsTableProps {
  operations: Operation[];
  getStatusColor: (status: Operation["status"]) => string;
  canUpdateStatus: (operation: Operation) => false | Operation["status"];
  updateStatus: (operationId: string, newStatus: Operation["status"]) => void;
}

const OperationsTable = ({ 
  operations,
  getStatusColor,
  canUpdateStatus,
  updateStatus
}: OperationsTableProps) => {
  const handleExportPDF = (operation?: Operation) => {
  
    exportToPDF(operations, operation);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job #</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Operator</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Substation</TableHead>
          <TableHead>Panel ID</TableHead>
          <TableHead>Operations/Images</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {operations.map((operation) => (
          <TableRow key={operation._id}>
            <TableCell>{operation.jobNumber}</TableCell>
            <TableCell>{operation.date}</TableCell>
            <TableCell>{operation.time}</TableCell>
            <TableCell>{operation.operatorName}</TableCell>
            <TableCell>{operation.operationType}</TableCell>
            <TableCell>{operation.location}</TableCell>
            <TableCell>{operation.substation}</TableCell>
            <TableCell>{operation.panelId}</TableCell>
            <TableCell>
              <>
             {operation.attachedImage?<Link to ={operation.attachedImage}><img width={90} height={90} src={operation.attachedImage}></img><br></br></Link>:""} 
              {operation.operations.map((op, index) => (
                <div key={index}>{index + 1}. {op}</div>
              ))}
              </>
            </TableCell>
            <TableCell>
              <span
                className={`${getStatusColor(
                  operation.status
                )} text-white px-2 py-1 rounded-full text-sm`}
              >
                {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {canUpdateStatus(operation) && (
                  <Button
                    size="sm"
                    onClick={() => {
                      updateStatus(operation._id, canUpdateStatus(operation) as Operation["status"])}}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {canUpdateStatus(operation)}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExportPDF(operation)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OperationsTable;