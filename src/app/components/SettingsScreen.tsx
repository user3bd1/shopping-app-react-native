import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  const [thema, setThema] = useState<string>("");

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("thema");
      if (savedTheme) setThema(savedTheme);
    };
    loadTheme();
  }, []);

  const changeThema = async (thema1: string) => {
    await AsyncStorage.setItem("thema", thema1);
    setThema(thema1);
  };

  const isDark = thema === "dark";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={20}
          color={isDark ? "#D0BCFF" : "#5B1D88"}
        />
        <Text style={[styles.backText, isDark && styles.backTextDark]}>
          Back
        </Text>
      </Pressable>

      <Text style={[styles.title, isDark && styles.titleDark]}>Settings</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        Appearance & Theme
      </Text>

      <View style={[styles.card, isDark && styles.cardDark]}>
        <Pressable
          style={[
            styles.themeOption,
            thema === "light" &&
              (isDark ? styles.activeOptionDark : styles.activeOption),
          ]}
          onPress={() => changeThema("light")}
        >
          <View style={styles.optionLeft}>
            <MaterialCommunityIcons
              name="white-balance-sunny"
              size={22}
              color={
                thema === "light"
                  ? isDark
                    ? "#D0BCFF"
                    : "#5B1D88"
                  : isDark
                    ? "#999"
                    : "#888"
              }
            />
            <Text
              style={[
                styles.optionText,
                isDark && styles.optionTextDark,
                thema === "light" &&
                  (isDark ? styles.activeTextDark : styles.activeText),
              ]}
            >
              Light Theme
            </Text>
          </View>

          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={
              thema === "light"
                ? isDark
                  ? "#D0BCFF"
                  : "#5B1D88"
                : isDark
                  ? "#555"
                  : "#888"
            }
          />
        </Pressable>

        <Pressable
          style={[
            styles.themeOption,
            thema === "dark" &&
              (isDark ? styles.activeOptionDark : styles.activeOption),
          ]}
          onPress={() => changeThema("dark")}
        >
          <View style={styles.optionLeft}>
            <MaterialCommunityIcons
              name="moon-waning-crescent"
              size={22}
              color={
                thema === "dark"
                  ? isDark
                    ? "#D0BCFF"
                    : "#5B1D88"
                  : isDark
                    ? "#999"
                    : "#888"
              }
            />
            <Text
              style={[
                styles.optionText,
                isDark && styles.optionTextDark,
                thema === "dark" &&
                  (isDark ? styles.activeTextDark : styles.activeText),
              ]}
            >
              Dark Theme
            </Text>
          </View>

          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={
              thema === "dark"
                ? isDark
                  ? "#D0BCFF"
                  : "#5B1D88"
                : isDark
                  ? "#555"
                  : "#888"
            }
          />
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
  containerDark: {
    backgroundColor: "#121212",
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
  backTextDark: {
    color: "#D0BCFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  titleDark: {
    color: "#F4F4F4",
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 20,
  },
  subtitleDark: {
    color: "#A0A0A5",
  },
  card: {
    backgroundColor: "#F8F8FA",
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#EFEFF1",
  },
  cardDark: {
    backgroundColor: "#1E1E22",
    borderColor: "#2C2C30",
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
  activeOptionDark: {
    backgroundColor: "#2B223F",
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
  optionTextDark: {
    color: "#E0E0E0",
  },
  activeText: {
    color: "#5B1D88",
    fontWeight: "bold",
  },
  activeTextDark: {
    color: "#D0BCFF",
    fontWeight: "bold",
  },
});
