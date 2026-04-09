import { RPCSchema } from "electrobun";

export const position = [
  "center",
  "top-center",
  "bottom-center",
  "diagonal",
] as const;
export type positionType = (typeof position)[number];
export type WmConfig = {
  text: string;
  pos: positionType;
  color: string;
  size: number;
  opacity: number;
  rotation: number;
};

export type NumConfig = {
  offsetX: number;
  offsetY: number;
  size: number;
  color: string;
};

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
