import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useRouter } from "expo-router";
import CollectionCard from "../../components/collection_card";
import {
  createCollection,
  getCollections,
} from "../../api/unsplash_collection";
import { ActivityIndicator } from "react-native";

export default function Collections() {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    setLoading(true);

    try {
      const data = await getCollections();
      setCollections(data);
    } catch (err) {
      console.error("Error");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCollections();
    }, []),
  );

  const handleCreateCollection = async () => {
    if (newTitle.trim().length === 0) {
      setHasError(true);
      return;
    }

    try {
      const savedCollection = await createCollection(newTitle);
      setCollections([savedCollection, ...collections]);
      setModalVisible(false);
      setNewTitle("");

      const url = `/search?collectionId=${savedCollection.id}&collectionName=${encodeURIComponent(savedCollection.name)}&query=${encodeURIComponent(savedCollection.name)}`;
      router.push(url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPhotosToCollection = (collection) => {
    const url = `/search?collectionId=${collection.id}&collectionName=${encodeURIComponent(collection.name)}&query=${encodeURIComponent(collection.name)}`;
    router.push(url);
  };

  return loading ? (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  ) : (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      <StatusBar style="auto" />
      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CollectionCard
            item={item}
            onPress={() => router.push(`/collections/${item.id}`)}
            onAddPhotos={() => handleAddPhotosToCollection(item)}
          />
        )}
        ListHeaderComponent={() => (
          <View className="items-center w-full mt-4 mb-8">
            <Text className="text-5xl font-black text-slate-900 dark:text-slate-50 mb-2 text-center py-2 leading-[56px]">
              Collections
            </Text>
            <Text className="text-lg text-slate-500 dark:text-slate-400 text-center leading-6">
              Explore the world through collections under the{" "}
              <Text className="font-bold underline text-slate-700 dark:text-slate-300">
                Unsplash license.
              </Text>
            </Text>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            className="mb-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] h-48 items-center justify-center bg-slate-50/30 dark:bg-slate-900/20"
          >
            <View className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm mb-2 border border-slate-100 dark:border-slate-700">
              <Ionicons
                name="add-outline"
                size={28}
                color={Platform.OS === "ios" ? "#0f172a" : "#94a3b8"}
                className="dark:text-slate-200"
              />
            </View>
            <Text className="text-slate-600 dark:text-slate-400 font-bold text-lg">
              Add New Collection
            </Text>
          </TouchableOpacity>
        }
        contentContainerStyle={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      />

      <Modal transparent={true} visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end bg-black/60"
        >
          <View className="bg-white dark:bg-slate-900 rounded-[40px] p-8 pb-10 mx-4 mb-10 shadow-2xl relative border border-transparent dark:border-slate-800">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-6 right-6 z-10 bg-slate-50 dark:bg-slate-800 p-2 rounded-full"
            >
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>

            <View className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full self-center mb-5" />

            <View className="items-center mb-5">
              <Text className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Add Collection
              </Text>
            </View>

            <TextInput
              placeholder="Title..."
              placeholderTextColor="#94a3b8"
              className="bg-slate-50 dark:bg-slate-800 px-5 py-6 rounded-2xl text-xl mb-8 text-slate-900 dark:text-slate-100 font-semibold border-1"
              value={newTitle}
              onChangeText={(text) => {
                setNewTitle(text);
                if (hasError) setHasError(false);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus
              style={{
                height: 48,
                fontSize: 18,
                fontWeight: "600",
                textAlignVertical: "center",
                paddingTop: 0,
                paddingBottom: 0,
                includeFontPadding: false,
                lineHeight: 22,
                borderColor: hasError
                  ? "#ef4444"
                  : isFocused
                    ? "#0f172a"
                    : "#f1f5f9",
                borderWidth: 1,
              }}
            />

            <TouchableOpacity
              onPress={handleCreateCollection}
              activeOpacity={0.8}
              className="bg-slate-900 dark:bg-blue-600 h-16 rounded-2xl items-center justify-center flex-row"
            >
              <Text className="text-white font-bold text-lg">
                Create Collection
              </Text>
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
