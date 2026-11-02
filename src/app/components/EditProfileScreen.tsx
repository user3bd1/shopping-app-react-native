import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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
  const handleSave = () => {
    Alert.alert("Success", "Profile updated successfully!");
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.replace("/components/profile")}
      >
        <MaterialCommunityIcons name="arrow-left" size={20} color="#5B1D88" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.title}>Edit Profile Info</Text>

        <Text style={styles.sectionHeader}>Personal Details</Text>

        <Text style={styles.label}>First Name</Text>
        <TextInput style={styles.input} value="firstName" />

        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} value="lastName" />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value="email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value="phone"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value="address" />

        <Text style={styles.sectionHeader}>Payment Details</Text>

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          value="cardNum"
          keyboardType="numeric"
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="#A0A0A0"
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Expiry Month</Text>
            <TextInput
              style={styles.input}
              value="cardExpiryMonth"
              keyboardType="numeric"
              placeholder="MM"
              placeholderTextColor="#A0A0A0"
              maxLength={2}
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Expiry Year</Text>
            <TextInput
              style={styles.input}
              value="cardExpiryYear"
              keyboardType="numeric"
              placeholder="YY"
              placeholderTextColor="#A0A0A0"
              maxLength={2}
            />
          </View>
        </View>

        <Text style={styles.label}>CVV</Text>
        <TextInput
          style={styles.input}
          value="cvv"
          keyboardType="numeric"
          secureTextEntry
          placeholder="123"
          placeholderTextColor="#A0A0A0"
          maxLength={3}
        />

        <Pressable style={styles.saveButton} onPress={handleSave}>
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
  scroll: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B1D88",
    marginTop: 10,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636366",
    marginBottom: 6,
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
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
