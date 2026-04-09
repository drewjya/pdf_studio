import { PDFDocument, StandardFonts, rgb } from "@cantoo/pdf-lib";
import { readFile, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { NumberingParam } from "../types/rpcType";

export async function bulkAddPageNumbers({
  inputPaths,
  outputDir,
  config,
}: NumberingParam) {
  await Promise.all(
    inputPaths.map(async (path) => {
      const pdfBytes = await readFile(path);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      for (let i = 0; i < totalPages; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const fontSize = config.size;
        const text = `Page ${i + 1} of ${totalPages}`;
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
        const textHeight = helveticaFont.heightAtSize(config.size);
        const marginX = width * (config.offsetX / 100);
        const marginY = height * (config.offsetY / 100);

        const x = width - marginX - textWidth;
        const y = height - marginY - textHeight;

        page.drawText(text, {
          x: x,
          y: y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }

      const outputFileName = basename(path);
      const outputPath = join(outputDir, outputFileName);

      const modifiedPdfBytes = await pdfDoc.save();
      await writeFile(outputPath, modifiedPdfBytes);
    }),
  );
}
