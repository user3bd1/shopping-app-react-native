import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

interface navBarItems {
  id: number;
  router: string;
  iconName: string;
  iconOutline: string;
  activeTab: boolean;
}

const navItems: navBarItems[] = [
  {
    id: 1,
    router: "home",
    iconName: "home",
    iconOutline: "home-outline",
    activeTab: true,
  },
  {
    id: 2,
    router: "wishList",
    iconName: "heart",
    iconOutline: "heart-outline",
    activeTab: false,
  },
  {
    id: 3,
    router: "orders",
    iconName: "bag-handle",
    iconOutline: "bag-handle-outline",
    activeTab: false,
  },
  {
    id: 4,
    router: "profile",
    iconName: "person",
    iconOutline: "person-outline",
    activeTab: false,
  },
];

export default function NavList() {
  const [thema, setThema] = useState<string>("light");

  useEffect(() => {
    const fetchTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("thema");
      if (savedTheme) {
        setThema(savedTheme);
      }
    };
    fetchTheme();
  }, []);

  const isDark = thema === "dark";

  const renderNavItem = ({ item }: { item: navBarItems }) => {
    const pathname = usePathname();
    const isActive = pathname === `/components/${item.router}`;

    return (
      <Link href={`/components/${item.router}` as any} asChild>
        <TouchableOpacity
          style={StyleSheet.flatten([
            styles.navItem,
            isDark && styles.navItemDark,
            isActive &&
              (isDark ? styles.activeNavItemDark : styles.activeNavItem),
          ])}
          activeOpacity={0.7}
        >
          <Ionicons
            name={
              (isActive
                ? item.iconName
                : item.iconOutline) as keyof typeof Ionicons.glyphMap
            }
            size={20}
            color={
              isActive
                ? isDark
                  ? "#D0BCFF"
                  : "#5B1D88"
                : isDark
                  ? "#A0A0A5"
                  : "#495057"
            }
          />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        isDark && styles.containerDark,
      ])}
    >
      <FlatList
        data={navItems}
        renderItem={renderNavItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    borderTopWidth: 1,
    borderTopColor: "#f1f3f5",
    width: 360,
    left: -20,
    borderColor: "#000",
  },
  containerDark: {
    backgroundColor: "#121212",
    borderTopColor: "#2C2C30",
  },
  listContainer: {
    paddingHorizontal: 40,
    paddingVertical: 25,
    alignItems: "center",
    gap: 8,
    marginLeft: 7,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginBottom: 30,
    marginLeft: 1,
  },
  navItemDark: {
    backgroundColor: "#1E1E22",
    borderColor: "#2C2C30",
  },
  activeNavItem: {
    backgroundColor: "#EAE2F8",
    borderColor: "#5B1D88",
  },
  activeNavItemDark: {
    backgroundColor: "#2B223F",
    borderColor: "#D0BCFF",
  },
});
