import { Toaster as Sonner, ToasterProps } from "sonner";
import { useTheme } from "../../contexts/ThemeContext";

const Toaster = ({ ...props }: ToasterProps) => {
  const { isDarkMode } = useTheme();

  return (
    <Sonner
      theme={isDarkMode ? "dark" : "light"}
      className="toaster group"
      position="top-center"
      {...props}
    />
  );
};

export { Toaster };
