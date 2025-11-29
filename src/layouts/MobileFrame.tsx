import { useTheme } from "../contexts/ThemeContext";

export default function MobileFrame({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="w-full min-h-screen bg-[#E9EAEE] flex justify-center">
      <div 
        className="w-full max-w-[430px] min-h-screen shadow-xl transition-colors duration-300"
        style={{ backgroundColor: isDarkMode ? "#0B0F19" : "#ffffff" }}
      >
        {children}
      </div>
    </div>
  );
}
