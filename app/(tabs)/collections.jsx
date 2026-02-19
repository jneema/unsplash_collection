import React, { useCallback, useState } from "react";
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
import { useDispatch } from "react-redux";
import { setCollectionsCount } from "../../store/appSlice";

export default function Collections() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [collections, setCollections] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [hasError, setHasError] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
      dispatch(setCollectionsCount(data.length));
    } catch (err) {
      console.error("Error");
    } finally {
      setInitialized(true);
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
      const updated = [savedCollection, ...collections];
      setCollections(updated);
      dispatch(setCollectionsCount(updated.length));
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

  return (
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
          !initialized ? null : (
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
          )
        }
        contentContainerStyle={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      />
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center px-6">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full"
          >
            <View className="w-full bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl">
              <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Add Collection
              </Text>

              <View className="relative w-full mb-6">
                <View className="flex-row items-center bg-white dark:bg-slate-900 rounded-3xl px-5 py-1.5 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none">
                  <TextInput
                    placeholder="Collection Name"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 px-2 text-slate-800 dark:text-slate-100"
                    value={newTitle}
                    onChangeText={(text) => {
                      setNewTitle(text);
                      if (hasError) setHasError(false);
                    }}
                    style={{
                      height: 52,
                      fontSize: 17,
                      fontWeight: "500",
                      borderColor: hasError ? "#ef4444" : "#f1f5f9",
                    }}
                  />
                </View>
              </View>

              <View className="flex-row justify-end items-center">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="px-6 py-3 mr-2"
                >
                  <Text className="text-slate-500 font-bold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCreateCollection}
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
  );
}
