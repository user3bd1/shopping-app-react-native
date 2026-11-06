import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { LoginCredentials } from "@/types/types";

export default function LoginScreen() {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(true);
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

  const changeVisibility = () => {
    setVisibility(!visibility);
  };

  const logIn = async () => {
    const loginApiLink = process.env.EXPO_PUBLIC_LOGININFO;
    if (!loginApiLink) return undefined;

    const res = await fetch(loginApiLink);
    const data = await res.json();

    const loginCredentials: LoginCredentials[] = data;

    const userLoginCredentials: LoginCredentials[] = loginCredentials.filter(
      (p) => p.email === email,
    );

    if (userLoginCredentials.length == 0) {
      Alert.alert(`user with this email doesnt exist`);
    } else {
      if (
        userLoginCredentials[0].password !== password ||
        userLoginCredentials[0].email !== email
      ) {
        Alert.alert(`Wrong email or password`);
      } else {
        if (userLoginCredentials[0].id == 0) return;
        await AsyncStorage.setItem("userId", `${userLoginCredentials[0].id}`);
        router.replace("/components/home");
      }
    }
  };

  const isDark = thema === "dark";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={"height"}>
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
                  color={isDark ? "#D0BCFF" : "#5B1D88"}
                  size={36}
                />
              </View>

              <Text
                style={[styles.welcomeText, isDark && styles.welcomeTextDark]}
              >
                Welcome back!
              </Text>
              <Text
                style={[styles.subtitleText, isDark && styles.subtitleTextDark]}
              >
                Log in to your account
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                >
                  Email address
                </Text>
                <View
                  style={[
                    styles.emailContainer,
                    isDark && styles.emailContainerDark,
                  ]}
                >
                  <TextInput
                    style={[styles.emailInput, isDark && styles.emailInputDark]}
                    secureTextEntry={false}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="you@example.com"
                    placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                >
                  Password
                </Text>
                <View
                  style={[
                    styles.passwordContainer,
                    isDark && styles.passwordContainerDark,
                  ]}
                >
                  <TextInput
                    style={[
                      styles.passwordInput,
                      isDark && styles.passwordInputDark,
                    ]}
                    secureTextEntry={visibility}
                    keyboardType="default"
                    autoCapitalize="none"
                    placeholder="••••••••"
                    placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable onPress={changeVisibility}>
                    <MaterialCommunityIcons
                      name={visibility ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={isDark ? "#A0A0A5" : "#A0A0A0"}
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable style={styles.forgotContainer}>
                <Text
                  style={[styles.forgotText, isDark && styles.forgotTextDark]}
                >
                  Forgot password?
                </Text>
              </Pressable>

              <Pressable
                style={[styles.loginButton, isDark && styles.loginButtonDark]}
                onPress={logIn}
              >
                <Text style={styles.loginButtonText}>Log In</Text>
              </Pressable>

              <View style={styles.footerContainer}>
                <Text
                  style={[styles.footerText, isDark && styles.footerTextDark]}
                >
                  Don't have an account?{" "}
                </Text>
                <Pressable
                  onPress={() => router.replace("/components/register")}
                >
                  <Text
                    style={[styles.signupText, isDark && styles.signupTextDark]}
                  >
                    Register
                  </Text>
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
  containerDark: {
    backgroundColor: "#121212",
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
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  welcomeTextDark: {
    color: "#F4F4F4",
  },
  subtitleText: {
    fontSize: 14,
    color: "#7D7D7D",
  },
  subtitleTextDark: {
    color: "#A0A0A5",
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
  inputLabelDark: {
    color: "#A0A0A5",
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
  emailContainerDark: {
    backgroundColor: "#1E1E22",
    borderColor: "#2C2C30",
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
  passwordContainerDark: {
    backgroundColor: "#1E1E22",
    borderColor: "#2C2C30",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1A1A1A",
  },
  passwordInputDark: {
    color: "#E0E0E0",
  },
  emailInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1A1A1A",
  },
  emailInputDark: {
    color: "#E0E0E0",
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
  forgotTextDark: {
    color: "#D0BCFF",
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
  loginButtonDark: {
    backgroundColor: "#7D3CB5",
    shadowColor: "#000",
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
  footerTextDark: {
    color: "#A0A0A5",
  },
  signupText: {
    fontSize: 14,
    color: "#5B1D88",
    fontWeight: "bold",
  },
  signupTextDark: {
    color: "#D0BCFF",
  },
});
