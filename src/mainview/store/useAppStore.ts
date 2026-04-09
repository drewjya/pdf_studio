import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface PdfStudioState {
  // Files (Transient) - Now storing absolute OS paths instead of HTML File objects
  mergeFiles: string[];
  watermarkFiles: string[];
  numberingFiles: string[];

  // Configurations (Persisted)
  wmConfig: WmConfig;
  numConfig: NumConfig;

  // Actions
  setMergeFiles: (paths: string[] | ((prev: string[]) => string[])) => void;
  setWatermarkFiles: (paths: string[] | ((prev: string[]) => string[])) => void;
  setNumberingFiles: (paths: string[] | ((prev: string[]) => string[])) => void;
  updateWmConfig: (config: Partial<WmConfig>) => void;
  updateNumConfig: (config: Partial<NumConfig>) => void;
  moveMergeFile: (index: number, direction: "up" | "down") => void;
  removeMergeFile: (index: number) => void;
}

export const useAppStore = create<PdfStudioState>()(
  persist(
    (set) => ({
      mergeFiles: [],
      watermarkFiles: [],
      numberingFiles: [],

      wmConfig: {
        text: "CONFIDENTIAL",
        pos: "center",
        color: "#000000",
        size: 60,
        opacity: 30,
        rotation: 45,
      },
      numConfig: {
        offsetX: 5,
        offsetY: 5,
        size: 12,
        color: "#000000",
        format: "{page} of {total}",
      },

      setMergeFiles: (updater) =>
        set((state) => ({
          mergeFiles:
            typeof updater === "function" ? updater(state.mergeFiles) : updater,
        })),

      // Updated these to also accept functional updates (useful for appending new selections)
      setWatermarkFiles: (updater) =>
        set((state) => ({
          watermarkFiles:
            typeof updater === "function"
              ? updater(state.watermarkFiles)
              : updater,
        })),

      setNumberingFiles: (updater) =>
        set((state) => ({
          numberingFiles:
            typeof updater === "function"
              ? updater(state.numberingFiles)
              : updater,
        })),

      updateWmConfig: (config) =>
        set((state) => ({ wmConfig: { ...state.wmConfig, ...config } })),
      updateNumConfig: (config) =>
        set((state) => ({ numConfig: { ...state.numConfig, ...config } })),

      moveMergeFile: (index, direction) =>
        set((state) => {
          const files = [...state.mergeFiles];
          if (direction === "up" && index > 0) {
            [files[index], files[index - 1]] = [files[index - 1], files[index]];
          } else if (direction === "down" && index < files.length - 1) {
            [files[index], files[index + 1]] = [files[index + 1], files[index]];
          }
          return { mergeFiles: files };
        }),

      removeMergeFile: (index) =>
        set((state) => ({
          mergeFiles: state.mergeFiles.filter((_, i) => i !== index),
        })),
    }),
    {
      name: "pdfStudio-storage",
      partialize: (state) => ({
        wmConfig: state.wmConfig,
        numConfig: state.numConfig,
      }), // Only persist configs
    },
  ),
);
