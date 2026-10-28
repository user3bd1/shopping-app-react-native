import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

interface navBarItems {
  id: number;
  router: string;
  iconName: string;
  iconOutline: string;
  activeTab: boolean;
}
[, "wishList", "orders", "profile"];
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
  const renderNavItem = ({ item }: { item: navBarItems }) => {
    const pathname = usePathname();
    const isActive = pathname === `/components/${item.router}`;

    return (
      <Link href={`/components/${item.router}` as any} asChild>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons
            name={
              (isActive
                ? item.iconName
                : item.iconOutline) as keyof typeof Ionicons.glyphMap
            }
            size={20}
            color={isActive ? "#5B1D88" : "#495057"}
          />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
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
  activeNavItem: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",

    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 6,
  },
  navText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  activeNavText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
