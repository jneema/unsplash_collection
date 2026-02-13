import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Share,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  getPhotoDetails,
  trackPhotoDownload,
} from "../../api/unsplash_collection";

export default function PhotoDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#f1f5f9" : "#0f172a";

  const [isLiked, setIsLiked] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState(["Nature"]);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const collections = ["Nature", "Finland", "Winter", "Forest"];

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const data = await getPhotoDetails(id);
        setPhoto(data);
      } catch (err) {
        console.err("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const toggleCollection = (name) => {
    setSelectedCollections((prev) => {
      const newSelection = prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name];
      return newSelection;
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this photo by ${photo.user.name} on Unsplash`,
        url: photo.links.html,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      // 1. Permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need gallery access to save this masterpiece to your phone.",
        );
        setIsDownloading(false);
        return;
      }

      // 2. Define path
      const fileUri = `${FileSystem.cacheDirectory}${photo.id}.jpg`;

      // 3. Download
      const downloadResult = await FileSystem.downloadAsync(
        photo.urls.full,
        fileUri,
      );

      // 4. Save to Gallery
      if (downloadResult && downloadResult.uri) {
        const x = trackPhotoDownload(photo);

        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);

        Alert.alert(
          "Saved!",
          "The high-resolution photo is now in your gallery.",
          [{ text: "Awesome" }],
        );
      } else {
        throw new Error("Invalid URI");
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert(
        "Download Failed",
        "Something went wrong while fetching the high-res file. Check your internet connection.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return loading || !photo ? (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  ) : (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <StatusBar style="auto" />

      {/* HEADER */}
      <SafeAreaView className="absolute top-0 left-0 right-0 z-10 flex-row justify-between px-6">
        <Pressable
          onPress={() => router.back()}
          className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-full border border-slate-100 dark:border-slate-800"
        >
          <Ionicons name="chevron-back" size={24} color={iconColor} />
        </Pressable>
        <Pressable
          onPress={handleShare}
          className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-full border border-slate-100 dark:border-slate-800"
        >
          <Ionicons name="share-outline" size={24} color={iconColor} />
        </Pressable>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: photo.urls.regular }}
          className="w-full h-[500px]"
          resizeMode="cover"
          style={{ backgroundColor: photo.color }}
        />

        <View className="px-8 pt-8 pb-12 bg-white dark:bg-slate-950 -mt-12 rounded-t-[48px]">
          {/* TITLE & LIKE */}
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1">
              <Text className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter leading-none">
                {photo.description || photo.alt_description}
              </Text>
              <Text className="text-blue-500 font-bold mt-2">
                {photo.location.name}
              </Text>
            </View>
            <Pressable
              onPress={() => setIsLiked(!isLiked)}
              className={`p-4 rounded-3xl border ${isLiked ? "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800"}`}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={28}
                color={isLiked ? "#ef4444" : iconColor}
              />
            </Pressable>
          </View>

          {/* AUTHOR INFO */}
          <View className="flex-row items-center mb-5">
            <Image
              source={{ uri: photo.user.profile_image.medium }}
              className="w-12 h-12 rounded-full mr-4 bg-slate-200"
            />
            <View>
              <Text className="text-slate-900 dark:text-slate-100 font-black text-lg">
                {photo.user.name}
              </Text>
              <Text className="text-slate-400 dark:text-slate-500 font-medium text-sm">
                Published {new Date(photo.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* DOWNLOAD BUTTON */}
          <Pressable
            onPress={handleDownload}
            disabled={isDownloading}
            className={`${
              isDownloading ? "bg-blue-400" : "bg-blue-600"
            } h-16 rounded-2xl flex-row items-center justify-center mb-5 active:opacity-90`}
          >
            {isDownloading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="cloud-download" size={22} color="white" />
                <Text className="text-white font-black text-lg ml-2">
                  Download
                </Text>
              </>
            )}
          </Pressable>

          {/* COLLECTIONS MANAGEMENT */}
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-slate-900 dark:text-slate-100 font-black text-xl tracking-tight">
              Add to Collection
            </Text>
            <Pressable>
              <Text className="text-blue-500 font-bold text-sm">New +</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-8 px-8"
          >
            <View className="flex-row pr-16" style={{ gap: 8 }}>
              {collections.map((name) => {
                const isActive = selectedCollections.includes(name);
                return (
                  <Pressable
                    key={name}
                    onPress={() => toggleCollection(name)}
                    className={`flex-row items-center px-6 py-4 rounded-[24px] border ${
                      isActive
                        ? "bg-blue-600 border-blue-600"
                        : "bg-slate-50 border-slate-100 dark:bg-slate-900 dark:border-slate-800"
                    }`}
                  >
                    <Text
                      className={`font-bold ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {name}
                    </Text>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
