// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type FontSize = "small" | "medium" | "large";

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  fontSize: FontSize;
  setFontSize: (value: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem("fontSize");
    return (saved as FontSize) || "medium";
  });

  // 다크모드 저장만 (실제 적용은 각 컴포넌트에서)
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // 글꼴 크기 적용
  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
    const root = document.documentElement;
    
    switch (fontSize) {
      case "small":
        root.style.setProperty("--font-size", "14px");
        break;
      case "medium":
        root.style.setProperty("--font-size", "16px");
        break;
      case "large":
        root.style.setProperty("--font-size", "18px");
        break;
    }
  }, [fontSize]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

