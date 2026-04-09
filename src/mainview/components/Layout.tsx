import { useState } from "react";
import { Outlet, Link } from "@tanstack/react-router";
import {
  FileBox,
  Combine,
  Droplet,
  ListOrdered,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
// 1. Import the ToastContainer
import { ToastContainer } from "../components/ToastContainer"; // Adjust path as needed

export const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeClasses = "bg-indigo-100 text-indigo-700 font-medium shadow-sm";
  const inactiveClasses =
    "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900";

  const getLinkClasses = () =>
    `group relative flex items-center gap-3 py-2.5 text-sm rounded-md transition-all ${
      isCollapsed ? "px-0 justify-center" : "px-3"
    }`;

  const navItems = [
    { path: "/", icon: Combine, label: "Merge PDFs" },
    { path: "/watermark", icon: Droplet, label: "Batch Watermark" },
    { path: "/numbering", icon: ListOrdered, label: "Batch Numbering" },
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden font-sans text-slate-800 relative">
      {/* Desktop App Feature Sidebar */}
      <aside
        className={`shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col shadow-[1px_0_4px_rgba(0,0,0,0.02)] z-20 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* App Branding & Toggle Button */}
        <div
          className={`h-16 flex items-center border-b border-slate-200/60 ${isCollapsed ? "justify-center px-0" : "justify-between px-5"}`}
        >
          <div
            className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? "hidden" : "flex"}`}
          >
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm shrink-0">
              <FileBox className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 truncate">
              PdfStudio
            </span>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors shrink-0"
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Tools */}
        <div className="flex-1 py-5 px-3 relative">
          {!isCollapsed && (
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">
              Tools
            </h2>
          )}

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                activeProps={{ className: activeClasses }}
                inactiveProps={{ className: inactiveClasses }}
                className={getLinkClasses()}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}

                {/* Custom Instant Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-200">
                    <div className="bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap flex items-center">
                      <div className="absolute -left-1 w-2 h-2 bg-slate-800 rotate-45"></div>
                      <span className="relative z-10">{item.label}</span>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col min-w-0 z-10">
        <div className="flex-1 p-6 md:p-8 lg:p-10 max-w-5xl w-full mx-auto">
          <Outlet />
        </div>
      </main>

      {/* 2. Global Toast Container */}
      {/* Mounted at the root level so it stays fixed over everything */}
      <ToastContainer />
    </div>
  );
};
