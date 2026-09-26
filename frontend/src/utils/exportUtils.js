import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Formato de moneda COP
const formatCOP = (val) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(val || 0);
};

/**
 * Exportar datos a Excel (.xlsx) con soporte multi-hoja
 * @param {Array<{ sheetName: string, data: Array<object> }>} sheets
 * @param {string} fileName
 */
export const exportToExcel = (sheets, fileName = 'Reporte_Steel_House') => {
  try {
    const workbook = XLSX.utils.book_new();

    sheets.forEach(({ sheetName, data }) => {
      if (!Array.isArray(data) || data.length === 0) return;

      const worksheet = XLSX.utils.json_to_sheet(data);

      // Auto-ajustar ancho de columnas
      const colWidths = Object.keys(data[0] || {}).map((key) => {
        const maxLen = Math.max(
          key.length,
          ...data.map((row) => (row[key] !== undefined && row[key] !== null ? String(row[key]).length : 0))
        );
        return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
      });
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31));
    });

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error al generar Excel:', error);
    throw error;
  }
};

/**
 * Exportar reporte a PDF con diseño profesional de Steel House
 * @param {object} options
 */
export const exportToPdf = ({
  title = 'REPORTE GENERAL DE NÓMINA Y SERVICIOS',
  subtitle = 'Steel House Barbería · Control Contable',
  periodLabel = 'Este Mes',
  summary = {},
  tables = [],
  fileName = 'Reporte_Nomina_Steel_House',
}) => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Encabezado con banner oscuro y acento dorado
    doc.setFillColor(17, 17, 17);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setFillColor(212, 175, 55); // #d4af37
    doc.rect(0, 28, pageWidth, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title, 14, 12);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(212, 175, 55);
    doc.text(subtitle, 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text(
      `Período: ${periodLabel} | Generado el: ${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO')}`,
      14,
      24
    );

    let startY = 36;

    // Resumen Contable en Cajas
    if (summary && Object.keys(summary).length > 0) {
      const cards = [
        { label: 'Ingresos Totales', val: formatCOP(summary.grossRevenue), color: [34, 197, 94] },
        { label: 'Nómina Barberos', val: formatCOP(summary.totalBarbersPayout), color: [212, 175, 55] },
        { label: 'Ganancia Neta', val: formatCOP(summary.netBarbershopEarnings), color: [59, 130, 246] },
        { label: 'Nómina Pagada', val: formatCOP(summary.totalPaidPayout), color: [16, 185, 129] },
        { label: 'Nómina Pendiente', val: formatCOP(summary.totalPendingPayout), color: [239, 68, 68] },
        { label: 'Cortes Realizados', val: String(summary.completedCuts || 0), color: [255, 255, 255] },
      ];

      const cardWidth = (pageWidth - 28 - 10) / cards.length;
      cards.forEach((c, idx) => {
        const x = 14 + idx * (cardWidth + 2);
        doc.setFillColor(24, 24, 24);
        doc.roundedRect(x, startY, cardWidth, 16, 2, 2, 'F');
        doc.setDrawColor(50, 50, 50);
        doc.roundedRect(x, startY, cardWidth, 16, 2, 2, 'S');

        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(160, 160, 160);
        doc.text(c.label.toUpperCase(), x + 3, startY + 5);

        doc.setFontSize(9);
        doc.setTextColor(c.color[0], c.color[1], c.color[2]);
        doc.text(c.val, x + 3, startY + 12);
      });

      startY += 22;
    }

    // Dibujar cada tabla proporcionada
    tables.forEach((table) => {
      if (!table.columns || !table.rows || table.rows.length === 0) return;

      if (table.title) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(212, 175, 55);
        doc.text(table.title.toUpperCase(), 14, startY);
        startY += 4;
      }

      autoTable(doc, {
        startY,
        head: [table.columns],
        body: table.rows,
        theme: 'grid',
        headStyles: {
          fillColor: [30, 30, 30],
          textColor: [212, 175, 55],
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [40, 40, 40],
          cellPadding: 2,
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        styles: {
          overflow: 'linebreak',
        },
        margin: { left: 14, right: 14 },
      });

      startY = doc.lastAutoTable.finalY + 10;
      if (startY > doc.internal.pageSize.getHeight() - 25) {
        doc.addPage();
        startY = 20;
      }
    });

    // Pie de página en todas las hojas
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(
        `Steel House Barbería · Sistema de Gestión y Nómina · Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'center' }
      );
    }

    doc.save(`${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw error;
  }
};
