import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import NavList from "./nav";

import { Product, ProductItem, UserAccount } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [user, setUser] = useState<UserAccount>();
  const [filterdProducts, setFilterdProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      let userId = 0;
      const getUserId: string | null = await AsyncStorage.getItem("userId");
      if (getUserId != null) userId = parseInt(getUserId);

      const usersApi = process.env.EXPO_PUBLIC_USERS;
      if (!usersApi) return undefined;
      const res = await fetch(usersApi);
      const data = await res.json();
      const allUsers: UserAccount[] = data;
      const user: UserAccount[] = allUsers.filter((p) => p.id == userId);

      if (user.length == 0) Alert.alert("coudn't fetch user data");
      else setUser(user[0]);
    };

    const fetchProducts = async () => {
      const productsApi = process.env.EXPO_PUBLIC_PRODUCTSAPI;
      if (!productsApi) return undefined;
      const res = await fetch(productsApi);
      const data: Product[] = await res.json();
      const filteredData = data.filter((p) => Number(p.rating) >= 4);

      setFilterdProducts(filteredData);
      if (filteredData) setLoading(false);
    };

    fetchUserData();
    fetchProducts();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadIndeicator}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading your data...</Text>
      </View>
    );
  }

  const addToWishList = async (id: number) => {
    let userId = 0;
    const getUserId: string | null = await AsyncStorage.getItem("userId");
    if (getUserId != null) userId = parseInt(getUserId);
    const usersApi = process.env.EXPO_PUBLIC_USERS;
    if (!usersApi) return undefined;
    const resUser = await fetch(usersApi);
    const dataUser = await resUser.json();
    const allUsers: UserAccount[] = dataUser;
    const user: UserAccount[] = allUsers.filter((p) => p.id == userId);
    if (user.length == 0) Alert.alert("coudn't fetch user data");

    const productsApi = process.env.EXPO_PUBLIC_PRODUCTSAPI;
    if (!productsApi) return undefined;
    const resProduct = await fetch(productsApi);
    const dataProduct: Product[] = await resProduct.json();
    const filteredData: ProductItem[] = dataProduct.filter((p) => p.id === id);

    const newWishList = [...user[0].wishList, filteredData[0]];
    const updatedUserObject = {
      ...user[0],
      wishList: newWishList,
    };

    const updateUserWishList = await fetch(
      `${process.env.EXPO_PUBLIC_USERS}/${user[0].id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserObject),
      },
    );

    if (!updateUserWishList.ok) Alert.alert("Failed to update database");

    Alert.alert("Product has been added to your wishlist successfully");
  };

  const deleteFromWishList = async (id: number) => {
    let userId = 0;
    const getUserId: string | null = await AsyncStorage.getItem("userId");
    if (getUserId != null) userId = parseInt(getUserId);
    const usersApi = process.env.EXPO_PUBLIC_USERS;
    if (!usersApi) return undefined;
    const resUser = await fetch(usersApi);
    const dataUser = await resUser.json();
    const allUsers: UserAccount[] = dataUser;
    const user: UserAccount[] = allUsers.filter((p) => p.id == userId);
    if (user.length == 0) Alert.alert("coudn't fetch user data");

    const newWishList: ProductItem[] = user[0].wishList.filter(
      (p) => p.id !== id,
    );
    const updatedUserObject = {
      ...user[0],
      wishList: newWishList,
    };

    const updateUserWishList = await fetch(
      `${process.env.EXPO_PUBLIC_USERS}/${user[0].id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserObject),
      },
    );

    if (!updateUserWishList.ok) Alert.alert("Failed to update database");

    Alert.alert("Product has been deleted from your wishlist successfully");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello {user?.firstName}👋 </Text>
        <MaterialCommunityIcons name="bell-outline" color="#1A1A1A" size={24} />
      </View>

      <View style={styles.searchContainer}>
        <Pressable>
          <MaterialCommunityIcons
            name="magnify"
            color="#A0A0A0"
            size={22}
            onPress={() => Alert.alert("search")}
          />
        </Pressable>
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
          renderItem={({ item: p, index }) => (
            <View style={styles.productCard} key={index}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Pressable>
                  {user?.wishList.find((l) => l.id == p.id) ? (
                    <Ionicons
                      name="heart"
                      size={24}
                      color="red"
                      style={styles.heartStyle}
                      onPress={() => deleteFromWishList(p.id)}
                    />
                  ) : (
                    <Ionicons
                      name="heart-outline"
                      size={24}
                      color="black"
                      style={styles.heartStyle}
                      onPress={() => addToWishList(p.id)}
                    />
                  )}
                </Pressable>
              </View>

              <Image
                source={{ uri: `${p.images[0]}` }}
                style={styles.productImage}
                resizeMode="contain"
              />
              <Pressable onPress={() => Alert.alert(`${p.title}`)}>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {p.title}
                </Text>
                <Text style={styles.productPrice}>{p.price} Euro</Text>
              </Pressable>
            </View>
          )}
        />
      </View>
      <NavList />
    </View>
  );
}

const styles = StyleSheet.create({
  heartStyle: {
    right: -50,
  },
  loadIndeicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    flexShrink: 1,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1A1A",
    width: "100%",
    textAlign: "center",
  },
});
