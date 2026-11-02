import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.replace("/components/profile")}
      >
        <MaterialCommunityIcons name="arrow-left" size={20} color="#5B1D88" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Appearance & Theme</Text>

      <View style={styles.card}>
        <Pressable
          style={[styles.themeOption, theme === "light" && styles.activeOption]}
          onPress={() => setTheme("light")}
        >
          <View style={styles.optionLeft}>
            <MaterialCommunityIcons
              name="white-balance-sunny"
              size={22}
              color={theme === "light" ? "#5B1D88" : "#8E8E93"}
            />
            <Text
              style={[
                styles.optionText,
                theme === "light" && styles.activeText,
              ]}
            >
              Light Theme
            </Text>
          </View>
          {theme === "light" && (
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#5B1D88"
            />
          )}
        </Pressable>

        <Pressable
          style={[styles.themeOption, theme === "dark" && styles.activeOption]}
          onPress={() => setTheme("dark")}
        >
          <View style={styles.optionLeft}>
            <MaterialCommunityIcons
              name="moon-waning-crescent"
              size={22}
              color={theme === "dark" ? "#5B1D88" : "#8E8E93"}
            />
            <Text
              style={[styles.optionText, theme === "dark" && styles.activeText]}
            >
              Dark Theme
            </Text>
          </View>
          {theme === "dark" && (
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#5B1D88"
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 16,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5B1D88",
    marginLeft: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F8F8FA",
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#EFEFF1",
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    marginVertical: 4,
  },
  activeOption: {
    backgroundColor: "#EAE2F8",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 15,
    color: "#1C1C1E",
    fontWeight: "500",
    marginLeft: 12,
  },
  activeText: {
    color: "#5B1D88",
    fontWeight: "bold",
  },
});
