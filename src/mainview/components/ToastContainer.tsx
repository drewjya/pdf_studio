import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useToastStore } from "../store/useToastStore";

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    // Fixed container at the bottom-right, pointer-events-none so it doesn't block clicks on the background
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          // Pointer-events-auto brings back clicking for the close button
          className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto transition-all transform min-w-80 max-w-96
            ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : ""}
            ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" : ""}
            ${toast.type === "info" ? "bg-blue-50 border-blue-200 text-blue-800" : ""}
          `}
          style={{ animation: "fade-in-up 0.3s ease-out forwards" }}
        >
          {/* Dynamic Icon */}
          {toast.type === "success" && (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          )}
          {toast.type === "info" && (
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          )}

          {/* Message - supports multiline text */}
          <p className="flex-1 text-sm font-medium leading-relaxed whitespace-pre-wrap text-wrap">
            {toast.message}
          </p>

          {/* Close Button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity p-1 -mr-1 -mt-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Optional: Add this tiny style block for a smooth entry animation */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
