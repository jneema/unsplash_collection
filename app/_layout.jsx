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
        <Stack.Screen name="photos/[id]" />
        <Stack.Screen name="collections/[id]" />
        <Stack.Screen name="photos/search"/>
      </Stack>
    </AppThemeProvider>
  );
};

export default RootLayout;
