import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  Pressable,
  useColorScheme,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getCollectionImages } from "../../api/unsplash_collection";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 60) / 2;

export default function CollectionDetail() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";
  const [collection, setCollection] = useState(null);

  const fetchImages = async (id) => {
    try {
      const res = await getCollectionImages(id);
      setCollection(res);
    } catch (error) {
      console.error("Failed to get images", error);
    }
  };

  useEffect(() => {
    fetchImages(id);
  }, [id]);

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      {/* 1. Background Gradient Layer */}
      <View
        style={{
          height: insets.top + 56, // Increased height to accommodate title + count
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <LinearGradient
          colors={isDark ? ["#4c0519", "#0f172a"] : ["#FFE4E6", "#e2e8f0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>

      {/* 2. Content Layer */}
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Navigation & Title Row */}
        <View className="flex-row items-center justify-between px-6 h-16">
          <Pressable
            onPress={() => router.back()}
            className="bg-white/30 dark:bg-white/10 p-2.5 rounded-full"
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={isDark ? "#f1f5f9" : "#1e293b"}
            />
          </Pressable>

          <View className="flex-1 items-center px-4">
            <Text
              numberOfLines={1}
              className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight text-center"
            >
              {collection?.name || "Collection"}
            </Text>
            {/* Subtitle count inside the gradient area */}
            <Text className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              {collection?.images?.length || 0}{" "}
              {collection?.images?.length === 1 ? "Photo" : "Photos"}
            </Text>
          </View>

          <Pressable className="bg-white/30 dark:bg-white/10 p-2.5 rounded-full">
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={isDark ? "#f1f5f9" : "#1e293b"}
            />
          </Pressable>
        </View>

        {/* Photos Grid - Added marginTop to push it below the gradient header */}
        <FlatList
          data={collection?.images}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 10,
            paddingBottom: 40,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push(
                  `/photos/${item.unsplash_id}?url=${encodeURIComponent(item.image_url)}`,
                )
              }
            >
              <Image
                source={{ uri: item.image_url }}
                style={{ width: COLUMN_WIDTH, height: 260 }}
                className="rounded-[32px] bg-slate-100 dark:bg-slate-800"
                resizeMode="cover"
              />
            </Pressable>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
