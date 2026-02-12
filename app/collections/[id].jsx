import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 60) / 2;

export default function CollectionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const collection = {
    id,
    title: "Minimalist Interiors",
    count: "1.2k photos",
    description: "A curated collection of minimalist interior designs",
    photos: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=500",
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=500",
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500",
      },
      {
        id: "4",
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500",
      },
      {
        id: "5",
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500",
      },
    ],
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <StatusBar style="auto" />

      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="bg-slate-50 dark:bg-slate-900 p-3 rounded-full"
          >
            <Ionicons name="chevron-back" size={24} color="#64748b" />
          </Pressable>
          <Pressable className="bg-slate-50 dark:bg-slate-900 p-3 rounded-full">
            <Ionicons name="ellipsis-horizontal" size={24} color="#64748b" />
          </Pressable>
        </View>

        {/* Collection Info */}
        <View className="px-6 mb-6">
          <Text className="text-4xl font-black text-slate-900 dark:text-slate-50 mb-2 tracking-tight">
            {collection.title}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 font-medium">
            {collection.count}
          </Text>
          {collection.description && (
            <Text className="text-slate-600 dark:text-slate-400 mt-2 leading-6">
              {collection.description}
            </Text>
          )}
        </View>

        {/* Photos Grid */}
        <FlatList
          data={collection.photos}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 24,
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
                  `/photos/${item.id}?url=${encodeURIComponent(item.url)}`,
                )
              }
            >
              <Image
                source={{ uri: item.url }}
                style={{ width: COLUMN_WIDTH, height: 260 }}
                className="rounded-[24px] bg-slate-100 dark:bg-slate-800"
                resizeMode="cover"
              />
            </Pressable>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
