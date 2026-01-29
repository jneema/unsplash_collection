import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

const TabsLayout = () => {
  // Fallback to standard Tabs for Android if desired,
  // as Liquid Glass is an iOS-specific feature
  return (
    <NativeTabs
      // Allows content to scroll behind the bar for the glass effect
      disableTransparentOnScrollEdge={false}
    >
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        {/* Use 'sf' for Apple's SF Symbols to get the most native look */}
        <Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="collections">
        <Label>Collections</Label>
        <Icon
          sf={{ default: "rectangle.stack", selected: "rectangle.stack.fill" }}
          md="collections"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabsLayout;
