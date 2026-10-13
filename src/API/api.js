const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const authHeader = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const registerApi = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  return data;
};

export const loginApi = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const getWorkspacesApi = async (token) => {
  const response = await fetch(`${API_BASE_URL}/workspaces`, {
    method: "GET",
    headers: authHeader(token),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch workspaces");
  return data.workspaces || [];
};

export const createWorkspaceApi = async (token, name, icon = "folder") => {
  const response = await fetch(`${API_BASE_URL}/workspaces`, {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({ name, icon }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create workspace");
  return data.workspace;
};

export const deleteWorkspaceApi = async (token, workspaceId) => {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete workspace");
  return data;
};

export const getChatsApi = async (token, workspaceId) => {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/chats`, {
    method: "GET",
    headers: authHeader(token),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch chats");
  return data.chats || [];
};

export const createChatApi = async (token, workspaceId, title) => {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/chats`, {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({ title }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create chat");
  return data.createdChat?.chat || data.chat;
};

export const deleteChatApi = async (token, workspaceId, chatId) => {
  const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/chats/${chatId}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete chat");
  return data;
};

export const getMessagesApi = async (token, workspaceId, chatId) => {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/chats/${chatId}/messages`,
    {
      method: "GET",
      headers: authHeader(token),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch messages");
  return data.Msgs || [];
};

export const sendMessageApi = async (token, workspaceId, chatId, content) => {
  const response = await fetch(
    `${API_BASE_URL}/workspaces/${workspaceId}/chats/${chatId}/messages`,
    {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify({ content }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to send message");
  return data;
};
