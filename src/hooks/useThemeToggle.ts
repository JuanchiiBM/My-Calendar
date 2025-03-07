import { useState } from "react";
import { useTheme } from "@heroui/use-theme";

const useThemeToggle = () => {
    const {theme, setTheme} = useTheme('light');
    
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    
    return { theme, toggleTheme };
};

export default useThemeToggle;