// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SplashTest from "./pages/SplashTest";
import MobileFrame from "./layouts/MobileFrame";

export default function App() {
  return (
    <BrowserRouter>
      {/* 모든 페이지를 모바일 프레임에 고정 */}
      <MobileFrame>
        <Routes>
          <Route path="/" element={<SplashTest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MobileFrame>
    </BrowserRouter>
  );
}
