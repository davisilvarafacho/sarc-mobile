import "react-native-reanimated";

import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Button, Flex, NativeBaseProvider, Text } from "native-base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";

import { useColorScheme } from "@/hooks/useColorScheme";
import { theme } from "@/theme/native-base";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    Alliance: require("../assets/fonts/Lexend.ttf"),
    // Alliance: require("../assets/fonts/Alliance.otf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NativeBaseProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="sign-up" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="reset-password-code" />
          <Stack.Screen name="posts/[id]" />
          <Stack.Screen name="lugares" />
        </Stack>
      </QueryClientProvider>
    </NativeBaseProvider>
  );
}
