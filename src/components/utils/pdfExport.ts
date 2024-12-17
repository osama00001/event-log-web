import { Operation } from "../types/Operation";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}
export const exportToPDF = (operations: Operation[], single?: Operation) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a3',
  });

  doc.setFontSize(24);
  doc.setTextColor(0, 166, 81);
  doc.text('EDSP Solutions Operations Log', 14, 20);

  const operationsToExport = single ? [single] : operations;

  let currentY = 30; // Start position below the header
  const imageWidth = 50; // Set consistent image width
  const imageHeight = 35; // Set consistent image height

  operationsToExport.forEach((op) => {
    // Table for the current operation
    const rows = [[
      op.jobNumber,
      op.date,
      op.time,
      op.operatorName,
      op.operationType,
      op.location,
      op.substation,
      op.panelId,
      op.operations.map((o, i) => `${i + 1}. ${o}`).join('\n'),
      op.status.charAt(0).toUpperCase() + op.status.slice(1),
    ]];

    // Add table
    doc.autoTable({
      head: [['Job #', 'Date', 'Time', 'Operator', 'Type', 'Location', 'Substation', 'Panel ID', 'Operations', 'Status']],
      body: rows,
      startY: currentY,
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: [0, 166, 81],
        lineWidth: 0.1,
        overflow: 'linebreak',
        cellWidth: 'wrap',
        minCellHeight: 20,
      },
      headStyles: {
        fillColor: [0, 166, 81],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        minCellHeight: 20,
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Job #
        1: { cellWidth: 25 }, // Date
        2: { cellWidth: 20 }, // Time
        3: { cellWidth: 30 }, // Operator
        4: { cellWidth: 30 }, // Type
        5: { cellWidth: 35 }, // Location
        6: { cellWidth: 35 }, // Substation
        7: { cellWidth: 25 }, // Panel ID
        8: { cellWidth: 80 }, // Operations
        9: { cellWidth: 25 }, // Status
      },
    });

    // Get final Y position after the table
    const finalY = doc.lastAutoTable.finalY + 10;

    // Add the image (with uniform size) below the table
    if (op.attachedImage) {
      doc.addImage(op.attachedImage, 'JPEG', 14, finalY, imageWidth, imageHeight);

      // Add a clickable link on the image
      doc.link(14, finalY, imageWidth, imageHeight, { url: op.attachedImage });
    }

    // Update currentY for the next operation
    currentY = finalY + imageHeight + 10;
  });

  // Save the PDF
  doc.save('operations-log.pdf');
};


// export const exportToPDF = (operations: Operation[], single?: Operation) => {
//   // Create PDF in landscape mode with larger page size
//   const doc = new jsPDF({
//     orientation: 'landscape',
//     unit: 'mm',
//     format: 'a3' // Changed to A3 for more space
//   });
  
//   // Add header with styling
//   doc.setFontSize(24);
//   doc.setTextColor(0, 166, 81); // EDSP Green
//   doc.text("EDSP Solutions Operations Log", 14, 20);
  
//   doc.setFontSize(12);
//   doc.setTextColor(0, 0, 0);

//   const operationsToExport = single ? [single] : operations;
  
//   const rows = operationsToExport.map(op => [
//     op.jobNumber,
//     op.date,
//     op.time,
//     op.operatorName,
//     op.operationType,
//     op.location,
//     op.substation,
//     op.panelId,
//     op.operations.map((o, i) => `${i + 1}. ${o}`).join('\n'),
//     op.status.charAt(0).toUpperCase() + op.status.slice(1),
//   ]);

//   doc.autoTable({
//     head: [['Job #', 'Date', 'Time', 'Operator', 'Type', 'Location', 'Substation', 'Panel ID', 'Operations', 'Status']],
//     body: rows,
//     startY: 30,
//     styles: {
//       fontSize: 9,
//       cellPadding: 4,
//       lineColor: [0, 166, 81],
//       lineWidth: 0.1,
//       overflow: 'linebreak',
//       cellWidth: 'wrap',
//       minCellHeight: 20
//     },
//     headStyles: {
//       fillColor: [0, 166, 81],
//       textColor: [255, 255, 255],
//       fontSize: 10,
//       fontStyle: 'bold',
//       halign: 'center',
//       minCellHeight: 20
//     },
//     columnStyles: {
//       0: { cellWidth: 20 }, // Job #
//       1: { cellWidth: 25 }, // Date
//       2: { cellWidth: 20 }, // Time
//       3: { cellWidth: 30 }, // Operator
//       4: { cellWidth: 30 }, // Type
//       5: { cellWidth: 35 }, // Location
//       6: { cellWidth: 30 }, // Substation
//       7: { cellWidth: 25 }, // Panel ID
//       8: { cellWidth: 80 }, // Operations
//       9: { cellWidth: 25 }, // Status
//     },
//     alternateRowStyles: {
//       fillColor: [245, 245, 245],
//     },
//     margin: { top: 30, right: 15, bottom: 20, left: 15 },
//     didDrawPage: (data) => {
//       // Add footer with timestamp
//       doc.setFontSize(8);
//       doc.setTextColor(128, 128, 128);
//       doc.text(
//         `Generated on ${new Date().toLocaleString()}`,
//         14,
//         doc.internal.pageSize.height - 10
//       );
//     },
//   });

//   // Save the PDF
//   if (single) {
//     doc.save(`operation_${single.jobNumber}.pdf`);
//   } else {
//     doc.save(`operations_log_${new Date().toISOString().split('T')[0]}.pdf`);
//   }
// };