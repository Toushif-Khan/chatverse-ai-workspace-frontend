import React from "react";
import { useApp } from "./context/AppContext";
import { MessageSquare, Sparkles } from "lucide-react";

function Header() {
  const { activeChat, activeWorkspace } = useApp();

  if (!activeChat) return null;

  return (
    <header className="h-16 px-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
          <MessageSquare size={18} />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-100 truncate">
            {activeChat.title}
          </h2>
          <p className="text-[11px] text-slate-400 truncate">
            Inside <span className="text-slate-300 font-medium">{activeWorkspace?.name}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
          <Sparkles size={12} className="text-indigo-400" />
          AI Assistant Ready
        </span>
      </div>
    </header>
  );
}

export default Header;