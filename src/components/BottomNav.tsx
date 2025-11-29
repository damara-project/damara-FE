// src/components/BottomNav.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { Home, MessageCircle, User } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function BottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { isDarkMode } = useTheme();

  // 다크모드 스타일 (새 색상 가이드 적용)
  const bgColor = isDarkMode ? "rgba(21, 28, 43, 0.95)" : "rgba(255, 255, 255, 0.95)";
  const borderColor = isDarkMode ? "#1A2233" : "#e5e7eb";
  const textInactive = isDarkMode ? "#6B7688" : "#9ca3af";
  const textActive = isDarkMode ? "#4F8BFF" : undefined;

  const tabs = [
    { id: "/home", icon: Home, label: "홈", gradient: "from-[#1A2F4A] to-[#355074]" },
    { id: "/chat", icon: MessageCircle, label: "채팅", gradient: "from-[#355074] to-[#6F91BC]" },
    { id: "/profile", icon: User, label: "나의 Damara", gradient: "from-[#6F91BC] to-[#8BA3C3]" },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 backdrop-blur-lg max-w-[430px] mx-auto shadow-lg transition-colors"
      style={{ 
        backgroundColor: bgColor,
        borderTop: `1px solid ${borderColor}`
      }}
    >
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => nav(tab.id)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative group"
            >
              {/* 활성 탭 인디케이터 */}
              {active && (
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r ${tab.gradient} rounded-b-full`}
                />
              )}

              {/* 아이콘 */}
              <Icon
                className={`w-6 h-6 transition-all ${
                  active
                    ? `bg-gradient-to-r ${tab.gradient} bg-clip-text text-transparent`
                    : ""
                }`}
                style={!active ? { color: textInactive } : undefined}
                strokeWidth={active ? 2.5 : 1.5}
              />

              {/* 텍스트 */}
              <span
                className={`text-[10px] transition-all ${
                  active
                    ? `bg-gradient-to-r ${tab.gradient} bg-clip-text text-transparent`
                    : ""
                }`}
                style={!active ? { color: textInactive } : undefined}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
