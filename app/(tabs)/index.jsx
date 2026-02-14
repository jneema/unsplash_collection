import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BLOB_DATA = [
  {
    style:
      "left-[-20px] top-24 w-48 h-48 bg-rose-100 dark:bg-rose-900 opacity-40 dark:opacity-20",
  },
  {
    style:
      "right-[-20px] top-60 w-64 h-64 bg-slate-200 dark:bg-slate-800 opacity-40 dark:opacity-20",
  },
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query?.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleTagPress = (tag) => {
    router.push(`/search?query=${encodeURIComponent(tag)}`);
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="absolute inset-0" pointerEvents="none">
        {BLOB_DATA.map((blob, i) => (
          <View
            key={i}
            className={`absolute rounded-full blur-[90px] ${blob.style}`}
          />
        ))}
      </View>

      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center px-6">
          <View className="items-center w-full mb-10">
            <Text
              className="text-6xl font-bold text-slate-800 dark:text-slate-100 mb-2 py-2 tracking-tighter text-center"
              style={{ lineHeight: 64 }}
            >
              Search
            </Text>
            <Text className="text-lg font-medium text-slate-400 dark:text-slate-500 text-center px-8">
              Beautiful imagery for your next project
            </Text>
          </View>

          <View className="flex-row items-center bg-white dark:bg-slate-900 rounded-3xl px-5 py-1.5 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none">
            <TextInput
              placeholder="Search high-res photos..."
              placeholderTextColor="#94a3b8"
              className="flex-1 px-2 text-slate-800 dark:text-slate-100"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              style={{
                height: 52,
                fontSize: 17,
                fontWeight: "500",
              }}
            />
            <TouchableOpacity onPress={handleSubmit}>
              <Ionicons name="search" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <View className="mt-10 px-4">
            <Text className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-[2px] mb-5 text-center">
              Popular Categories
            </Text>

            <View className="flex-row flex-wrap justify-center gap-3">
              {[
                {
                  name: "Nature",
                  icon: "leaf-outline",
                  color: "bg-slate-100 dark:bg-slate-900",
                  textColor: "text-slate-600 dark:text-slate-300",
                  iconColor: "#94a3b8", // Muted slate icon
                },
                {
                  name: "Architecture",
                  icon: "business-outline",
                  color: "bg-slate-100 dark:bg-slate-900",
                  textColor: "text-slate-600 dark:text-slate-300",
                  iconColor: "#94a3b8",
                },
                {
                  name: "Travel",
                  icon: "airplane-outline",
                  color: "bg-slate-100 dark:bg-slate-900",
                  textColor: "text-slate-600 dark:text-slate-300",
                  iconColor: "#94a3b8",
                },
              ].map((tag) => (
                <TouchableOpacity
                  key={tag.name}
                  onPress={() => handleTagPress(tag.name)}
                  className={`${tag.color} flex-row items-center px-6 py-3 rounded-2xl border border-white dark:border-slate-800 shadow-sm`}
                >
                  <Ionicons name={tag.icon} size={18} color={tag.iconColor} />
                  <Text className={`${tag.textColor} font-bold text-sm ml-2`}>
                    {tag.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
