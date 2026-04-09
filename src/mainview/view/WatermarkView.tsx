import { useState } from "react";
import { position, useAppStore } from "../store/useAppStore";
import { Droplet, Files, Archive, Loader2 } from "lucide-react";
import { CustomSelect } from "../components/CustomSelect";
import { electrobun } from "../composables/rpcHandler";
import { useToastStore } from "../store/useToastStore";

export const WatermarkView = () => {
  const { watermarkFiles, setWatermarkFiles, wmConfig, updateWmConfig } =
    useAppStore();
  const addToast = useToastStore((state) => state.addToast);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Native OS File Picker Trigger
  const triggerNativeFilePicker = async () => {
    try {
      const result = await electrobun.rpc?.request.selectPdfs();
      const paths: string[] = Array.isArray(result)
        ? result
        : (result as any)?.filePaths || [];

      if (paths && paths.length > 0) {
        setWatermarkFiles((prev) => [...prev, ...paths]);
      }
    } catch (error) {
      console.error("Failed to open native file picker:", error);
    }
  };

  const processWatermark = async () => {
    if (watermarkFiles.length === 0) return;
    setIsProcessing(true);

    try {
      const inputPaths = watermarkFiles;

      const firstPath = inputPaths[0];
      const dir = firstPath.substring(
        0,
        Math.max(firstPath.lastIndexOf("/"), firstPath.lastIndexOf("\\")),
      );

      // Call the backend
      await electrobun.rpc?.request.addWatermark({
        inputPaths,
        outputDir: dir,
        config: wmConfig, // Passing the rest of the config for your backend logic
      } as any);

      addToast(`Success! Watermarked PDFs saved to:\n${dir}`, "success");
      setWatermarkFiles([]);
    } catch (error) {
      console.error("Watermark failed:", error);
      addToast(
        "Failed to apply watermarks. Check console for details.",
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Droplet className="w-6 h-6 text-indigo-500" /> Batch Watermark
        </h1>
        <p className="text-slate-500 mt-1">
          Add a custom text watermark to multiple PDFs. Will be saved as a ZIP
          archive.
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
              <Files className="w-10 h-10" />
              <span className="font-medium text-slate-700">
                Click to browse files
              </span>
              <span className="text-sm">
                Select multiple PDFs for watermarking
              </span>
            </div>
          </button>

          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
              <span>
                Files to Process:{" "}
                <span className="text-indigo-600">{watermarkFiles.length}</span>
              </span>
              <button
                onClick={() => setWatermarkFiles([])}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
          <h3 className="font-semibold text-slate-800 border-b pb-2">
            Watermark Configuration
          </h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Text Content
            </label>
            <input
              type="text"
              value={wmConfig.text}
              onChange={(e) => updateWmConfig({ text: e.target.value })}
              className="w-full rounded-md border-slate-300 shadow-sm border p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Position
              </label>
              <CustomSelect
                value={wmConfig.pos}
                onChange={(val) =>
                  updateWmConfig({
                    pos: position.find((v) => v === val) ?? position[0],
                  })
                }
                options={[
                  { value: position[0], label: "Center" },
                  { value: position[1], label: "Top Center" },
                  { value: position[2], label: "Bottom Center" },
                  { value: position[3], label: "Diagonal" },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Color
              </label>
              <input
                type="color"
                value={wmConfig.color}
                onChange={(e) => updateWmConfig({ color: e.target.value })}
                className="h-9 w-full rounded cursor-pointer border border-slate-300"
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
                min="10"
                max="200"
                value={wmConfig.size}
                onChange={(e) =>
                  updateWmConfig({ size: Number(e.target.value) })
                }
                className="w-full rounded-md border-slate-300 shadow-sm border p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Opacity (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={wmConfig.opacity}
                onChange={(e) =>
                  updateWmConfig({ opacity: Number(e.target.value) })
                }
                className="w-full rounded-md border-slate-300 shadow-sm border p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rotation (degrees)
            </label>
            <input
              type="number"
              value={wmConfig.rotation}
              onChange={(e) =>
                updateWmConfig({ rotation: Number(e.target.value) })
              }
              className="w-full rounded-md border-slate-300 shadow-sm border p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={processWatermark}
            disabled={isProcessing || watermarkFiles.length === 0}
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
