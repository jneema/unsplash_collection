import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { AppThemeContext } from "../../theme/AppThemeProvider";
import { Ionicons } from "@expo/vector-icons";

const OPTIONS = [
  { label: "Light", value: "light", icon: "sunny-outline" },
  { label: "Dark", value: "dark", icon: "moon-outline" },
  { label: "System", value: "system", icon: "contrast-outline" },
];

export default function Settings() {
  const { theme, setTheme } = useContext(AppThemeContext);
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="px-6 pt-6">
        <Text
          className="text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tighter"
          style={{ lineHeight: 50 }}
        >
          Settings
        </Text>
        <Text className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-8">
          Appearance
        </Text>

        <View className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
          {OPTIONS.map((opt, i) => {
            const active = theme === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.7}
                onPress={() => setTheme(opt.value)}
                className={`flex-row items-center justify-between px-6 py-6 ${
                  i !== OPTIONS.length - 1
                    ? "border-b border-slate-50 dark:border-slate-800/50"
                    : ""
                } ${active ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`p-2 rounded-xl mr-4 ${active ? "bg-blue-500" : "bg-slate-100 dark:bg-slate-800"}`}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={20}
                      color={active ? "white" : "#64748b"}
                    />
                  </View>
                  <View>
                    <Text
                      className={`text-lg font-bold ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-slate-200"}`}
                    >
                      {opt.label}
                    </Text>
                    {opt.value === "system" && (
                      <Text className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">
                        Currently: {colorScheme}
                      </Text>
                    )}
                  </View>
                </View>

                <View
                  className={`w-6 h-6 rounded-full items-center justify-center border-2 ${
                    active
                      ? "border-blue-500"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {active && (
                    <View className="w-3 h-3 rounded-full bg-blue-500" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text className="mt-6 px-4 text-center text-sm text-slate-400 dark:text-slate-600">
          Personalize your experience with a theme that fits your style.
        </Text>
      </View>
    </SafeAreaView>
  );
}
