import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NavList from "./nav";
export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string>(
    "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-unknown-social-media-user-photo-default-avatar-profile-icon-vector-unknown-social-media-user-184816085.jpg",
  );
  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
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
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            <View style={styles.cameraBadge}>
              <MaterialCommunityIcons name="camera" color="#FFFFFF" size={14} />
            </View>
          </Pressable>
          <Text style={styles.userName}>firstName lastName</Text>
          <Text style={styles.userEmail}>email</Text>
        </View>

        <View style={styles.menuContainer}>
          <Pressable style={styles.menuItem}>
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
            onPress={() => navigation.navigate("Settings")}
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
    paddingTop: 50,
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
