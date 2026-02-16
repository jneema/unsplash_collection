import {
  NativeTabs,
  Icon,
  Label,
  Badge,
} from "expo-router/unstable-native-tabs";
import { useSelector } from "react-redux";

export default function TabLayout() {
  const collectionsCount = useSelector((state) => state.app.collectionsCount);
  const likedPhotos = useSelector((state) => state.app.likedPhotos);

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="ic_menu_home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="collections">
        <Label>Collections</Label>
        <Icon sf="rectangle.stack.fill" drawable="ic_menu_archive" />
        {collectionsCount > 0 && (
          <Badge>{collectionsCount.toString()}</Badge>
        )}{" "}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="likes">
        <Label>Likes</Label>
        <Icon sf="heart.fill" drawable="btn_star" />
        {likedPhotos.length > 0 && (
          <Badge>
            {likedPhotos.length > 99 ? "99+" : likedPhotos.length.toString()}
          </Badge>
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf="gearshape.fill" drawable="ic_settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
