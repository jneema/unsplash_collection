import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 60) / 2;

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
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]); // Empty array initially

  const handleSearch = () => {
    if (query.trim().length === 0) return;
    Keyboard.dismiss();
    setIsSearching(true);

    // MOCK LOGIC: Simulate finding results or not
    if (query.toLowerCase() === "nothing") {
      setResults([]);
    } else {
      setResults([
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=500",
        },
        {
          id: "2",
          url: "https://images.unsplash.com/photo-1511497584788-876760111969?w=500",
        },
        {
          id: "3",
          url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=500",
        },
        {
          id: "4",
          url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500",
        },
        {
          id: "5",
          url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500",
        },
        {
          id: "6",
          url: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=500",
        },
        {
          id: "7",
          url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=500",
        },
      ]);
    }
  };

  const reset = () => {
    setIsSearching(false);
    setQuery("");
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      {/* --- HEADER SECTION --- */}
      {!isSearching ? (
        /* LANDING HEADER WITH BLOBS */
        <View className="absolute inset-0" pointerEvents="none">
          {BLOB_DATA.map((blob, i) => (
            <View
              key={i}
              className={`absolute rounded-full blur-[80px] ${blob.style}`}
            />
          ))}
        </View>
      ) : (
        /* RESULTS HEADER WITH GRADIENT */
        <View className="h-40 w-full relative">
          <LinearGradient
            colors={["#fbc2eb", "#a6c1ee"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute inset-0"
          />
        </View>
      )}

      <SafeAreaView
        className={isSearching ? "absolute top-0 w-full z-10" : "flex-1"}
      >
        <View
          className={isSearching ? "px-6 pt-2" : "flex-1 justify-center px-6"}
        >
          {!isSearching && (
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
          )}

          {/* SEARCH BAR (Shared Component) */}
          <View
            className={`flex-row items-center bg-white dark:bg-slate-900 rounded-[28px] px-4 py-1.5 border-2 border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-300 dark:shadow-none`}
          >
            {isSearching && (
              <TouchableOpacity onPress={reset} className="mr-2">
                <Ionicons name="arrow-back" size={24} color="#94a3b8" />
              </TouchableOpacity>
            )}
            <TextInput
              placeholder="Nature in Finland..."
              placeholderTextColor="#94a3b8"
              className="flex-1 px-3 text-slate-800 dark:text-slate-100"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
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
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons name="search" size={24} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          {!isSearching && (
            <View className="flex-row mt-6 justify-center space-x-2">
              {["Nature", "Architecture", "Travel"].map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => {
                    setQuery(tag);
                  }}
                  className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full"
                >
                  <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs">
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* --- CONTENT SECTION --- */}
      {isSearching && (
        <View className="flex-1">
          {results.length > 0 ? (
            <FlatList
              data={results}
              numColumns={2}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 10,
                paddingBottom: 40,
              }}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              renderItem={({ item }) => (
                <View className="mb-4">
                  <Image
                    source={{ uri: item.url }}
                    style={{ width: COLUMN_WIDTH, height: 260 }}
                    className="rounded-[32px] bg-slate-100 dark:bg-slate-800"
                  />
                </View>
              )}
            />
          ) : (
            /* EMPTY / NOT FOUND STATE */
            <View className="flex-1 items-center justify-center px-10 mb-20">
              <View className="bg-slate-50 dark:bg-slate-900 p-8 rounded-full mb-6">
                <Ionicons
                  name="cloud-offline-outline"
                  size={60}
                  color="#cbd5e1"
                />
              </View>
              <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
                No results found
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-center mt-2 leading-6">
                We couldn't find anything for "{query}". Try a different keyword
                or check your spelling.
              </Text>
              <TouchableOpacity onPress={reset} className="mt-8">
                <Text className="text-blue-500 font-bold text-lg">
                  Clear Search
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
