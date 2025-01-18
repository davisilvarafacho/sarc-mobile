import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Box } from "native-base";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          paddingTop: 7,
          backgroundColor: "#042222",
        },
      }}
    >
      <Tabs.Screen
        name="blog"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "newspaper" : "newspaper-outline"}
              color={focused ? "#FFFFFF" : color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="schedule"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "calendar" : "calendar-outline"}
              color={focused ? "#FFFFFF" : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Box
              style={{
                width: 52,
                height: 52,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#03624C",
                backgroundColor: "#03624C",
                position: "absolute",
                paddingTop: 10,
                paddingStart: 11,
                bottom: 14,
              }}
            >
              <TabBarIcon
                name={focused ? "map" : "map-outline"}
                color={focused ? "#FFFFFF" : color}
              />
            </Box>
          ),
        }}
      />

      <Tabs.Screen
        name="eletric-cars"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <>
              {/* <TabBarIcon name="heart" color={focused ? "#FFFFFF" : color} /> */}
              <FontAwesome
                name="heartbeat"
                size={24}
                color={focused ? "#FFFFFF" : color}
              />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={focused ? "#FFFFFF" : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
