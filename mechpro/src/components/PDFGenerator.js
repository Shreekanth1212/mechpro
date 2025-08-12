import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PDFGenerator({ project }) {
  const generatePdf = async () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(18);
    doc.text(`Project: ${project.name}`, 40, 40);

    let startY = 60;

    const tableRows = [];
    let counter = 1;

    // ✅ Map to keep track: subfieldId → counter
    const subfieldNumbers = new Map();

    for (const field of project.fields) {
      for (const subfield of field.subfields) {
        tableRows.push([
          counter,
          field.name,
          subfield.name,
          subfield.description || '-',
          subfield.agentStatus || '-',
          subfield.agentComment || '-'
        ]);
        // Use composite key to map counter number
        subfieldNumbers.set(`${field.name}|||${subfield.name}`, counter);
        counter++;
      }
    }

    autoTable(doc, {
      head: [['No.', 'Field', 'Subfield', 'Description', 'Status', 'Comment']],
      body: tableRows,
      startY: startY,
      styles: { fontSize: 10, cellWidth: 'wrap' },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 70 },
        2: { cellWidth: 70 },
        3: { cellWidth: 150 },
        4: { cellWidth: 70 },
        5: { cellWidth: 100 },
      },
      headStyles: { fillColor: [108, 99, 255] },
    });

    let currentY = doc.lastAutoTable.finalY + 20;
    const pageHeight = doc.internal.pageSize.height;

    for (const field of project.fields) {
      for (const subfield of field.subfields) {
        const key = `${field.name}|||${subfield.name}`;
        const subfieldNo = subfieldNumbers.get(key);

        doc.setFontSize(12);
        doc.text(`Images for No. ${subfieldNo} | Field: ${field.name} | Subfield: ${subfield.name}`, 40, currentY);
        currentY += 15;

        const imgWidth = 140;
        const imgHeight = 140;
        const marginX = 50;
        const gapX = 30;

        const maxImages = Math.max(
          subfield.images ? subfield.images.length : 0,
          subfield.agentImages ? subfield.agentImages.length : 0
        );

        for (let i = 0; i < maxImages; i++) {
          if (currentY + imgHeight + 30 > pageHeight) {
            doc.addPage();
            currentY = 40;
          }

          const originalImg = subfield.images?.[i];
          const agentImg = subfield.agentImages?.[i];

          if (originalImg) {
            try {
              doc.addImage(originalImg, 'JPEG', marginX, currentY, imgWidth, imgHeight);
            } catch (e) {
              console.error('Failed to add original image:', e);
            }
          }

          if (agentImg) {
            try {
              doc.addImage(agentImg, 'JPEG', marginX + imgWidth + gapX, currentY, imgWidth, imgHeight);
            } catch (e) {
              console.error('Failed to add agent image:', e);
            }
          }

          currentY += imgHeight + 20;
        }

        currentY += 20;

        if (currentY > pageHeight - 100) {
          doc.addPage();
          currentY = 40;
        }
      }
    }

    doc.save(`${project.name}-report.pdf`);
  };

  return (
    <button onClick={generatePdf} className="pdf-button">
      Generate PDF
    </button>
  );
}
