import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginApi,
  registerApi,
  getWorkspacesApi,
  createWorkspaceApi,
  deleteWorkspaceApi,
  getChatsApi,
  createChatApi,
  deleteChatApi,
  getMessagesApi,
  sendMessageApi,
} from "../API/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("chat_token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("chat_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem("chat_token", data.token);
    setToken(data.token);

    const userData = { email };
    localStorage.setItem("chat_user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name, email, password) => {
    const data = await registerApi(name, email, password);
    await login(email, password);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_user");
    setToken(null);
    setUser(null);
    setWorkspaces([]);
    setActiveWorkspace(null);
    setChats([]);
    setActiveChat(null);
    setMessages([]);
  };

  useEffect(() => {
    if (!token) return;

    const loadWorkspaces = async () => {
      try {
        const fetchedWorkspaces = await getWorkspacesApi(token);
        setWorkspaces(fetchedWorkspaces);

        if (fetchedWorkspaces.length > 0) {
          setActiveWorkspace(fetchedWorkspaces[0]);
        } else {
          setActiveWorkspace(null);
        }
      } catch (err) {
        console.error("Error loading workspaces:", err);
      }
    };

    loadWorkspaces();
  }, [token]);

  const addWorkspace = async (name, icon = "folder") => {
    if (!token || !name.trim()) return;
    try {
      const newWs = await createWorkspaceApi(token, name, icon);
      setWorkspaces((prev) => [...prev, newWs]);
      setActiveWorkspace(newWs);
    } catch (err) {
      console.error("Error creating workspace:", err);
      alert(err.message);
    }
  };

  const removeWorkspace = async (workspaceId) => {
    if (!token) return;
    try {
      await deleteWorkspaceApi(token, workspaceId);
      const remaining = workspaces.filter((ws) => ws._id !== workspaceId);
      setWorkspaces(remaining);
      setActiveWorkspace(remaining.length > 0 ? remaining[0] : null);
    } catch (err) {
      console.error("Error deleting workspace:", err);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!token || !activeWorkspace) {
      setChats([]);
      setActiveChat(null);
      return;
    }

    const loadChats = async () => {
      try {
        const fetchedChats = await getChatsApi(token, activeWorkspace._id);
        setChats(fetchedChats);

        if (fetchedChats.length > 0) {
          setActiveChat(fetchedChats[0]);
        } else {
          setActiveChat(null);
        }
      } catch (err) {
        console.error("Error loading chats:", err);
      }
    };

    loadChats();
  }, [token, activeWorkspace]);

  const addChat = async (title) => {
    if (!token || !activeWorkspace || !title.trim()) return;
    try {
      const newChat = await createChatApi(token, activeWorkspace._id, title);
      setChats((prev) => [...prev, newChat]);
      setActiveChat(newChat);
    } catch (err) {
      console.error("Error creating chat:", err);
      alert(err.message);
    }
  };

  const removeChat = async (chatId) => {
    if (!token || !activeWorkspace) return;
    try {
      await deleteChatApi(token, activeWorkspace._id, chatId);
      const remaining = chats.filter((c) => c._id !== chatId);
      setChats(remaining);
      setActiveChat(remaining.length > 0 ? remaining[0] : null);
    } catch (err) {
      console.error("Error deleting chat:", err);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!token || !activeWorkspace || !activeChat) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const fetchedMessages = await getMessagesApi(
          token,
          activeWorkspace._id,
          activeChat._id
        );
        setMessages(fetchedMessages);
        setTypingMessageId(null);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    loadMessages();
  }, [token, activeWorkspace, activeChat]);

  const sendNewMessage = async (content) => {
    if (!token || !activeWorkspace || !activeChat || !content.trim()) return;

    const tempUserMessage = {
      _id: "temp-" + Date.now(),
      role: "user",
      content: content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setLoadingAi(true);

    try {
      const result = await sendMessageApi(
        token,
        activeWorkspace._id,
        activeChat._id,
        content
      );

      const finalUserMsg = result.userMsg || tempUserMessage;
      const finalAiMsg = {
        _id: "ai-" + Date.now(),
        role: result.AiMsg?.role || "assistant",
        content: result.AiMsg?.content || "No response received",
        createdAt: new Date().toISOString(),
      };

      setTypingMessageId(finalAiMsg._id);

      setMessages((prev) => [
        ...prev.filter((m) => m._id !== tempUserMessage._id),
        finalUserMsg,
        finalAiMsg,
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          _id: "err-" + Date.now(),
          role: "assistant",
          content: "Sorry, I ran into an error getting the reply. Please check if the server is running.",
        },
      ]);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        addWorkspace,
        removeWorkspace,
        chats,
        activeChat,
        setActiveChat,
        addChat,
        removeChat,
        messages,
        sendNewMessage,
        loadingAi,
        typingMessageId,
        setTypingMessageId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside an AppProvider");
  }
  return context;
}
