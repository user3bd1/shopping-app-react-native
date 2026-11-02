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

  useEffect(() => {
    const fetchUserData = async () => {
      let userId = 0;
      const getUserId: string | null = await AsyncStorage.getItem("userId");
      if (getUserId != null) userId = parseInt(getUserId);

      const usersApi = process.env.EXPO_PUBLIC_USERS;
      if (!usersApi) return undefined;
      const res = await fetch(usersApi);
      const data = await res.json();
      const allUsers: UserInfo[] = data;
      const user: UserInfo[] = allUsers.filter((p) => p.id == userId);

      if (user.length == 0) Alert.alert("coudn't fetch user data");
      else setUser(user[0]);
    };

    fetchUserData();
  }, [user]);

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
      let userId = 0;
      const getUserId: string | null = await AsyncStorage.getItem("userId");
      if (getUserId != null) userId = parseInt(getUserId);
      const usersApi = process.env.EXPO_PUBLIC_USERS;
      if (!usersApi) return undefined;
      const resUser = await fetch(usersApi);
      const dataUser = await resUser.json();
      const allUsers: UserInfo[] = dataUser;
      const user: UserInfo[] = allUsers.filter((p) => p.id == userId);
      if (user.length == 0) Alert.alert("coudn't fetch user data");

      user[0].userImage = result.assets[0].uri;

      const updatedUserImage = {
        ...user[0],
      };

      const updateUserImage = await fetch(
        `${process.env.EXPO_PUBLIC_USERS}/${user[0].id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserImage),
        },
      );

      if (!updateUserImage.ok) Alert.alert("Failed to update database");

      Alert.alert("Image has been edited to successfully");
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.profileHeaderContainer}>
          <Pressable onPress={handlePickImage} style={styles.imageWrapper}>
            <Image
              source={{
                uri: user?.userImage
                  ? user.userImage
                  : "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-unknown-social-media-user-photo-default-avatar-profile-icon-vector-unknown-social-media-user-184816085.jpg",
              }}
              style={styles.avatar}
            />
            <View style={styles.cameraBadge}>
              <MaterialCommunityIcons name="camera" color="#FFFFFF" size={14} />
            </View>
          </Pressable>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.menuContainer}>
          <Pressable
            style={styles.menuItem}
            onPress={() => router.replace("/components/EditProfileScreen")}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name="account-outline"
                  color="#5B1D88"
                  size={20}
                />
              </View>
              <Text style={styles.menuText}>My Profile</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              color="#8E8E93"
              size={20}
            />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => navigation.navigate("Orders")}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name="shopping-outline"
                  color="#5B1D88"
                  size={20}
                />
              </View>
              <Text style={styles.menuText}>My Orders</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              color="#8E8E93"
              size={20}
            />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.replace("/components/SettingsScreen")}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name="cog-outline"
                  color="#5B1D88"
                  size={20}
                />
              </View>
              <Text style={styles.menuText}>Settings</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              color="#8E8E93"
              size={20}
            />
          </Pressable>
        </View>

        <Pressable
          style={styles.logoutButton}
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
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#8E8E93",
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF1",
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
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
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
  logoutText: {
    color: "#FF3B30",
    fontSize: 15,
    fontWeight: "600",
  },
});
