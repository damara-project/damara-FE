// src/App.tsx

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import SplashTest from "./pages/SplashTest";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import MyPosts from "./pages/MyPosts";
import ParticipatedPosts from "./pages/ParticipatedPosts";
import Settings from "./pages/Settings";
import FAQ from "./pages/FAQ";
import MobileFrame from "./layouts/MobileFrame";
import BottomNav from "./components/BottomNav";
import { ThemeProvider } from "./contexts/ThemeContext";

// BottomNav를 보여줄 페이지 목록
const SHOW_BOTTOM_NAV_PATHS = ["/home", "/chat", "/profile"];

function AppContent() {
  const { pathname } = useLocation();
  const showBottomNav = SHOW_BOTTOM_NAV_PATHS.includes(pathname);

  return (
    <MobileFrame>
      <Routes>
        <Route path="/" element={<SplashTest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/participated" element={<ParticipatedPosts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      
      {/* 로그인 이후 페이지에서만 BottomNav 표시 */}
      {showBottomNav && <BottomNav />}
    </MobileFrame>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
