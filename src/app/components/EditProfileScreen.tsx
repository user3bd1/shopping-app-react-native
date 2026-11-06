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
  const [cardNum, setCardNum] = useState<string>("");
  const [cardExpMonth, setCardExpMonth] = useState<string>("");
  const [cardExpYear, setCardExpYear] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");

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
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
        />

        <Text style={[styles.label, isDark && styles.labelDark]}>
          Last Name
        </Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={user?.lastName || ""}
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
        />

        <Text style={[styles.label, isDark && styles.labelDark]}>Email</Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={user?.email || ""}
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
          keyboardType="phone-pad"
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
        />

        <Text style={[styles.label, isDark && styles.labelDark]}>Address</Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={user?.address || ""}
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
        />

        <Text
          style={[styles.sectionHeader, isDark && styles.sectionHeaderDark]}
        >
          Payment Details
        </Text>

        {/* Real Bank Card Visual */}
        <View style={styles.cardContainer}>
          <View style={styles.cardTopRow}>
            <View style={styles.chip} />
            <MaterialCommunityIcons
              name="contactless-payment"
              size={28}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.cardNumberText}>{cardNum}</Text>

          <View style={styles.cardBottomRow}>
            <View style={styles.cardInfoGroup}>
              <Text style={styles.cardLabel}>CARD HOLDER</Text>
              <Text style={styles.cardValue} numberOfLines={1}>
                {user?.firstName} {user?.lastName}
              </Text>
            </View>

            <View style={styles.cardInfoGroup}>
              <Text style={styles.cardLabel}>EXPIRES</Text>
              <Text style={styles.cardValue}>
                {cardExpMonth}/{cardExpYear}
              </Text>
            </View>

            <View style={styles.cardInfoGroup}>
              <Text style={styles.cardLabel}>CVC/CVV</Text>
              <Text style={styles.cardValue}>{cvv}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.label, isDark && styles.labelDark]}>
          Card Number
        </Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={cardNum}
          keyboardType="numeric"
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
          maxLength={16}
          onChangeText={setCardNum}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              Expiry Month
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={cardExpMonth}
              keyboardType="numeric"
              placeholder="MM"
              placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
              maxLength={2}
              onChangeText={setCardExpMonth}
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              Expiry Year
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={cardExpYear}
              keyboardType="numeric"
              placeholder="YY"
              placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
              maxLength={2}
              onChangeText={setCardExpYear}
            />
          </View>
        </View>

        <Text style={[styles.label, isDark && styles.labelDark]}>CVV</Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={cvv}
          keyboardType="numeric"
          placeholder="123"
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
          maxLength={3}
          onChangeText={setCvv}
        />

        <Pressable style={[styles.saveButton, isDark && styles.saveButtonDark]}>
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
  /* Bank Card Styles */
  cardContainer: {
    backgroundColor: "#2C1445",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  chip: {
    width: 42,
    height: 32,
    backgroundColor: "#FFD700",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#B8860B",
  },
  cardNumberText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 24,
    fontFamily: "monospace",
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardInfoGroup: {
    flexDirection: "column",
  },
  cardLabel: {
    color: "#A0A0A0",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
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
