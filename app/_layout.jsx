import "./global.css";
import { Stack } from "expo-router";
import { AppThemeProvider } from "../theme/AppThemeProvider";

const RootLayout = () => {
  return (
    <AppThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppThemeProvider>
  );
};

export default RootLayout;
