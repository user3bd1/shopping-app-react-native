import { UserInfo } from "@/types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NavList from "./nav";

export default function ProfileScreen() {
  const [user, setUser] = useState<UserInfo>();
  const [thema, setThema] = useState<string>("light");

  useEffect(() => {
    const fetchUserData = async () => {
      let userId = 0;
      const getUserId: string | null = await AsyncStorage.getItem("userId");
      if (getUserId != null) userId = parseInt(getUserId);

      const savedTheme = await AsyncStorage.getItem("thema");
      if (savedTheme) {
        setThema(savedTheme);
      }

      const usersApi = process.env.EXPO_PUBLIC_USERS;
      if (!usersApi) return undefined;
      const res = await fetch(usersApi);
      const data = await res.json();
      const allUsers: UserInfo[] = data;
      const foundUser = allUsers.find((p) => p.id === userId);

      if (!foundUser) Alert.alert("Couldn't fetch user data");
      else setUser(foundUser);
    };

    fetchUserData();
  }, []);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (!user) return;

      const updatedUser = {
        ...user,
        userImage: result.assets[0].uri,
      };

      const usersApi = process.env.EXPO_PUBLIC_USERS;
      if (!usersApi) return;

      const updateUserImage = await fetch(`${usersApi}/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!updateUserImage.ok) {
        Alert.alert("Failed to update database");
        return;
      }

      setUser(updatedUser);
      Alert.alert("Image has been edited successfully");
    }
  };

  const isDark = thema === "dark";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Profile
        </Text>

        <View style={styles.profileHeaderContainer}>
          <Pressable onPress={handlePickImage} style={styles.imageWrapper}>
            <Image
              source={{
                uri: user?.userImage
                  ? user.userImage
                  : "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-unknown-social-media-user-photo-default-avatar-profile-icon-vector-unknown-social-media-user-184816085.jpg",
              }}
              style={[styles.avatar, isDark && styles.avatarDark]}
            />
            <View
              style={[styles.cameraBadge, isDark && styles.cameraBadgeDark]}
            >
              <MaterialCommunityIcons
                name="camera"
                color={isDark ? "#121212" : "#FFFFFF"}
                size={14}
              />
            </View>
          </Pressable>
          <Text style={[styles.userName, isDark && styles.userNameDark]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.userEmail, isDark && styles.userEmailDark]}>
            {user?.email}
          </Text>
        </View>

        <View
          style={[styles.menuContainer, isDark && styles.menuContainerDark]}
        >
          <Pressable
            style={[styles.menuItem, isDark && styles.menuItemDark]}
            onPress={() => router.push("/components/EditProfileScreen")}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, isDark && styles.iconBoxDark]}>
                <MaterialCommunityIcons
                  name="account-outline"
                  color={isDark ? "#D0BCFF" : "#5B1D88"}
                  size={20}
                />
              </View>
              <Text style={[styles.menuText, isDark && styles.menuTextDark]}>
                My Profile
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              color={isDark ? "#A0A0A5" : "#8E8E93"}
              size={20}
            />
          </Pressable>

          <Pressable style={[styles.menuItem, isDark && styles.menuItemDark]}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, isDark && styles.iconBoxDark]}>
                <MaterialCommunityIcons
                  name="shopping-outline"
                  color={isDark ? "#D0BCFF" : "#5B1D88"}
                  size={20}
                />
              </View>
              <Text style={[styles.menuText, isDark && styles.menuTextDark]}>
                My Orders
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              color={isDark ? "#A0A0A5" : "#8E8E93"}
              size={20}
            />
          </Pressable>

          <Pressable
            style={[
              styles.menuItem,
              isDark && styles.menuItemDark,
              { borderBottomWidth: 0 },
            ]}
            onPress={() => router.push("/components/SettingsScreen")}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, isDark && styles.iconBoxDark]}>
                <MaterialCommunityIcons
                  name="cog-outline"
                  color={isDark ? "#D0BCFF" : "#5B1D88"}
                  size={20}
                />
              </View>
              <Text style={[styles.menuText, isDark && styles.menuTextDark]}>
                Settings
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              color={isDark ? "#A0A0A5" : "#8E8E93"}
              size={20}
            />
          </Pressable>
        </View>

        <Pressable
          style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
          onPress={() => console.log("Logged out")}
        >
          <MaterialCommunityIcons
            name="logout"
            color="#FF3B30"
            size={18}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>

      <NavList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 20,
  },
  headerTitleDark: {
    color: "#F4F4F4",
  },
  profileHeaderContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F2F2F7",
    borderWidth: 2,
    borderColor: "#5B1D88",
  },
  avatarDark: {
    backgroundColor: "#1E1E22",
    borderColor: "#D0BCFF",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#5B1D88",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  cameraBadgeDark: {
    backgroundColor: "#D0BCFF",
    borderColor: "#121212",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  userNameDark: {
    color: "#F4F4F4",
  },
  userEmail: {
    fontSize: 14,
    color: "#8E8E93",
  },
  userEmailDark: {
    color: "#A0A0A5",
  },
  menuContainer: {
    backgroundColor: "#F8F8FA",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EFEFF1",
  },
  menuContainerDark: {
    backgroundColor: "#1E1E22",
    borderColor: "#2C2C30",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF1",
  },
  menuItemDark: {
    borderBottomColor: "#2C2C30",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EAE2F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconBoxDark: {
    backgroundColor: "#2B223F",
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  menuTextDark: {
    color: "#E0E0E0",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1F0",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#FFD7D5",
  },
  logoutButtonDark: {
    backgroundColor: "#2A1818",
    borderColor: "#4A2222",
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 15,
    fontWeight: "600",
  },
});
