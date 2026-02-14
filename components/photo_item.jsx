import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Image, Pressable } from "react-native";

const PhotoItem = memo(
  ({ item, isSelected, isSelectionMode, onLongPress, onPress, width }) => {
    return (
      <Pressable
        onLongPress={onLongPress}
        onPress={onPress}
        className="mb-4 relative"
      >
        <Image

          source={{ uri: item.image_url }}
          style={{
            width: width,
            height: 260,
            opacity: isSelected ? 0.7 : 1,
          }}
          className={`rounded-[32px] bg-slate-100 dark:bg-slate-800 ${
            isSelected ? "border-4 border-blue-500" : ""
          }`}
        />

        {isSelectionMode && (
          <View className="absolute top-4 right-4">
            <View
              className={`p-1.5 rounded-full ${isSelected ? "bg-blue-500" : "bg-black/20 border border-white"}`}
            >
              <Ionicons
                name={isSelected ? "checkmark" : "ellipse-outline"}
                size={18}
                color="white"
              />
            </View>
          </View>
        )}
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isSelectionMode === nextProps.isSelectionMode
    );
  },
);

export default PhotoItem;
