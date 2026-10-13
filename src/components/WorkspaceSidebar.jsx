import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Folder,
  Plus,
  Trash2,
  LogOut,
  Layers,
  Sparkles,
  BookOpen,
  Plane,
  Briefcase,
  Code,
} from "lucide-react";

function WorkspaceSidebar() {
  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    addWorkspace,
    removeWorkspace,
    logout,
    user,
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [newWsName, setNewWsName] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    await addWorkspace(newWsName.trim(), "folder");
    setNewWsName("");
    setIsCreating(false);
  };

  const getWorkspaceIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("study") || lower.includes("learn") || lower.includes("book")) {
      return <BookOpen size={16} />;
    }
    if (lower.includes("travel") || lower.includes("trip") || lower.includes("flight")) {
      return <Plane size={16} />;
    }
    if (lower.includes("work") || lower.includes("office") || lower.includes("job")) {
      return <Briefcase size={16} />;
    }
    if (lower.includes("code") || lower.includes("dev") || lower.includes("project")) {
      return <Code size={16} />;
    }
    return <Folder size={16} />;
  };

  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col justify-between select-none">
      <div className="flex flex-col flex-1 overflow-hidden p-3">
        <div className="flex items-center gap-2.5 px-3 py-3 mb-3 border-b border-slate-900">
          <div className="size-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Layers size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 tracking-tight leading-none">
              Workspaces
            </h2>
            <span className="text-[11px] text-slate-500">Organize your topics</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {workspaces.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No workspaces yet. Create one below to begin!
            </div>
          ) : (
            workspaces.map((ws) => {
              const isActive = activeWorkspace?._id === ws._id;
              return (
                <div
                  key={ws._id}
                  onClick={() => setActiveWorkspace(ws)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-150 ${
                    isActive
                      ? "bg-slate-800 text-white shadow-sm border border-slate-700/60"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`size-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-900 text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      {getWorkspaceIcon(ws.name)}
                    </span>
                    <span className="truncate">{ws.name}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete workspace "${ws.name}"?`)) {
                        removeWorkspace(ws._id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded-md transition-all cursor-pointer"
                    title="Delete workspace"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-slate-900">
          {isCreating ? (
            <form onSubmit={handleCreate} className="space-y-2">
              <input
                type="text"
                autoFocus
                placeholder="e.g. Study, Travel, Work"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-1.5">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium py-1 rounded-md transition-all cursor-pointer"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewWsName("");
                  }}
                  className="px-2.5 bg-slate-900 text-slate-400 hover:text-slate-200 text-[11px] py-1 rounded-md transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all cursor-pointer hover:bg-slate-900/50"
            >
              <Plus size={14} />
              <span>New Workspace</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-slate-900 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-semibold text-xs flex items-center justify-center shrink-0 border border-indigo-500/20">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">
              {user?.email || "User"}
            </p>
            <p className="text-[10px] text-slate-500 truncate">Logged in</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

export default WorkspaceSidebar;
