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

import { LoginCredentials, UserInfo } from "@/types/types";

export default function RegisterScreen() {
  const [visibility, setVisibility] = useState<boolean>(true);
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [thema, setThema] = useState<string>("light");

  const [isFilledlastName, setisFilledLastName] = useState<boolean>(true);
  const [isFilledfirstName, setisFilledFirstName] = useState<boolean>(true);
  const [isFilledphone, setisFilledPhone] = useState<boolean>(true);
  const [isFilledemail, setisFilledEmail] = useState<boolean>(true);
  const [isFilledaddress, setisFilledAddress] = useState<boolean>(true);
  const [isFilledpassword, setisFilledPassword] = useState<boolean>(true);

  useEffect(() => {
    const fetchTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("thema");
      if (savedTheme) {
        setThema(savedTheme);
      }
    };
    fetchTheme();
  }, []);

  const senddata = async () => {
    const newUser: UserInfo = {
      address: address,
      cardExpiryMonth: "",
      cardExpiryYear: "",
      cardNum: "",
      cvv: "",
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      userImage: "",
      orders: [],
      wishList: [],
      orderdOrders: {},
    };

    const newLoginCredentials: LoginCredentials = {
      email: email,
      password: password,
    };

    const isFirstEmpty = firstName.trim() === "";
    const isLastEmpty = lastName.trim() === "";
    const isAddressEmpty = address.trim() === "";
    const isPhoneEmpty = phone.trim() === "";
    const isEmailEmpty = email.trim() === "" || !email.includes("@");
    const isPasswordEmpty = password.trim() === "";

    setisFilledFirstName(!isFirstEmpty);
    setisFilledLastName(!isLastEmpty);
    setisFilledAddress(!isAddressEmpty);
    setisFilledPhone(!isPhoneEmpty);
    setisFilledEmail(!isEmailEmpty);
    setisFilledPassword(!isPasswordEmpty);

    if (
      isFirstEmpty ||
      isLastEmpty ||
      isAddressEmpty ||
      isPhoneEmpty ||
      isEmailEmpty ||
      isPasswordEmpty
    ) {
      Alert.alert("You must fill the required fields");
    } else {
      const usersApi = process.env.EXPO_PUBLIC_USERS;
      if (!usersApi) return undefined;

      const userCredentials = process.env.EXPO_PUBLIC_LOGININFO;
      if (!userCredentials) throw new Error("EXPO_PUBLIC_LOGININFO is not set");
      const res = await fetch(usersApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const res1 = await fetch(userCredentials, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLoginCredentials),
      });

      if (!res.ok && !res1.ok)
        throw new Error("couldn't register your account");

      setFirstName("");
      setLastName("");
      setAddress("");
      setEmail("");
      setPassword("");
      setPhone("");

      Alert.alert("You have successfully registered your account");
      router.replace("/");
    }
  };

  const changeVisibility = () => {
    setVisibility(!visibility);
  };

  const isDark = thema === "dark";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <KeyboardAvoidingView behavior={"height"} style={styles.keyboardView}>
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
                style={[styles.subtitleText, isDark && styles.subtitleTextDark]}
              >
                Register your account
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.rowContainer}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text
                    style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                  >
                    First Name
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      isDark && styles.textInputDark,
                      {
                        borderColor: isFilledfirstName
                          ? isDark
                            ? "#2C2C30"
                            : "#E5E5E5"
                          : "red",
                      },
                    ]}
                    secureTextEntry={false}
                    keyboardType="default"
                    autoCapitalize="words"
                    placeholder="John"
                    placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text
                    style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                  >
                    Last Name
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      isDark && styles.textInputDark,
                      {
                        borderColor: isFilledlastName
                          ? isDark
                            ? "#2C2C30"
                            : "#E5E5E5"
                          : "red",
                      },
                    ]}
                    secureTextEntry={false}
                    keyboardType="default"
                    autoCapitalize="words"
                    placeholder="Doe"
                    placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                >
                  Address
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isDark && styles.textInputDark,
                    {
                      borderColor: isFilledaddress
                        ? isDark
                          ? "#2C2C30"
                          : "#E5E5E5"
                        : "red",
                    },
                  ]}
                  secureTextEntry={false}
                  keyboardType="default"
                  autoCapitalize="none"
                  placeholder="I don't know 123"
                  placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, isDark && styles.inputLabelDark]}
                >
                  Phone
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isDark && styles.textInputDark,
                    {
                      borderColor: isFilledphone
                        ? isDark
                          ? "#2C2C30"
                          : "#E5E5E5"
                        : "red",
                    },
                  ]}
                  secureTextEntry={false}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  placeholder="04xxxxxxx"
                  placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

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
                    {
                      borderColor: isFilledemail
                        ? isDark
                          ? "#2C2C30"
                          : "#E5E5E5"
                        : "red",
                    },
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
                    {
                      borderColor:
                        password.length > 0 &&
                        (password.length < 12 ||
                          !/[a-z]/.test(password) ||
                          !/[A-Z]/.test(password) ||
                          !/\d/.test(password) ||
                          !isFilledpassword)
                          ? "red"
                          : isDark
                            ? "#2C2C30"
                            : "#E5E5E5",
                    },
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

              <Pressable
                style={[
                  styles.RegisterButton,
                  isDark && styles.RegisterButtonDark,
                ]}
                onPress={senddata}
              >
                <Text style={styles.RegisterButtonText}>Register</Text>
              </Pressable>

              <Pressable
                style={styles.loginLinkWrapper}
                onPress={() => router.replace("/")}
              >
                <Text
                  style={[
                    styles.loginPromptText,
                    isDark && styles.loginPromptTextDark,
                  ]}
                >
                  Already have an account?{" "}
                </Text>
                <Text
                  style={[styles.loginText, isDark && styles.loginTextDark]}
                >
                  Back to login
                </Text>
              </Pressable>
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
  loginLinkWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    justifyContent: "center",
  },
  loginPromptText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  loginPromptTextDark: {
    color: "#A0A0A5",
  },
  loginText: {
    fontSize: 14,
    color: "#5B1D88",
    fontWeight: "bold",
  },
  loginTextDark: {
    color: "#D0BCFF",
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
    marginBottom: 24,
    width: "100%",
  },
  iconContainer: {
    marginBottom: 8,
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
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  inputGroup: {
    marginBottom: 16,
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
  textInput: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1A1A1A",
  },
  textInputDark: {
    backgroundColor: "#1E1E22",
    color: "#E0E0E0",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  emailContainerDark: {
    backgroundColor: "#1E1E22",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  passwordContainerDark: {
    backgroundColor: "#1E1E22",
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
  RegisterButton: {
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
    marginTop: 8,
    marginBottom: 20,
  },
  RegisterButtonDark: {
    backgroundColor: "#7D3CB5",
    shadowColor: "#000",
  },
  RegisterButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
