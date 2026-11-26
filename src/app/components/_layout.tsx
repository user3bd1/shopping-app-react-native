import { Stack } from "expo-router";
import { ThemeProvider } from "../../context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="components/(tabs)" />
        <Stack.Screen name="components/EditProfileScreen" />
        <Stack.Screen name="components/ProductInfoScreen" />
        <Stack.Screen name="components/ProductsByTitleScreen" />
        <Stack.Screen name="components/SettingsScreen" />
        <Stack.Screen name="components/register" />
      </Stack>
    </ThemeProvider>
  );
}
