import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Pressable,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import PhotoItem from "../../components/photo_item";
import { toggleLikePhoto } from "../../store/appSlice";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 60) / 2;

export default function LikedPhotos() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const isDark = colorScheme === "dark";

  const likedPhotos = useSelector((state) => state.app.likedPhotos);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const toggleSelection = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      if (next.size === 0) setIsSelectionMode(false);
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = likedPhotos.map((p) => p.unsplash_id || p.id);
    setSelectedIds(new Set(allIds));
    setIsSelectionMode(true);
    setShowMenu(false);
  };

  const handleBulkUnlike = () => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      "Remove Likes",
      `Remove ${selectedIds.size} photos from your favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            selectedIds.forEach((id) => {
              const photo = likedPhotos.find(
                (p) => (p.unsplash_id || p.id) === id,
              );
              if (photo) dispatch(toggleLikePhoto(photo));
            });
            setSelectedIds(new Set());
            setIsSelectionMode(false);
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => {
    const itemId = item.unsplash_id || item.id;
    return (
      <PhotoItem
        item={item}
        width={COLUMN_WIDTH}
        isSelectionMode={isSelectionMode}
        isSelected={selectedIds.has(itemId)}
        onLongPress={() => {
          setIsSelectionMode(true);
          toggleSelection(itemId);
        }}
        onPress={() => {
          if (isSelectionMode) {
            toggleSelection(itemId);
          } else {
            router.push(
              `/photos/${itemId}?url=${encodeURIComponent(item.image_url)}`,
            );
          }
        }}
      />
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <View
        style={{
          height: insets.top + 56,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <LinearGradient
          colors={isDark ? ["#1e1b4b", "#0f172a"] : ["#E0E7FF", "#f1f5f9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>

      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header Bar */}
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
            <Text className="text-3xl font-bold text-slate-900 dark:text-slate-50 text-center">
              Likes
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase">
              {likedPhotos.length}{" "}
              {likedPhotos.length === 1 ? "Photo" : "Photos"}
            </Text>
          </View>

          <View className="relative z-50">
            {isSelectionMode ? (
              <TouchableOpacity
                onPress={() => {
                  setIsSelectionMode(false);
                  setSelectedIds(new Set());
                }}
                className="bg-blue-500/10 px-4 py-2 rounded-full"
              >
                <Text className="text-blue-500 font-bold">Done</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Pressable
                  onPress={() => setShowMenu(!showMenu)}
                  className="bg-white/30 dark:bg-white/10 p-2.5 rounded-full"
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    color={isDark ? "#f1f5f9" : "#1e293b"}
                  />
                </Pressable>

                {showMenu && (
                  <>
                    <Pressable
                      style={{
                        position: "absolute",
                        top: -100,
                        right: -100,
                        width: width,
                        height: 1000,
                      }}
                      onPress={() => setShowMenu(false)}
                    />
                    <View
                      style={{ elevation: 5 }}
                      className="absolute right-0 top-14 w-48 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-2 z-[100]"
                    >
                      <TouchableOpacity
                        onPress={handleSelectAll}
                        className="flex-row items-center p-4 active:bg-slate-50 rounded-2xl"
                      >
                        <Ionicons
                          name="checkmark-done-circle-outline"
                          size={20}
                          color={isDark ? "#f1f5f9" : "#1e293b"}
                        />
                        <Text className="ml-3 font-semibold text-slate-900 dark:text-slate-50">
                          Select All
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setIsSelectionMode(true);
                          setShowMenu(false);
                        }}
                        className="flex-row items-center p-4 active:bg-slate-50 rounded-2xl"
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={20}
                          color={isDark ? "#f1f5f9" : "#1e293b"}
                        />
                        <Text className="ml-3 font-semibold text-slate-900 dark:text-slate-50">
                          Select Photos
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </View>

        <FlatList
          data={likedPhotos}
          numColumns={2}
          keyExtractor={(item) => (item.unsplash_id || item.id).toString()}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 10,
            paddingBottom: 100,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
          }}
          renderItem={renderItem}
        />

        {/* Action Bar (Borrowed from Collections) */}
        {isSelectionMode && (
          <View
            style={{ bottom: insets.bottom + 60 }}
            className="absolute left-6 right-6 bg-slate-900 dark:bg-slate-800 h-16 rounded-3xl flex-row items-center justify-between px-6 shadow-2xl"
          >
            <Text className="text-white font-bold">
              {selectedIds.size} selected
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  setIsSelectionMode(false);
                  setSelectedIds(new Set());
                }}
                className="mr-6"
              >
                <Text className="text-slate-400 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBulkUnlike}
                className="bg-red-500 px-5 py-2 rounded-2xl"
              >
                <Text className="text-white font-bold">Unlike</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
