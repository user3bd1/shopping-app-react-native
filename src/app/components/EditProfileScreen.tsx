import { UserInfo } from "@/types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const [user, setUser] = useState<UserInfo>();
  const [thema, setThema] = useState<string>("");

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

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    if (!user) return;
    setUser({
      ...user,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    const usersApi = process.env.EXPO_PUBLIC_USERS;
    if (!usersApi) return;

    try {
      const response = await fetch(`${usersApi}/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        Alert.alert("Error", "Failed to update profile in database");
        return;
      }

      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Edit Profile Info
        </Text>

        <Text
          style={[styles.sectionHeader, isDark && styles.sectionHeaderDark]}
        >
          Personal Details
        </Text>

        <Text style={[styles.label, isDark && styles.labelDark]}>
          First Name
        </Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={user?.firstName || ""}
          onChangeText={(text) => handleInputChange("firstName", text)}
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
        />

        <Text style={[styles.label, isDark && styles.labelDark]}>
          Last Name
        </Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={user?.lastName || ""}
          onChangeText={(text) => handleInputChange("lastName", text)}
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
        />

        <Text style={[styles.label, isDark && styles.labelDark]}>Email</Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={user?.email || ""}
          onChangeText={(text) => handleInputChange("email", text)}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
        />

        <Text style={[styles.label, isDark && styles.labelDark]}>
          Phone Number
        </Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={user?.phone || ""}
          onChangeText={(text) => handleInputChange("phone", text)}
          keyboardType="phone-pad"
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
        />

        <Text style={[styles.label, isDark && styles.labelDark]}>Address</Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={user?.address || ""}
          onChangeText={(text) => handleInputChange("address", text)}
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
        />

        <Text
          style={[styles.sectionHeader, isDark && styles.sectionHeaderDark]}
        >
          Payment Details
        </Text>

        <Text style={[styles.label, isDark && styles.labelDark]}>
          Card Number
        </Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={user?.cardNum || ""}
          onChangeText={(text) => handleInputChange("cardNum", text)}
          keyboardType="numeric"
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              Expiry Month
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={user?.cardExpiryMonth || ""}
              onChangeText={(text) =>
                handleInputChange("cardExpiryMonth", text)
              }
              keyboardType="numeric"
              placeholder="MM"
              placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
              maxLength={2}
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              Expiry Year
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={user?.cardExpiryYear || ""}
              onChangeText={(text) => handleInputChange("cardExpiryYear", text)}
              keyboardType="numeric"
              placeholder="YY"
              placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
              maxLength={2}
            />
          </View>
        </View>

        <Text style={[styles.label, isDark && styles.labelDark]}>CVV</Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={user?.cvv || ""}
          onChangeText={(text) => handleInputChange("cvv", text)}
          keyboardType="numeric"
          secureTextEntry
          placeholder="123"
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
          maxLength={3}
        />

        <Pressable
          style={[styles.saveButton, isDark && styles.saveButtonDark]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
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
  scroll: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  titleDark: {
    color: "#F4F4F4",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B1D88",
    marginTop: 10,
    marginBottom: 14,
  },
  sectionHeaderDark: {
    color: "#D0BCFF",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636366",
    marginBottom: 6,
  },
  labelDark: {
    color: "#A0A0A5",
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
    color: "#1C1C1E",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  inputDark: {
    backgroundColor: "#1E1E22",
    color: "#E0E0E0",
    borderColor: "#2C2C30",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  saveButton: {
    backgroundColor: "#5B1D88",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonDark: {
    backgroundColor: "#7D3CB5",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
