import { RPCSchema } from "electrobun";
import { WmConfig, NumConfig } from "../store/useAppStore";

export type WatermarkParam = {
  inputPaths: string[];
  outputDir: string;
  config: WmConfig;
};

export type MergeParam = { inputPaths: string[]; outputPath: string };

export type NumberingParam = {
  inputPaths: string[];
  outputDir: string;
  config: NumConfig;
};

export type PdfRPC = {
  bun: RPCSchema<{
    requests: {
      selectPdfs: {
        params: void;
        response: string[];
      };
      addWatermark: {
        params: WatermarkParam;
        response: void;
      };
      mergePdf: {
        params: MergeParam;
        response: void;
      };
      pageNumbering: {
        params: NumberingParam;
        response: void;
      };
    };
    messages: {};
  }>;
  webview: RPCSchema<{
    requests: {};
    messages: {};
  }>;
};
