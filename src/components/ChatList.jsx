import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MessageSquare, Plus, Search, Trash2, Hash } from "lucide-react";

function ChatList() {
  const {
    activeWorkspace,
    chats,
    activeChat,
    setActiveChat,
    addChat,
    removeChat,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  const handleCreateChat = async (e) => {
    e.preventDefault();
    if (!newChatTitle.trim()) return;
    await addChat(newChatTitle.trim());
    setNewChatTitle("");
    setIsCreating(false);
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!activeWorkspace) {
    return (
      <div className="w-72 h-screen bg-slate-900/30 border-r border-slate-800/80 flex flex-col items-center justify-center p-6 text-center text-slate-500 text-xs">
        Select or create a workspace on the left to see its chats.
      </div>
    );
  }

  return (
    <div className="w-72 h-screen bg-slate-900/40 border-r border-slate-800/80 flex flex-col justify-between select-none">
      <div className="p-3 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
              Workspace
            </span>
            <h3 className="text-sm font-semibold text-slate-200 truncate">
              {activeWorkspace.name}
            </h3>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
            title="Create new chat"
          >
            <Plus size={15} />
          </button>
        </div>

        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
          />
        </div>
      </div>

      {isCreating && (
        <form
          onSubmit={handleCreateChat}
          className="p-3 bg-slate-950/50 border-b border-slate-800/80 space-y-2"
        >
          <input
            type="text"
            autoFocus
            placeholder="Chat topic title..."
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-1.5">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium py-1 rounded-md transition-all cursor-pointer"
            >
              Add Chat
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewChatTitle("");
              }}
              className="px-2.5 bg-slate-900 text-slate-400 hover:text-slate-200 text-[11px] py-1 rounded-md transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredChats.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            {searchQuery ? "No matching chats found." : "No chats yet. Click + to create one!"}
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isActive = activeChat?._id === chat._id;
            return (
              <div
                key={chat._id}
                onClick={() => setActiveChat(chat)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-slate-800 text-white border border-slate-700/60 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`size-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? "bg-indigo-600/30 text-indigo-400"
                        : "bg-slate-950 text-slate-500 group-hover:text-slate-400"
                    }`}
                  >
                    <Hash size={14} />
                  </span>
                  <span className="truncate">{chat.title}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete chat "${chat.title}"?`)) {
                      removeChat(chat._id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded-md transition-all cursor-pointer"
                  title="Delete chat"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
        <span>{chats.length} {chats.length === 1 ? "Chat" : "Chats"}</span>
        <span>Scoped to workspace</span>
      </div>
    </div>
  );
}

export default ChatList;
