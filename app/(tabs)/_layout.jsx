import { NativeTabs, Icon, Label, Badge } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="ic_menu_home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="collections">
        <Label>Collections</Label>
        <Icon
          sf="rectangle.stack.fill"
          drawable="ic_menu_gallery"
        />
        <Badge>3</Badge>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
