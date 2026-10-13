import React from "react";
import { useApp } from "../context/AppContext";
import Header from "../Header";
import Messages from "./Messages";
import Input from "./Input";
import { MessageSquarePlus } from "lucide-react";

function ChatSection() {
  const { activeChat, activeWorkspace, addChat } = useApp();

  if (!activeChat) {
    return (
      <main className="flex-1 h-screen flex flex-col items-center justify-center bg-slate-950 text-center p-8 select-none">
        <div className="size-16 rounded-3xl bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center mb-4 shadow-xl">
          <MessageSquarePlus size={30} />
        </div>
        <h2 className="text-lg font-semibold text-slate-100">
          {activeWorkspace
            ? `Welcome to ${activeWorkspace.name}`
            : "No Workspace Selected"}
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mt-1.5 mb-5">
          {activeWorkspace
            ? "Select an existing chat on the left, or create a new topic to start chatting with your AI assistant."
            : "Select a workspace from the leftmost bar to view or create chats."}
        </p>

        {activeWorkspace && (
          <button
            onClick={() => {
              const title = prompt("Enter new chat title:");
              if (title) addChat(title);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            + Create a New Chat
          </button>
        )}
      </main>
    );
  }

  return (
    <main className="flex-1 h-screen flex flex-col bg-slate-950 overflow-hidden">
      <Header />
      <Messages />
      <Input />
    </main>
  );
}

export default ChatSection;