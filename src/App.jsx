import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Auth from "./components/Auth";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import ChatList from "./components/ChatList";
import ChatSection from "./components/ChatSection";

function MainLayout() {
  const { token } = useApp();

  if (!token) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <WorkspaceSidebar />
      <ChatList />
      <ChatSection />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;