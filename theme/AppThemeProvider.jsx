import React, { createContext, useEffect, useState } from "react";
import { View } from "react-native";
import { useColorScheme } from "nativewind";

export const AppThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
});

export const AppThemeProvider = ({ children }) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [theme, setTheme] = useState("system");

  // Apply theme to NativeWind
  useEffect(() => {
    if (theme === "system") {
      // Let NativeWind handle system theme detection
      setColorScheme("system");
    } else {
      setColorScheme(theme);
    }
  }, [theme, setColorScheme]);

  return (
    <View className={colorScheme === "dark" ? "dark flex-1" : "flex-1"}>
      <AppThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </AppThemeContext.Provider>
    </View>
  );
};