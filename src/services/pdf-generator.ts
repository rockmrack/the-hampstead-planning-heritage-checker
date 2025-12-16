/**
 * PDF Report Generator Service
 * Generates branded PDF reports for property checks
 * 
 * Performance: jsPDF is dynamically imported to prevent loading on initial page render
 */

import { format } from 'date-fns';
import type { jsPDF as JsPDFType } from 'jspdf';

// Dynamic import for jsPDF - only loaded when generating PDFs
const loadJsPDF = async (): Promise<typeof import('jspdf')> => {
  return import('jspdf');
};

import { COMPANY_INFO, PDF_CONFIG, STATUS_CONFIG, LISTED_GRADES } from '@/lib/config';
import { getExpertOpinion } from '@/services/property-check';
import type { PropertyCheckResult, PDFReportData, PDFGenerationOptions } from '@/types';

/**
 * Generate a PDF report for a property check result
 */
export async function generatePropertyReport(
  data: PDFReportData,
  options: PDFGenerationOptions = { includeMap: true, includeExpertOpinion: true }
): Promise<Blob> {
  // Dynamic import - jsPDF is only loaded when this function is called
  const { default: jsPDF } = await loadJsPDF();
  
  const { propertyResult, userEmail, generatedAt, mapSnapshot } = data;
  const doc = new jsPDF('p', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();
  const margins = PDF_CONFIG.margins;
  const contentWidth = pageWidth - margins.left - margins.right;

  let yPosition = margins.top;

  // ===== HEADER =====
  yPosition = addHeader(doc, yPosition, contentWidth, margins);

  // ===== STATUS BADGE =====
  yPosition = addStatusBadge(doc, propertyResult, yPosition, margins);

  // ===== PROPERTY DETAILS =====
  yPosition = addPropertyDetails(doc, propertyResult, yPosition, margins, contentWidth);

  // ===== MAP SNAPSHOT =====
  if (options.includeMap && mapSnapshot) {
    yPosition = addMapSnapshot(doc, mapSnapshot, yPosition, margins, contentWidth);
  }

  // ===== DETAILED FINDINGS =====
  yPosition = addDetailedFindings(doc, propertyResult, yPosition, margins, contentWidth);

  // ===== EXPERT OPINION =====
  if (options.includeExpertOpinion) {
    yPosition = addExpertOpinion(doc, propertyResult, yPosition, margins, contentWidth);
  }

  // ===== CALL TO ACTION =====
  yPosition = addCallToAction(doc, propertyResult, yPosition, margins, contentWidth);

  // ===== FOOTER =====
  addFooter(doc, userEmail, generatedAt);

  // Return as blob
  return doc.output('blob');
}

/**
 * Add header with company branding
 */
function addHeader(
  doc: JsPDFType,
  y: number,
  contentWidth: number,
  margins: typeof PDF_CONFIG.margins
): number {
  const primaryColor = PDF_CONFIG.colors.primary;
  const accentColor = PDF_CONFIG.colors.accent;

  // Company name
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('HAMPSTEAD RENOVATIONS', margins.left, y);
  
  y += 8;

  // Tagline
  doc.setFontSize(10);
  doc.setTextColor(accentColor);
  doc.setFont('helvetica', 'normal');
  doc.text(COMPANY_INFO.subtitle, margins.left, y);
  
  y += 5;

  // Divider line
  doc.setDrawColor(accentColor);
  doc.setLineWidth(0.5);
  doc.line(margins.left, y, margins.left + contentWidth, y);

  y += 10;

  // Report title
  doc.setFontSize(18);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Heritage & Planning Status Report', margins.left, y);

  return y + 15;
}

/**
 * Add status badge
 */
function addStatusBadge(
  doc: JsPDFType,
  result: PropertyCheckResult,
  y: number,
  margins: typeof PDF_CONFIG.margins
): number {
  const config = STATUS_CONFIG[result.status];

  // Status box
  const boxWidth = 80;
  const boxHeight = 25;
  
  // Set fill color based on status
  if (result.status === 'RED') {
    doc.setFillColor(254, 226, 226); // Red background
    doc.setDrawColor(220, 38, 38);
  } else if (result.status === 'AMBER') {
    doc.setFillColor(254, 243, 199); // Amber background
    doc.setDrawColor(245, 158, 11);
  } else {
    doc.setFillColor(220, 252, 231); // Green background
    doc.setDrawColor(22, 163, 74);
  }

  doc.setLineWidth(1);
  doc.roundedRect(margins.left, y, boxWidth, boxHeight, 3, 3, 'FD');

  // Status icon and text
  doc.setFontSize(20);
  doc.text(config.icon, margins.left + 8, y + 16);
  
  doc.setFontSize(12);
  doc.setTextColor(PDF_CONFIG.colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(config.label, margins.left + 22, y + 16);

  return y + boxHeight + 10;
}

/**
 * Add property details section
 */
function addPropertyDetails(
  doc: JsPDFType,
  result: PropertyCheckResult,
  y: number,
  margins: typeof PDF_CONFIG.margins,
  contentWidth: number
): number {
  doc.setFontSize(14);
  doc.setTextColor(PDF_CONFIG.colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Property Details', margins.left, y);

  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(PDF_CONFIG.colors.text);

  const details = [
    ['Address:', result.address],
    ['Postcode:', result.postcode || 'N/A'],
    ['Borough:', result.borough || 'N/A'],
    ['Coordinates:', `${result.coordinates.latitude.toFixed(6)}, ${result.coordinates.longitude.toFixed(6)}`],
    ['Report Generated:', format(new Date(result.timestamp), 'dd MMMM yyyy, HH:mm')],
  ];

  for (const [label, value] of details) {
    doc.setFont('helvetica', 'bold');
    doc.text(label ?? '', margins.left, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value ?? '', margins.left + 40, y);
    y += 6;
  }

  return y + 10;
}

/**
 * Add map snapshot
 */
function addMapSnapshot(
  doc: JsPDFType,
  mapSnapshot: string,
  y: number,
  margins: typeof PDF_CONFIG.margins,
  contentWidth: number
): number {
  doc.setFontSize(14);
  doc.setTextColor(PDF_CONFIG.colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Location Map', margins.left, y);

  y += 5;

  try {
    const mapWidth = contentWidth;
    const mapHeight = 60;
    doc.addImage(mapSnapshot, 'PNG', margins.left, y, mapWidth, mapHeight);
    y += mapHeight;
  } catch {
    doc.setFontSize(10);
    doc.setTextColor(PDF_CONFIG.colors.muted);
    doc.text('Map image not available', margins.left, y + 10);
    y += 20;
  }

  return y + 10;
}

/**
 * Add detailed findings section
 */
function addDetailedFindings(
  doc: JsPDFType,
  result: PropertyCheckResult,
  y: number,
  margins: typeof PDF_CONFIG.margins,
  contentWidth: number
): number {
  doc.setFontSize(14);
  doc.setTextColor(PDF_CONFIG.colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Findings', margins.left, y);

  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(PDF_CONFIG.colors.text);

  // Listed Building info
  if (result.status === 'RED' && result.listedBuilding) {
    const building = result.listedBuilding;
    const gradeInfo = LISTED_GRADES[building.grade];

    doc.setFont('helvetica', 'bold');
    doc.text('Listed Building Status:', margins.left, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    const listedDetails = [
      `• Grade: ${gradeInfo.label} - ${gradeInfo.description}`,
      `• Name: ${building.name}`,
      `• List Entry: ${building.listEntryNumber}`,
    ];

    for (const detail of listedDetails) {
      const lines = doc.splitTextToSize(detail, contentWidth);
      doc.text(lines, margins.left, y);
      y += lines.length * 5;
    }

    if (building.hyperlink) {
      doc.setTextColor(0, 0, 255);
      doc.text('View on Historic England website', margins.left, y);
      doc.link(margins.left, y - 3, 60, 5, { url: building.hyperlink });
      doc.setTextColor(PDF_CONFIG.colors.text);
      y += 6;
    }
  }

  // Conservation Area info
  if (result.conservationArea) {
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Conservation Area:', margins.left, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.text(`• Name: ${result.conservationArea.name}`, margins.left, y);
    y += 5;
    doc.text(`• Borough: ${result.conservationArea.borough}`, margins.left, y);
    y += 5;

    if (result.hasArticle4) {
      doc.setTextColor(220, 38, 38);
      doc.text('• Article 4 Direction: YES', margins.left, y);
      y += 5;
      if (result.article4Details) {
        const lines = doc.splitTextToSize(`  ${result.article4Details}`, contentWidth - 10);
        doc.text(lines, margins.left + 5, y);
        y += lines.length * 5;
      }
      doc.setTextColor(PDF_CONFIG.colors.text);
    } else {
      doc.text('• Article 4 Direction: No', margins.left, y);
      y += 5;
    }
  }

  // Standard zone info
  if (result.status === 'GREEN') {
    doc.text('This property is not located within a Conservation Area and is not a Listed Building.', margins.left, y);
    y += 6;
    doc.text('Standard Permitted Development rights apply.', margins.left, y);
    y += 5;
  }

  return y + 10;
}

/**
 * Add expert opinion section
 */
function addExpertOpinion(
  doc: JsPDFType,
  result: PropertyCheckResult,
  y: number,
  margins: typeof PDF_CONFIG.margins,
  contentWidth: number
): number {
  // Check if we need a new page
  if (y > 230) {
    doc.addPage();
    y = margins.top;
  }

  doc.setFontSize(14);
  doc.setTextColor(PDF_CONFIG.colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Expert Assessment', margins.left, y);

  y += 8;

  const opinion = getExpertOpinion(result);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(PDF_CONFIG.colors.text);

  const lines = doc.splitTextToSize(opinion, contentWidth);
  doc.text(lines, margins.left, y);
  y += lines.length * 5;

  return y + 10;
}

/**
 * Add call to action section
 */
function addCallToAction(
  doc: JsPDFType,
  result: PropertyCheckResult,
  y: number,
  margins: typeof PDF_CONFIG.margins,
  contentWidth: number
): number {
  // Check if we need a new page
  if (y > 240) {
    doc.addPage();
    y = margins.top;
  }

  // CTA Box
  doc.setFillColor(15, 23, 42); // Brand navy
  doc.roundedRect(margins.left, y, contentWidth, 40, 3, 3, 'F');

  y += 12;

  doc.setFontSize(14);
  doc.setTextColor(212, 175, 55); // Brand gold
  doc.setFont('helvetica', 'bold');
  doc.text('Ready to Start Your Project?', margins.left + 10, y);

  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text('Hampstead Renovations has successfully completed multiple projects in this area.', margins.left + 10, y);

  y += 6;

  doc.text(`Call us: ${COMPANY_INFO.contact.phone}`, margins.left + 10, y);
  doc.text(`Email: ${COMPANY_INFO.contact.email}`, margins.left + 80, y);

  return y + 25;
}

/**
 * Add footer
 */
function addFooter(
  doc: JsPDFType,
  userEmail: string,
  generatedAt: string
): void {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const y = pageHeight - 15;

  doc.setFontSize(8);
  doc.setTextColor(PDF_CONFIG.colors.muted);
  doc.setFont('helvetica', 'normal');

  // Left side
  doc.text(`Report generated for: ${userEmail}`, 20, y);

  // Center
  const centerText = COMPANY_INFO.address.full;
  const centerWidth = doc.getTextWidth(centerText);
  doc.text(centerText, (pageWidth - centerWidth) / 2, y);

  // Right side
  const dateText = format(new Date(generatedAt), 'dd/MM/yyyy HH:mm');
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, pageWidth - 20 - dateWidth, y);

  // Legal disclaimer
  const disclaimer = 'This report is for informational purposes only and does not constitute legal advice. Always consult with the local planning authority.';
  doc.setFontSize(7);
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
  doc.text(disclaimerLines, 20, y + 5);
}

/**
 * Download PDF in browser
 */
export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename for PDF
 */
export function generatePDFFilename(result: PropertyCheckResult): string {
  const sanitizedAddress = result.address
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
  const date = format(new Date(), 'yyyy-MM-dd');
  return `heritage-report-${sanitizedAddress}-${date}.pdf`;
}

export default {
  generatePropertyReport,
  downloadPDF,
  generatePDFFilename,
};
