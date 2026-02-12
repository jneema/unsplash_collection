import React from "react";
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BLOB_DATA = [
  {
    style:
      "left-8 top-24 w-20 h-32 bg-blue-100 dark:bg-blue-900 opacity-30 dark:opacity-20",
  },
  {
    style:
      "right-6 top-32 w-24 h-36 bg-pink-100 dark:bg-purple-900 opacity-25 dark:opacity-15",
  },
];

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      <View className="absolute inset-0" pointerEvents="none">
        {BLOB_DATA.map((blob, i) => (
          <View
            key={i}
            className={`absolute rounded-full blur-3xl ${blob.style}`}
          />
        ))}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-8">
            <View className="items-center w-full">
              <Text className="text-5xl font-black text-slate-900 dark:text-slate-50 mb-2 py-2">
                Search
              </Text>
              <Text className="text-lg text-slate-500 dark:text-slate-400 text-center mb-10">
                Discover high-resolution images
              </Text>

              <View className="w-full shadow-xl shadow-slate-200 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl border border-transparent dark:border-slate-800">
                <TextInput
                  placeholder="Try 'Mountain'..."
                  placeholderTextColor="#94a3b8"
                  className="w-full px-6 py-5 text-lg text-slate-800 dark:text-slate-100"
                  returnKeyType="search"
                  selectionColor={Platform.OS === "ios" ? "#64748b" : undefined}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
