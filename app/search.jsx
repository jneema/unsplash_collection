import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Keyboard,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  search,
  addImageToCollection,
  getCollectionImages,
} from "../api/unsplash_collection";
import NotFound from "../components/not_found";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 60) / 2;

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const initialSearchDone = useRef(false);

  const targetCollectionId = params.collectionId || null;
  const collectionName = params.collectionName || "";
  const initialQuery = params.query || "";
  const [committedQuery, setCommittedQuery] = useState(initialQuery || "");

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isSyncingCollection, setIsSyncingCollection] =
    useState(!!targetCollectionId);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [addedPhotos, setAddedPhotos] = useState(new Set());

  useEffect(() => {
    const syncAndSearch = async () => {
      let currentIds = new Set();
      if (targetCollectionId) {
        setIsSyncingCollection(true);
        try {
          const existingImages = await getCollectionImages(targetCollectionId);
          currentIds = new Set(existingImages.map((img) => img.unsplash_id));
          setAddedPhotos(currentIds);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSyncingCollection(false);
        }
      }
      if (initialQuery && !initialSearchDone.current) {
        initialSearchDone.current = true;
        handleSearch(initialQuery, true, currentIds);
      }
    };
    syncAndSearch();
  }, [targetCollectionId]);

  const handleSearch = async (
    searchQuery,
    isNewSearch = true,
    currentKnownIds = addedPhotos,
  ) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    Keyboard.dismiss();

    if (isNewSearch) {
      setCommittedQuery(trimmedQuery);
      setPage(1);
    }

    isNewSearch ? setIsLoading(true) : setLoadingMore(true);

    try {
      const data = await search(trimmedQuery, isNewSearch ? 1 : page + 1);

      let newPhotos = data.results || [];

      if (targetCollectionId) {
        newPhotos = newPhotos.filter((p) => !currentKnownIds.has(p.id));
      }

      setResults((prev) => (isNewSearch ? newPhotos : [...prev, ...newPhotos]));

      if (!isNewSearch) setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  const handlePhotoPress = async (photo) => {
    if (targetCollectionId) {
      try {
        await addImageToCollection(targetCollectionId, {
          unsplash_id: photo.id,
          image_url: photo.urls.regular,
          download_location: photo.links.download_location,
        });
        setAddedPhotos((prev) => new Set(prev).add(photo.id));
      } catch (err) {
        if (err.response?.status === 503) {
          alert("Unsplash servers are busy. Please try again in a moment.");
        } else if (err.response?.status === 403) {
          alert("Rate limit exceeded. Try again in an hour.");
        } else {
          alert("Could not add to collection.");
        }
        console.error(err);
      }
    } else {
      router.push(`/photos/${photo.id}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: insets.top + (targetCollectionId ? 100 : 70),
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["#fbc2eb", "#a6c1ee"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>

      <SafeAreaView
        edges={["top"]}
        style={{ marginTop: -(insets.top + (targetCollectionId ? 95 : 35)) }}
      >
        <View className="px-6 pt-2">
          {targetCollectionId && (
            <View className="flex-row items-center justify-between h-12 mb-5">
              <Pressable
                onPress={handleBack}
                className="bg-white/40 active:bg-white/60 p-2 rounded-full"
              >
                <Ionicons name="chevron-back" size={24} color="#1e293b" />
              </Pressable>
              <Text className="text-4xl font-bold text-slate-900 tracking-tight">
                Add to {collectionName || "Collection"}
              </Text>
              <View className="w-10" />
            </View>
          )}

          <View
            style={{
              elevation: 10,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10,
              shadowOffset: { height: 5, width: 0 },
            }}
            className="flex-row items-center bg-white dark:bg-slate-900 rounded-xl px-4 py-1.5 border-2 border-white dark:border-slate-800"
          >
            {!targetCollectionId && (
              <TouchableOpacity onPress={handleBack} className="mr-2">
                <Ionicons name="arrow-back" size={24} color="#94a3b8" />
              </TouchableOpacity>
            )}
            {committedQuery ? (
              <View className="flex-1 flex-row items-center">
                <View className="flex-row items-center bg-blue-100 px-3 py-1.5 rounded-full">
                  <Text className="text-blue-700 font-semibold mr-2">
                    {committedQuery}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      setCommittedQuery("");
                      setQuery("");
                      setResults([]);
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={16} color="#1d4ed8" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TextInput
                placeholder="Search Unsplash..."
                placeholderTextColor="#94a3b8"
                className="flex-1 px-3 text-slate-800 dark:text-slate-100 font-semibold"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => handleSearch(query)}
                returnKeyType="search"
                style={{ height: 48, fontSize: 18 }}
              />
            )}

            <TouchableOpacity onPress={() => handleSearch(query)}>
              <Ionicons name="search" size={24} color="#cbd5e1" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <View className="flex-1">
        {isLoading || isSyncingCollection ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#a6c1ee" />
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            numColumns={2}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 40,
            }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => {
              const isAdded = addedPhotos.has(item.id);

              return (
                <TouchableOpacity
                  className="mb-4 relative"
                  activeOpacity={0.9}
                  onPress={() => handlePhotoPress(item)}
                >
                  <Image
                    source={{ uri: item.urls.regular }}
                    style={{ width: COLUMN_WIDTH, height: 260 }}
                    className="rounded-[32px] bg-slate-100 dark:bg-slate-800"
                  />

                  {targetCollectionId && (
                    <View
                      className="absolute top-4 right-4"
                      style={{
                        elevation: 5,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                      }}
                    >
                      <View
                        className={`${isAdded ? "bg-green-500" : "bg-blue-600"} p-2.5 rounded-full`}
                      >
                        <Ionicons
                          name={isAdded ? "checkmark" : "add"}
                          size={18}
                          color="white"
                        />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
            onEndReachedThreshold={0.5}
            onEndReached={() => !loadingMore && handleSearch(query, false)}
            ListFooterComponent={() =>
              loadingMore ? (
                <ActivityIndicator
                  size="small"
                  color="#a6c1ee"
                  className="my-4"
                />
              ) : null
            }
          />
        ) : (
          <NotFound
            name="cloud-offline-outline"
            size={60}
            color="#cbd5e1"
            query={query}
            onPress={handleBack}
          />
        )}
      </View>
    </View>
  );
}
