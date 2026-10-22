import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Dimension,
  LoginCredentials,
  ProductItem,
  UserAccount,
} from "@/types/types";

export default function RegisterScreen() {
  const [visibility, setVisibility] = useState<boolean>(true);
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [isFilledlastName, setisFilledLastName] = useState<boolean>(true);
  const [isFilledfirstName, setisFilledFirstName] = useState<boolean>(true);
  const [isFilledphone, setisFilledPhone] = useState<boolean>(true);
  const [isFilledemail, setisFilledEmail] = useState<boolean>(true);
  const [isFilledaddress, setisFilledAddress] = useState<boolean>(true);
  const [isFilledpassword, setisFilledPassword] = useState<boolean>(true);

  const senddata = async () => {
    const dimension: Dimension = {
      width: 0,
      height: 0,
      depth: 0,
    };

    const productItem: ProductItem = {
      brand: "",
      category: "",
      description: "",
      title: "",
      dimensions: dimension,
      price: 0,
      weight: 0,
      images: [],
    };

    const newUser: UserAccount = {
      address: address,
      cardExpiryMonth: "",
      cardExpiryYear: "",
      cardNum: "",
      cvv: "",
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      orders: [productItem],
      wishList: [productItem],
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
      Alert.alert("You must fill the reqiured fields");
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

      Alert.alert("you have successfully registerd your account");
    }
  };

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

              <Text style={styles.subtitleText}>Register your account</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.rowContainer}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: isFilledfirstName ? "#E5E5E5" : "red",
                      },
                    ]}
                    secureTextEntry={false}
                    keyboardType="default"
                    autoCapitalize="words"
                    placeholder="John"
                    placeholderTextColor="#A0A0A0"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      { borderColor: isFilledlastName ? "#E5E5E5" : "red" },
                    ]}
                    secureTextEntry={false}
                    keyboardType="default"
                    autoCapitalize="words"
                    placeholder="Doe"
                    placeholderTextColor="#A0A0A0"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { borderColor: isFilledaddress ? "#E5E5E5" : "red" },
                  ]}
                  secureTextEntry={false}
                  keyboardType="default"
                  autoCapitalize="none"
                  placeholder="I don't know 123"
                  placeholderTextColor="#A0A0A0"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { borderColor: isFilledphone ? "#E5E5E5" : "red" },
                  ]}
                  secureTextEntry={false}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  placeholder="04xxxxxxx"
                  placeholderTextColor="#A0A0A0"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email address</Text>
                <View
                  style={[
                    styles.emailContainer,
                    { borderColor: isFilledemail ? "#E5E5E5" : "red" },
                  ]}
                >
                  <TextInput
                    style={styles.emailInput}
                    secureTextEntry={false}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="you@example.com"
                    placeholderTextColor="#A0A0A0"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>

                <View
                  style={[
                    styles.passwordContainer,
                    {
                      borderColor:
                        password.length > 0 &&
                        (password.length < 12 ||
                          !/[a-z]/.test(password) ||
                          !/[A-Z]/.test(password) ||
                          !/\d/.test(password) ||
                          isFilledpassword)
                          ? "red"
                          : "#E5E5E5",
                    },
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={visibility ?? false}
                    keyboardType="default"
                    autoCapitalize="none"
                    placeholder="••••••••"
                    placeholderTextColor="#A0A0A0"
                    value={password}
                    onChangeText={setPassword}
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

              <Pressable style={styles.RegisterButton}>
                <Text style={styles.RegisterButtonText} onPress={senddata}>
                  Register
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
  brandTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 14,
    color: "#7D7D7D",
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
  textInput: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1A1A1A",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1A1A1A",
  },
  emailInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1A1A1A",
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
  RegisterButtonText: {
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
