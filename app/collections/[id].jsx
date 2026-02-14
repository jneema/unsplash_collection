import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Pressable,
  useColorScheme,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getCollectionImages,
  removeImageFromCollection,
  updateCollection,
  deleteFullCollection,
} from "../../api/unsplash_collection";
import { LinearGradient } from "expo-linear-gradient";
import PhotoItem from "../../components/photo_item";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 60) / 2;

export default function CollectionDetail() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";
  const [collection, setCollection] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newName, setNewName] = useState("");

  const renderItem = ({ item }) => (
    <PhotoItem
      item={item}
      width={COLUMN_WIDTH}
      isSelectionMode={isSelectionMode}
      isSelected={selectedIds.has(item.unsplash_id)}
      onLongPress={() => {
        setIsSelectionMode(true);
        toggleSelection(item.unsplash_id);
      }}
      onPress={() => {
        if (isSelectionMode) {
          toggleSelection(item.unsplash_id);
        } else {
          router.push(
            `/photos/${item.unsplash_id}?url=${encodeURIComponent(item.image_url)}`,
          );
        }
      }}
    />
  );

  const toggleSelection = (unsplashId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(unsplashId)) {
        next.delete(unsplashId);
      } else {
        next.add(unsplashId);
      }
      if (next.size === 0) setIsSelectionMode(false);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    try {
      const deletePromises = Array.from(selectedIds).map((uid) =>
        removeImageFromCollection(id, uid),
      );

      await Promise.all(deletePromises);

      setCollection((prev) => ({
        ...prev,
        images: prev.images.filter((img) => !selectedIds.has(img.unsplash_id)),
      }));
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Bulk delete failed", error);
      alert("Could not remove some images. Please try again.");
    }
  };

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

  const handleRename = async () => {
    try {
      await updateCollection(id, newName);
      setCollection((prev) => ({ ...prev, name: newName }));
      setIsRenameModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCollection = () => {
    Alert.alert(
      "Delete Collection",
      "Are you sure? This will remove all saved images in this collection.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteFullCollection(id);
            router.replace("/collections");
          },
        },
      ],
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
          colors={isDark ? ["#4c0519", "#0f172a"] : ["#FFE4E6", "#e2e8f0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>

      {/* 2. Content Layer */}
      <SafeAreaView className="flex-1" edges={["top"]}>
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
            <Text className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              {collection?.images?.length || 0}{" "}
              {collection?.images?.length === 1 ? "Photo" : "Photos"}
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
                    {/* Backdrop: covers the screen to catch taps outside the menu */}
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
                      style={{ elevation: 5, shadowOpacity: 0.2 }}
                      className="absolute right-0 top-14 w-48 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-2 z-[100]"
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setIsSelectionMode(true);
                          setShowMenu(false);
                        }}
                        className="flex-row items-center p-4 active:bg-slate-50 dark:active:bg-slate-800 rounded-2xl"
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

                      <TouchableOpacity
                        onPress={() => {
                          setShowMenu(false);
                          router.push({
                            pathname: "/search",
                            params: {
                              collectionId: id,
                              collectionName: collection?.name,
                            },
                          });
                        }}
                        className="flex-row items-center p-4 active:bg-slate-50 dark:active:bg-slate-800 rounded-2xl"
                      >
                        <Ionicons
                          name="add-circle-outline"
                          size={20}
                          color={isDark ? "#f1f5f9" : "#1e293b"}
                        />
                        <Text className="ml-3 font-semibold text-slate-900 dark:text-slate-50">
                          Add Photos
                        </Text>
                      </TouchableOpacity>
                      {/* Inside the Dropdown View */}
                      <TouchableOpacity
                        onPress={() => {
                          setShowMenu(false);
                          setNewName(collection?.name);
                          setIsRenameModalVisible(true);
                        }}
                        className="flex-row items-center p-4 active:bg-slate-50 dark:active:bg-slate-800 rounded-2xl"
                      >
                        <Ionicons
                          name="pencil-outline"
                          size={20}
                          color={isDark ? "#f1f5f9" : "#1e293b"}
                        />
                        <Text className="ml-3 font-semibold text-slate-900 dark:text-slate-50">
                          Edit Name
                        </Text>
                      </TouchableOpacity>

                      <View className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2" />

                      <TouchableOpacity
                        onPress={() => {
                          setShowMenu(false);
                          handleDeleteCollection();
                        }}
                        className="flex-row items-center p-4 active:bg-red-50 dark:active:bg-red-900/20 rounded-2xl"
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#ef4444"
                        />
                        <Text className="ml-3 font-semibold text-red-500">
                          Delete Collection
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
          data={collection?.images}
          numColumns={2}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({
            length: 276,
            offset: 276 * Math.floor(index / 2),
            index,
          })}
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
          renderItem={renderItem}
        />
        {isSelectionMode && (
          <View
            style={{ bottom: insets.bottom + 20 }}
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
                onPress={handleBulkDelete}
                className="bg-red-500 px-5 py-2 rounded-2xl"
              >
                <Text className="text-white font-bold">Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Modal visible={isRenameModalVisible} transparent animationType="fade">
          <View className="flex-1 bg-black/60 justify-center px-6">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="w-full"
            >
              <View className="w-full bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl">
                <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Rename Collection
                </Text>

                <View className="relative w-full mb-6">
                  <View className="flex-row items-center bg-white dark:bg-slate-900 rounded-3xl px-5 py-1.5 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none">
                    <TextInput
                      placeholder="Collection Name"
                      placeholderTextColor="#94a3b8"
                      className="flex-1 px-2 text-slate-800 dark:text-slate-100"
                      value={newName}
                      onChangeText={setNewName}
                      style={{
                        height: 52,
                        fontSize: 17,
                        fontWeight: "500",
                      }}
                    />
                  </View>
                </View>

                <View className="flex-row justify-end items-center">
                  <TouchableOpacity
                    onPress={() => setIsRenameModalVisible(false)}
                    className="px-6 py-3 mr-2"
                  >
                    <Text className="text-slate-500 font-bold">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleRename}
                    className="bg-blue-600 px-8 py-3 rounded-2xl"
                  >
                    <Text className="text-white font-bold text-lg">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
