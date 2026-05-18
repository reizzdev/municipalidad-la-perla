import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const filePath = path.join(
      process.cwd(),
      "public",
      "plantillas",
      "solicitud-base.pdf"
    );

    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const page = pages[1];

    let y = 620;
    const labelX = 110;
    const valueX = 290;
    const gap = 42;

    const drawLine = (label: string, value: string) => {
      page.drawText(label, {
        x: labelX,
        y,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      page.drawText(value || "", {
        x: valueX,
        y,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      y -= gap;
    };

    drawLine("Área solicitante:", data.area);
    drawLine("Responsable del requerimiento:", data.responsable);
    drawLine("Equipos solicitados:", data.equipos);
    drawLine("Fecha de uso:", data.fecha);
    drawLine("Horas de uso:", data.horas);
    drawLine("Lugar donde se utilizarán:", data.lugar);

    const pdfBytes = await pdfDoc.save();

    return new Response(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="solicitud.pdf"',
      },
    });
  } catch (error) {
    console.error("Error generando PDF completo:", error);

    return new Response(
      error instanceof Error ? error.message : "Error generando PDF",
      { status: 500 }
    );
  }
}