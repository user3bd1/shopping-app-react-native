import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [visibility, setVisibility] = useState<boolean>(true);

  const changeVisibility = () => {
    visibility ? setVisibility(false) : setVisibility(true);
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="shopping"
                  color="#5B1D88"
                  size={36}
                />
              </View>

              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.subtitleText}>Log in to your account</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email address</Text>
                <View style={styles.emailContainer}>
                  <TextInput
                    secureTextEntry={false}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="you@example.com"
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={visibility ?? false}
                    keyboardType="default"
                    autoCapitalize="none"
                    placeholder="••••••••"
                    placeholderTextColor="#A0A0A0"
                  />
                  <Pressable>
                    <MaterialCommunityIcons
                      name={visibility ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#A0A0A0"
                      onPress={changeVisibility}
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable style={styles.forgotContainer}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>

              <Pressable style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Log In</Text>
              </Pressable>

              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Pressable>
                  <Text style={styles.signupText}>Register</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  contentContainer: {
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 28,
    width: "100%",
  },
  iconContainer: {
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: "#7D7D7D",
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4A4A4A",
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1A1A1A",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1A1A1A",
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    color: "#5B1D88",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#5B1D88",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5B1D88",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#7D7D7D",
  },
  signupText: {
    fontSize: 14,
    color: "#5B1D88",
    fontWeight: "bold",
  },
});
