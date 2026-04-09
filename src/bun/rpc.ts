import { BrowserView, Utils } from "electrobun/bun";
import { bulkAddWatermarks } from "./util/addWatermark";
import { mergePdfs } from "./util/mergePdf";
import { bulkAddPageNumbers } from "./util/pageNumbering";
import { PdfRPC } from "./types/rpcType";
import { join } from "path";
import { homedir } from "os";

export const pdfRpc = BrowserView.defineRPC<PdfRPC>({
  maxRequestTime: 10000,
  handlers: {
    requests: {
      selectPdfs: async () => {
        const result = await Utils.openFileDialog({
          startingFolder: join(homedir(), "Desktop"),
          allowedFileTypes: "pdf",
          canChooseFiles: true,
          canChooseDirectory: false,
          allowsMultipleSelection: true,
        });
        return result;
      },
      addWatermark: (param) => bulkAddWatermarks(param),
      mergePdf: (param) => mergePdfs(param),
      pageNumbering: (param) => bulkAddPageNumbers(param),
    },
    messages: {},
  },
});
