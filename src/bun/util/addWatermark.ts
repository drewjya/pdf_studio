import {
  PDFDocument,
  StandardFonts,
  degrees,
  colorString,
} from "@cantoo/pdf-lib";
import { readFile, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { WatermarkParam } from "../types/rpcType";

export async function bulkAddWatermarks({
  inputPaths,
  outputDir,
  config,
}: WatermarkParam) {
  await Promise.all(
    inputPaths.map(async (path) => {
      const pdfBytes = await readFile(path);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Embed the standard Helvetica font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const { text, size, opacity, color, pos, rotation } = config;

      for (const page of pages) {
        const { width, height } = page.getSize();

        const textWidth = helveticaFont.widthOfTextAtSize(text, size);
        const textHeight = helveticaFont.heightAtSize(size);
        let theta = (rotation * Math.PI) / 180;
        let cx, cy;

        // 1. Calculate the desired center point (cx, cy) of the watermark
        switch (pos) {
          case "center":
          case "diagonal":
            // Both 'center' and 'diagonal' share the exact same logic
            cx = width / 2;
            cy = height / 2;
            break;

          case "top-center":
            cx = width / 2;
            cy = height - height * 0.05 - textHeight / 2;
            break;

          case "bottom-center":
            cx = width / 2;
            cy = height * 0.05 + textHeight / 2;
            break;

          default:
            // It's always a good idea to have a fallback just in case 'pos' is undefined
            cx = width / 2;
            cy = height / 2;
            break;
        }

        // 2. Adjust the bottom-left anchor (x,y) so it rotates perfectly around its center
        let x =
          cx -
          (textWidth / 2) * Math.cos(theta) +
          (textHeight / 2) * Math.sin(theta);
        let y =
          cy -
          (textWidth / 2) * Math.sin(theta) -
          (textHeight / 2) * Math.cos(theta);

        // Draw text in the center of the page, rotated 45 degrees
        page.drawText(text, {
          x: x,
          y: y,
          size: size,
          font: helveticaFont,
          color: colorString(color).rgb, // Gray
          opacity: opacity, // 30% transparent
          rotate: degrees(rotation),
        });
      }

      const outputFileName = basename(path);
      const outputPath = join(outputDir, outputFileName);

      const modifiedPdfBytes = await pdfDoc.save();
      await writeFile(outputPath, modifiedPdfBytes);
    }),
  );
}
