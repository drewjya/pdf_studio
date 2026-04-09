import { PDFDocument } from "@cantoo/pdf-lib";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { MergeParam } from "../types/rpcType";

export async function mergePdfs({ inputPaths, outputPath }: MergeParam) {
  // 1. Extract the directory path and ensure it exists
  const outputDir = dirname(outputPath);
  await mkdir(outputDir, { recursive: true });

  // Create a new blank document
  const mergedPdf = await PDFDocument.create();

  for (const path of inputPaths) {
    // Load the existing PDF
    const pdfBytes = await readFile(path);
    const pdf = await PDFDocument.load(pdfBytes);

    // Get all page indices
    const pageIndices = pdf.getPageIndices();

    // Copy all pages from the current PDF into the new one
    const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);

    // Add each copied page to the merged document
    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
  }

  // Save and write the final document
  const mergedPdfBytes = await mergedPdf.save();
  await writeFile(outputPath, mergedPdfBytes);
}
