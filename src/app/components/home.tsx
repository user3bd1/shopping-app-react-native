import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Product, UserAccount } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [user, setUser] = useState<UserAccount>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filterdProducts, setFilterdProducts] = useState<Product[]>([]);

  let userId = 0;
  useEffect(() => {
    const fetchUserData = async () => {
      const usersApi = process.env.EXPO_PUBLIC_USERS;
      if (!usersApi) return undefined;
      const res = await fetch(usersApi);
      const data = await res.json();
      const allUsers: UserAccount[] = data;
      const getUserId: string | null = await AsyncStorage.getItem("userId");
      if (getUserId != null) userId = parseInt(getUserId);

      const user: UserAccount[] = allUsers.filter((p) => p.id == userId);
      if (user.length == 0) Alert.alert("coudn't fetch user data");
      else setUser(user[0]);
    };

    const fetchProducts = async () => {
      const productsApi = process.env.EXPO_PUBLIC_PRODUCTSAPI;
      if (!productsApi) return undefined;
      const res = await fetch(productsApi);
      const data = await res.json();
      setProducts(data);
    };

    fetchUserData();
    fetchProducts();
    let filterddata: Product[] = products.filter((p) => p.rating >= 4);
    setFilterdProducts(filterddata);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello {user?.firstName}👋 </Text>
        <MaterialCommunityIcons name="bell-outline" color="#1A1A1A" size={24} />
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" color="#A0A0A0" size={22} />
        <TextInput
          style={styles.textInput}
          keyboardType="default"
          autoCapitalize="none"
          placeholder="Search for product..."
          placeholderTextColor="#A0A0A0"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Products</Text>
        <FlatList
          data={filterdProducts}
          keyExtractor={(p) => p.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productsGrid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: p }) => (
            <View style={styles.productCard}>
              <Image
                source={{ uri: `${p.images[0]}` }}
                style={styles.productImage}
                resizeMode="contain"
              />
              <Text style={styles.productTitle} numberOfLines={1}>
                {p.title}
              </Text>
              <Text style={styles.productPrice}>{p.price} Euro</Text>
            </View>
          )}
        />
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 24,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1A1A1A",
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  productsGrid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#F8F8FA",
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    width: "100%",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1A1A",
    width: "100%",
  },
});
