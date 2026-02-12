import { Image, Text } from "react-native";
import { TouchableOpacity, View } from "react-native";

const CollectionCard = ({ item, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    className="mb-8"
    onPress={() => onPress(item)}
  >
    <View className="flex-row h-48 w-full overflow-hidden rounded-[32px] bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-800">
      <Image source={{ uri: item.images[0] }} className="flex-1 h-full mr-1" />
      <View className="w-1/3">
        <Image
          source={{ uri: item.images[1] }}
          className="flex-1 h-full mb-1"
        />
        <Image source={{ uri: item.images[2] }} className="flex-1 h-full" />
      </View>
    </View>
    <View className="mt-4 px-1">
      <Text className="text-xl font-bold text-slate-900 dark:text-slate-100">
        {item.title}
      </Text>
      <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
        {item.count}
      </Text>
    </View>
  </TouchableOpacity>
);

export default CollectionCard;
