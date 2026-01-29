import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs disableTransparentOnScrollEdge={false}>
        <NativeTabs.Trigger name="home">
          <Label>Home</Label>
          <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="collections">
          <Label>Collections</Label>
          <Icon sf={{ default: 'rectangle.stack', selected: 'rectangle.stack.fill' }} />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // 2. Clean Android Material Implementation
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          elevation: 8, // Standard Android shadow
          height: 70,   // Taller bar for Material look
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Collections",
          tabBarIcon: ({ color, size }) => (  
            <Ionicons name="albums-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
