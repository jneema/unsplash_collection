import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const INITIAL_DATA = [
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
];

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

export default function Collections() {
  const [collections, setCollections] = useState(INITIAL_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const handleCreateCollection = () => {
    // FIX: Added return statement so empty collections aren't created
    if (newTitle.trim().length === 0) {
      setHasError(true);
      return;
    }

    const newCollection = {
      id: Date.now().toString(),
      title: newTitle,
      count: "0 photos",
      images: [
        "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400",
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=200",
        "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=200",
      ],
    };

    setCollections([newCollection, ...collections]);
    setHasError(false);
    setNewTitle("");
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CollectionCard item={item} />}
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
        ListFooterComponent={
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            className="mb-12 border-2 border-dashed border-slate-200 rounded-3xl h-48 items-center justify-center bg-slate-50/30"
          >
            <View className="bg-white p-3 rounded-full shadow-sm mb-2 border border-slate-100">
              <Ionicons name="add-outline" size={28} color="#0f172a" />
            </View>
            <Text className="text-slate-600 font-bold text-lg">
              Add New Collection
            </Text>
          </TouchableOpacity>
        }
        contentContainerStyle={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end bg-black/40"
        >
          <View className="bg-white rounded-[40px] p-8 pb-10 mx-4 mb-10 shadow-2xl relative">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-6 right-6 z-10 bg-slate-50 p-2 rounded-full"
            >
              <Ionicons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>

            <View className="w-12 h-1 bg-slate-100 rounded-full self-center mb-5" />

            <View className="items-center mb-5">
              <Text className="text-3xl font-black text-slate-900 tracking-tight">
                Add Collection
              </Text>
            </View>

            <TextInput
              className={`bg-slate-50 px-5 py-6 rounded-2xl text-xl mb-8 text-slate-900 font-semibold border-2 ${
                hasError
                  ? "border-red-500"
                  : isFocused
                    ? "border-slate-900"
                    : "border-slate-100"
              }`}
              style={{ minHeight: 70 }}
              placeholder="Title..."
              placeholderTextColor="#cbd5e1"
              value={newTitle}
              onChangeText={(text) => {
                setNewTitle(text);
                if (hasError) setHasError(false);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus
              autoCapitalize="sentences"
              selectionColor="#0f172a"
            />
            <TouchableOpacity
              onPress={handleCreateCollection}
              activeOpacity={0.8}
              className="bg-slate-900 h-16 rounded-2xl items-center justify-center flex-row"
            >
              <Text className="text-white font-bold text-lg mr-2">
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
