import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Send } from "lucide-react";

function Input() {
  const { sendNewMessage, loadingAi, activeChat } = useApp();
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (!content.trim() || loadingAi) return;
    sendNewMessage(content.trim());
    setContent("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeChat) return null;

  return (
    <div className="p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto flex items-end gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/40 transition-all shadow-lg">
        <textarea
          rows={1}
          value={content}
          disabled={loadingAi}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            loadingAi
              ? "AI is thinking..."
              : "Ask anything or type a prompt... (Press Enter to send)"
          }
          className="flex-1 bg-transparent border-none outline-none resize-none px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 max-h-32 min-h-[38px] disabled:opacity-50"
        />

        <button
          onClick={handleSend}
          disabled={!content.trim() || loadingAi}
          className="size-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-md shadow-indigo-600/20"
          title="Send message"
        >
          <Send size={16} />
        </button>
      </div>

      <p className="text-[10px] text-center text-slate-500 mt-2">
        Connected to your backend via REST. AI powered by OpenRouter.
      </p>
    </div>
  );
}

export default Input;