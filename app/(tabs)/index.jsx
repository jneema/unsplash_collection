import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BLOB_DATA = [
  {
    style:
      "left-[-20px] top-24 w-40 h-40 bg-blue-200 dark:bg-blue-600 opacity-30 dark:opacity-20",
  },
  {
    style:
      "right-[-20px] top-60 w-56 h-56 bg-purple-200 dark:bg-purple-600 opacity-25 dark:opacity-15",
  },
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState(null);
  const handleSearch = (query) => {
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleSubmit = () => {
    if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  const handleTagPress = (tag) => {
    router.push(`/search?query=${encodeURIComponent(tag)}`);
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <View className="absolute inset-0" pointerEvents="none">
        {BLOB_DATA.map((blob, i) => (
          <View
            key={i}
            className={`absolute rounded-full blur-[80px] ${blob.style}`}
          />
        ))}
      </View>

      {/* Content */}
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center px-6">
          {/* Title */}
          <View className="items-center w-full mb-10">
            <Text
              className="text-6xl font-black text-slate-900 dark:text-slate-50 mb-2 py-2 tracking-tighter text-center leading-[72px]"
              style={{ lineHeight: 64 }}
            >
              Search
            </Text>
            <Text className="text-lg font-medium text-slate-400 dark:text-slate-500 text-center px-4">
              Discover high-resolution images from Unsplash
            </Text>
          </View>

          {/* Search Input */}
          <View className="flex-row items-center bg-white dark:bg-slate-900 rounded-[28px] px-4 py-1.5 border-2 border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-300 dark:shadow-none">
            <TextInput
              placeholder="Nature in Finland..."
              placeholderTextColor="#94a3b8"
              className="flex-1 px-3 text-slate-800 dark:text-slate-100"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
              style={{
                height: 48,
                fontSize: 18,
                fontWeight: "600",
                textAlignVertical: "center",
                paddingTop: 0,
                paddingBottom: 0,
                includeFontPadding: false,
                lineHeight: 22,
              }}
            />
            <TouchableOpacity onPress={handleSubmit}>
              <Ionicons name="search" size={24} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          {/* Quick Tags */}
          <View className="mt-8 px-4">
            <Text className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest mb-4 text-center">
              Popular Categories
            </Text>

            <View className="flex-row flex-wrap justify-center gap-3">
              {[
                {
                  name: "Nature",
                  icon: "leaf-outline",
                  color: "bg-emerald-50 dark:bg-emerald-900/20",
                  textColor: "text-emerald-600",
                },
                {
                  name: "Architecture",
                  icon: "business-outline",
                  color: "bg-blue-50 dark:bg-blue-900/20",
                  textColor: "text-blue-600",
                },
                {
                  name: "Travel",
                  icon: "airplane-outline",
                  color: "bg-orange-50 dark:bg-orange-900/20",
                  textColor: "text-orange-600",
                },
              ].map((tag) => (
                <TouchableOpacity
                  key={tag.name}
                  onPress={() => handleTagPress(tag.name)}
                  activeOpacity={0.7}
                  className={`${tag.color} flex-row items-center px-6 py-3 rounded-2xl border border-white/50 dark:border-slate-800 shadow-sm`}
                >
                  <Ionicons
                    name={tag.icon}
                    size={18}
                    color={tag.textColor.replace("text-", "")}
                  />
                  <Text
                    className={`${tag.textColor} font-extrabold text-base ml-2`}
                  >
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
