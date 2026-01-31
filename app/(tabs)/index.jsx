import React from "react";
import { 
  Text, 
  View, 
  TextInput, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard 
} from "react-native";

const BLOB_DATA = [
  { style: "left-8 top-24 w-20 h-32 bg-blue-100 opacity-30" },
  { style: "right-6 top-32 w-24 h-36 bg-pink-100 opacity-25" },
];

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Background Blobs */}
      <View className="absolute inset-0" pointerEvents="none">
        {BLOB_DATA.map((blob, i) => (
          <View key={i} className={`absolute rounded-3xl ${blob.style}`} />
        ))}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-8">
            <View className="items-center w-full">
              <Text className="text-5xl font-black text-slate-900 mb-2">Search</Text>
              <Text className="text-lg text-slate-500 text-center mb-10">
                Discover high-resolution images
              </Text>

              {/* Input Container */}
              <View className="w-full shadow-xl shadow-slate-200 bg-white rounded-3xl">
                <TextInput
                  placeholder="Try 'Mountain'..."
                  placeholderTextColor="#94a3b8"
                  className="w-full px-6 py-5 text-lg text-slate-800"
                  returnKeyType="search"
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}