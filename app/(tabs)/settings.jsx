import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { AppThemeContext } from "../../theme/AppThemeProvider";

const OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export default function Settings() {
  const { theme, setTheme } = useContext(AppThemeContext);
  const { colorScheme } = useColorScheme(); // Use NativeWind's detection

  console.log("Current theme:", theme);
  console.log("Device theme (NativeWind):", colorScheme);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="px-8 pt-16">
        <Text className="text-4xl font-black text-slate-900 dark:text-white mb-2">
          Settings
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 mb-10">
          Appearance
        </Text>

        <View className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200 dark:shadow-none">
          {OPTIONS.map((opt, i) => {
            const active = theme === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setTheme(opt.value)}
                className={`flex-row items-center justify-between px-6 py-5 ${
                  i !== OPTIONS.length - 1
                    ? "border-b border-slate-100 dark:border-slate-700"
                    : ""
                }`}
              >
                <View>
                  <Text className="text-lg font-semibold text-slate-900 dark:text-white">
                    {opt.label}
                  </Text>
                  {opt.value === "system" && (
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                      Applied: {colorScheme}
                    </Text>
                  )}
                </View>
                <View
                  className={`w-5 h-5 rounded-full border-2 ${
                    active ? "border-blue-500 bg-blue-500" : "border-slate-300"
                  }`}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}