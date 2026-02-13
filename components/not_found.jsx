import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const NotFound = ({ name, size, color, query, onPress }) => {
  return (
    <View className="flex-1 items-center justify-center px-10 mb-20">
      <View className="bg-slate-50 dark:bg-slate-900 p-8 rounded-full mb-6">
        <Ionicons name={name} size={size} color={color} />
      </View>
      <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
        No results found
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-center mt-2 leading-6">
        We couldn't find anything for "{query}". Try a different keyword or
        check your spelling.
      </Text>
      <TouchableOpacity onPress={onPress} className="mt-8">
        <Text className="text-blue-500 font-bold text-lg">Clear Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotFound;
