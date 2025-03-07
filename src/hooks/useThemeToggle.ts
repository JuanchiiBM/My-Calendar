import { useState } from "react";

const useThemeToggle = () => {
    const [theme, setTheme] = useState("light");
    
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    
    return { theme, toggleTheme };
};

export default useThemeToggle;