import { useState } from "react";
import {
  Combine,
  UploadCloud,
  FileText,
  ArrowUp,
  ArrowDown,
  X,
  FolderSearch,
  Layers,
  Loader2,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { CustomSelect } from "../components/CustomSelect";
import { electrobun } from "../composables/rpcHandler";
import { useToastStore } from "../store/useToastStore";

export const MergeView = () => {
  const { mergeFiles, setMergeFiles, moveMergeFile, removeMergeFile } =
    useAppStore();

  const addToast = useToastStore((state) => state.addToast);
  const [outputName, setOutputName] = useState("merged_document");
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to extract filename from absolute path (Handles Mac '/' and Windows '\')
  const getFileName = (path: string) =>
    path.split(/[/\\]/).pop() || "Unknown File";

  // 1. Replaced HTML input with Native OS Dialog
  const triggerNativeFilePicker = async () => {
    try {
      const result = await electrobun.rpc?.request.selectPdfs();

      // Ensure we have a valid array of paths returned from the backend
      // (Electrobun's openFileDialog might return the array directly or inside a property)
      const paths: string[] = Array.isArray(result)
        ? result
        : (result as any)?.filePaths || [];

      if (paths && paths.length > 0) {
        setMergeFiles((prev) => [...prev, ...paths]);
      }
    } catch (error) {
      console.error("Failed to open native file picker:", error);
    }
  };

  // 2. Replaced HTML input for picking an external name with Native OS Dialog
  const handleExternalNamePick = async () => {
    try {
      const result = await electrobun.rpc?.request.selectPdfs();
      const paths: string[] = Array.isArray(result)
        ? result
        : (result as any)?.filePaths || [];

      if (paths && paths.length > 0) {
        const fileName = getFileName(paths[0]);
        // Remove the .pdf extension
        setOutputName(fileName.replace(/\.[^/.]+$/, ""));
      }
    } catch (error) {
      console.error("Failed to pick external file:", error);
    }
  };

  const processMerge = async () => {
    if (mergeFiles.length === 0) return;
    setIsProcessing(true);

    try {
      // mergeFiles is ALREADY an array of absolute path strings from Zustand
      const inputPaths = mergeFiles;

      // Get the directory of the first file to use as our save location
      const firstPath = inputPaths[0];
      const dir = firstPath.substring(
        0,
        Math.max(firstPath.lastIndexOf("/"), firstPath.lastIndexOf("\\")),
      );
      const finalOutputPath = `${dir}/${outputName}.pdf`;

      // Call the backend
      await electrobun.rpc?.request.mergePdf({
        inputPaths,
        outputPath: finalOutputPath,
      });

      addToast(`Success! Merged file saved to:\n${finalOutputPath}`, "success");
      setMergeFiles([]); // Clear the list on success
    } catch (error) {
      console.error("Merge failed:", error);
      addToast("Failed to merge PDFs. Check console for details.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Combine className="w-6 h-6 text-indigo-500" /> Merge PDFs
        </h1>
        <p className="text-slate-500 mt-1">
          Combine multiple PDF files into one. Reorder them using the arrows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* Replaced <label> and <input> with a <button> that triggers the RPC */}
          <button
            type="button"
            onClick={triggerNativeFilePicker}
            className="block w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer group"
          >
            <div className="flex flex-col items-center justify-center gap-2 text-slate-500 group-hover:text-indigo-500">
              <UploadCloud className="w-10 h-10" />
              <span className="font-medium text-slate-700">
                Click to browse files
              </span>
              <span className="text-sm">Select multiple PDFs to merge</span>
            </div>
          </button>

          <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-3 bg-slate-100 border-b border-slate-200 text-sm font-semibold text-slate-600 flex justify-between">
              <span>Selected Files ({mergeFiles.length})</span>
              <button
                onClick={() => setMergeFiles([])}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Clear All
              </button>
            </div>
            <ul className="max-h-[300px] overflow-y-auto custom-scrollbar divide-y divide-slate-200">
              {mergeFiles.length === 0 ? (
                <li className="p-4 text-center text-sm text-slate-400 italic">
                  No files selected
                </li>
              ) : (
                mergeFiles.map((filePath, idx) => (
                  <li
                    key={`${filePath}-${idx}`}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                      <span
                        className="text-sm font-medium text-slate-700 truncate"
                        title={filePath}
                      >
                        {/* Display the parsed filename, show full path on hover */}
                        {getFileName(filePath)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveMergeFile(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveMergeFile(idx, "down")}
                        disabled={idx === mergeFiles.length - 1}
                        className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeMergeFile(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 ml-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 h-fit space-y-5">
          <h3 className="font-semibold text-slate-800">Output Settings</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Base Name From File
            </label>
            <div className="flex items-center gap-2">
              <CustomSelect
                value={outputName}
                onChange={(val) => setOutputName(val)}
                placeholder="-- Custom Name Below --"
                options={mergeFiles.map((filePath) => {
                  const name = getFileName(filePath).replace(/\.[^/.]+$/, "");
                  return { value: name, label: name };
                })}
              />
              <button
                onClick={handleExternalNamePick}
                title="Pick name from another file"
                className="shrink-0 bg-white hover:bg-slate-100 border border-slate-300 rounded-md p-2 text-slate-600 transition-colors flex items-center justify-center"
              >
                <FolderSearch className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Quickly grab a name from uploaded files or browse another file
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Final File Name
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={outputName}
                onChange={(e) => setOutputName(e.target.value)}
                className="w-full rounded-l-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 text-sm"
              />
              <span className="bg-slate-200 border border-l-0 border-slate-300 px-3 py-2 rounded-r-md text-sm text-slate-600">
                .pdf
              </span>
            </div>
          </div>

          <button
            onClick={processMerge}
            disabled={isProcessing || mergeFiles.length === 0}
            className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Layers className="w-5 h-5" />
            )}
            {isProcessing ? "Processing..." : "Merge & Download"}
          </button>
        </div>
      </div>
    </section>
  );
};
