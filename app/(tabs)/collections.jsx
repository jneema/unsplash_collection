import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLLECTIONS_DATA = [
  {
    id: "1",
    title: "Minimalist Interiors",
    count: "1.2k photos",
    images: [
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400",
      "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200",
    ],
  },
  {
    id: "2",
    title: "Street Photography",
    count: "850 photos",
    images: [
      "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200",
    ],
  },
  {
    id: "3",
    title: "Street Photography",
    count: "850 photos",
    images: [
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400",
      "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=200",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200",
    ],
  },
  {
    id: "4",
    title: "Street Photography",
    count: "850 photos",
    images: [
      "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200",
    ],
  },
];

// Reusable Collection Card
const CollectionCard = ({ item }) => (
  <TouchableOpacity activeOpacity={0.9} className="mb-8">
    <View className="flex-row h-48 w-full overflow-hidden rounded-3xl bg-slate-100">
      <Image source={{ uri: item.images[0] }} className="flex-1 h-full mr-1" />
      <View className="w-1/3">
        <Image
          source={{ uri: item.images[1] }}
          className="flex-1 h-full mb-1"
        />
        <Image source={{ uri: item.images[2] }} className="flex-1 h-full" />
      </View>
    </View>
    <View className="mt-3 px-1">
      <Text className="text-xl font-bold text-slate-900">{item.title}</Text>
      <Text className="text-sm text-slate-500 font-medium">{item.count}</Text>
    </View>
  </TouchableOpacity>
);

// The "Add New" component moved to the footer
const AddCollectionFooter = () => (
  <TouchableOpacity
    activeOpacity={0.7}
    className="mb-12 border-2 border-dashed border-slate-200 rounded-3xl h-48 items-center justify-center bg-slate-50/30"
  >
    <View className="bg-white p-3 rounded-full shadow-sm mb-2 border border-slate-100">
      <Ionicons name="add-outline" size={28} color="#0f172a" />
    </View>
    <Text className="text-slate-600 font-bold text-lg">Add New Collection</Text>
    <Text className="text-slate-400 text-sm">
      Create a space for your favorites
    </Text>
  </TouchableOpacity>
);

export default function Collections() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={COLLECTIONS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CollectionCard item={item} />}
        // Header stays at the top
        ListHeaderComponent={() => (
          <View className="items-center w-full mt-4 mb-8">
            <Text className="text-5xl font-black text-slate-900 mb-2 text-center">
              Collections
            </Text>
            <Text className="text-lg text-slate-500 text-center leading-6">
              Explore the world through collections under the{" "}
              <Text className="font-bold underline text-slate-700">
                Unsplash license.
              </Text>
            </Text>
          </View>
        )}
        // "Add New" card stays at the very bottom
        ListFooterComponent={AddCollectionFooter}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
