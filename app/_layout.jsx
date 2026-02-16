import "./global.css";
import { Stack } from "expo-router";
import { AppThemeProvider } from "../theme/AppThemeProvider";
import { Provider } from "react-redux";
import { persistor, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useInitialData } from "../hooks/useInitialData";

const AppContent = () => {
  useInitialData();

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
        <Stack.Screen name="search" />
      </Stack>
    </AppThemeProvider>
  );
};

const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
