import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CollectionCard({ item, onPress, onAddPhotos }) {
  const images = item.images || [];
  const hasImages = images.length > 0;

  const handleAddPress = (e) => {
    e.stopPropagation();
    onAddPhotos();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="mb-6 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-slate-200 dark:border-slate-800"
    >
      {/* Preview Section */}
      <View className="h-56 w-full relative">
        {hasImages ? (
          <>
            <Image
              source={{ uri: images[0].image_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <View className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 items-center justify-center">
            <View className="bg-white dark:bg-slate-700/50 p-6 rounded-3xl">
              <Ionicons name="images-outline" size={40} color="#cbd5e1" />
            </View>
            <Text className="text-slate-400 dark:text-slate-500 font-semibold text-sm mt-4">
              No photos yet
            </Text>
          </View>
        )}

        {/* Add Photos Button */}
        <TouchableOpacity
          onPress={handleAddPress}
          activeOpacity={0.8}
          className="absolute top-4 right-4 bg-blue-600 px-4 py-2.5 rounded-full flex-row items-center shadow-lg active:scale-95"
          style={{
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <Ionicons name="add-circle" size={18} color="white" />
          <Text className="text-white font-bold ml-1.5 text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View className="px-5 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text
              numberOfLines={1}
              className="text-xl font-black text-slate-900 dark:text-slate-50 mb-1"
            >
              {item.name}
            </Text>

            <View className="flex-row items-center">
              <View className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                <Text className="text-slate-600 dark:text-slate-400 font-bold text-xs">
                  {images.length} {images.length === 1 ? "photo" : "photos"}
                </Text>
              </View>
            </View>
          </View>

          {/* Chevron */}
          <View className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-full">
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
