import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeType = "light" | "dark";

interface ThemeContextValue {
  thema: ThemeType;
  isDark: boolean;
  setThema: (newTheme: ThemeType) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  thema: "light",
  isDark: false,
  setThema: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [thema, setThemaState] = useState<ThemeType>("light");

  useEffect(() => {
    AsyncStorage.getItem("thema").then((saved) => {
      if (saved === "dark" || saved === "light") {
        setThemaState(saved);
      }
    });
  }, []);

  const setThema = async (newTheme: ThemeType) => {
    await AsyncStorage.setItem("thema", newTheme);
    setThemaState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ thema, isDark: thema === "dark", setThema }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
