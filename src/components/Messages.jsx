import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { Bot, User, Skull, Sparkles } from "lucide-react";

function TypewriterText({ fullText, onComplete, onWordTyped }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!fullText) return;

    const words = fullText.split(/(\s+)/);
    let currentIndex = 0;
    let accumulated = "";

    const timer = setInterval(() => {
      if (currentIndex < words.length) {
        accumulated += words[currentIndex];
        setDisplayedText(accumulated);
        currentIndex++;
        if (onWordTyped) onWordTyped();
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 25);

    return () => clearInterval(timer);
  }, [fullText]);

  return <span>{displayedText}</span>;
}

function Messages() {
  const { messages, loadingAi, typingMessageId, setTypingMessageId, user } = useApp();
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingAi]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
      {messages.length === 0 && !loadingAi && (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 select-none">
          <div className="size-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <Sparkles size={24} />
          </div>
          <h3 className="text-base font-semibold text-slate-200">
            Start a conversation
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Type a prompt below to brainstorm ideas, ask questions, or research
            topics inside this workspace.
          </p>
        </div>
      )}

      {messages.map((msg) => {
        const isUser = msg.role === "user";
        const isCurrentlyTyping = typingMessageId === msg._id;

        return (
          <div
            key={msg._id}
            className={`flex items-start gap-3 transition-all duration-200 ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            {!isUser && (
              <div className="size-8 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot size={16} />
              </div>
            )}

            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all shadow-sm ${
                isUser
                  ? "bg-indigo-600 text-white rounded-br-xs"
                  : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-xs"
              }`}
            >
              {!isUser && isCurrentlyTyping ? (
                <TypewriterText
                  fullText={msg.content}
                  onWordTyped={scrollToBottom}
                  onComplete={() => setTypingMessageId(null)}
                />
              ) : (
                <span className="whitespace-pre-wrap">{msg.content}</span>
              )}
            </div>

            {isUser && (
              <div className="size-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {user?.email?.charAt(0).toUpperCase() || <User size={15} />}
              </div>
            )}
          </div>
        );
      })}

      {loadingAi && (
        <div className="flex items-start gap-3 justify-start animate-fade-in">
          <div className="size-8 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
            <Skull size={16} className="text-indigo-400" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl rounded-bl-xs px-4 py-3.5 space-y-2 w-64 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 font-medium">
              <span className="inline-block size-1.5 rounded-full bg-indigo-400 animate-ping" />
              <span>Thinking & formulating reply...</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full animate-pulse w-5/6" />
            <div className="h-2 bg-slate-800 rounded-full animate-pulse w-3/4" />
            <div className="h-2 bg-slate-800 rounded-full animate-pulse w-1/2" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default Messages;
