import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { ListOrdered, Copy, Archive, Loader2 } from "lucide-react";
import { electrobun } from "../composables/rpcHandler";

export const NumberingView = () => {
  const { numberingFiles, setNumberingFiles, numConfig, updateNumConfig } =
    useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Native OS File Picker Trigger
  const triggerNativeFilePicker = async () => {
    try {
      const result = await electrobun.rpc?.request.selectPdfs();
      const paths: string[] = Array.isArray(result)
        ? result
        : (result as any)?.filePaths || [];

      if (paths && paths.length > 0) {
        setNumberingFiles((prev) => [...prev, ...paths]);
      }
    } catch (error) {
      console.error("Failed to open native file picker:", error);
    }
  };

  const processNumbering = async () => {
    if (numberingFiles.length === 0) return;
    setIsProcessing(true);

    try {
      const inputPaths = numberingFiles;

      // Get the directory of the first file to use as our save location
      const firstPath = inputPaths[0];
      const dir = firstPath.substring(
        0,
        Math.max(firstPath.lastIndexOf("/"), firstPath.lastIndexOf("\\")),
      );

      // Call the backend
      await electrobun.rpc?.request.pageNumbering({
        inputPaths,
        outputDir: dir,
        config: numConfig, // Passing the config so you can use it in your Bun backend!
      } as any);

      alert(`Success! Numbered PDFs saved to:\n${dir}`);
      setNumberingFiles([]); // Clear queue on success
    } catch (error) {
      console.error("Numbering failed:", error);
      alert("Failed to apply page numbers. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-indigo-500" /> Batch Numbering
        </h1>
        <p className="text-slate-500 mt-1">
          Add page numbers to the top right of multiple PDFs. Output is saved as
          a ZIP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* Replaced <label> with a <button> */}
          <button
            type="button"
            onClick={triggerNativeFilePicker}
            className="block w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer group"
          >
            <div className="flex flex-col items-center justify-center gap-2 text-slate-500 group-hover:text-indigo-500">
              <Copy className="w-10 h-10" />
              <span className="font-medium text-slate-700">
                Click to browse files
              </span>
              <span className="text-sm">
                Select multiple PDFs for numbering
              </span>
            </div>
          </button>

          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
              <span>
                Files to Process:{" "}
                <span className="text-indigo-600">{numberingFiles.length}</span>
              </span>
              <button
                onClick={() => setNumberingFiles([])}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
          <h3 className="font-semibold text-slate-800 border-b pb-2">
            Positioning & Style
          </h3>
          <p className="text-xs text-slate-500 italic mb-2">
            Positioning is calculated from the top-right corner.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Offset Right (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={numConfig.offsetX}
                onChange={(e) =>
                  updateNumConfig({ offsetX: Number(e.target.value) })
                }
                className="w-full rounded-md border-slate-300 shadow-sm border p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Offset Top (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={numConfig.offsetY}
                onChange={(e) =>
                  updateNumConfig({ offsetY: Number(e.target.value) })
                }
                className="w-full rounded-md border-slate-300 shadow-sm border p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Font Size (px)
              </label>
              <input
                type="number"
                min="6"
                max="72"
                value={numConfig.size}
                onChange={(e) =>
                  updateNumConfig({ size: Number(e.target.value) })
                }
                className="w-full rounded-md border-slate-300 shadow-sm border p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Color
              </label>
              <input
                type="color"
                value={numConfig.color}
                onChange={(e) => updateNumConfig({ color: e.target.value })}
                className="h-9 w-full rounded cursor-pointer border border-slate-300"
              />
            </div>
          </div>
          <button
            onClick={processNumbering}
            disabled={isProcessing || numberingFiles.length === 0}
            className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Archive className="w-5 h-5" />
            )}
            {isProcessing ? "Processing..." : "Apply & Download ZIP"}
          </button>
        </div>
      </div>
    </section>
  );
};
