import { useEffect } from "react";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useFonts } from "expo-font";
import { Prompt_400Regular } from "@expo-google-fonts/prompt/400Regular";
import { Prompt_500Medium } from "@expo-google-fonts/prompt/500Medium";
import { Prompt_600SemiBold } from "@expo-google-fonts/prompt/600SemiBold";
import { Prompt_700Bold } from "@expo-google-fonts/prompt/700Bold";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { migrateDatabase } from "@/infrastructure/database/migrations";
import { colors } from "@/theme";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Prompt_400Regular,
    Prompt_500Medium,
    Prompt_600SemiBold,
    Prompt_700Bold,
  });
  const ready = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="findmycar.db" onInit={migrateDatabase}>
      <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="parking" />
        </Stack>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
