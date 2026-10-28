import { Product, ProductItem, UserAccount } from "@/types/types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NavList from "./nav";
export default function WishListScreen() {
  const [wishList, setWishList] = useState<ProductItem[]>([]);

  useEffect(() => {
    const getWishList = async () => {
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
      else {
        setWishList(user[0].wishList);
      }
    };

    getWishList();
  }, [wishList]);

  const addToOrders = async (id: number) => {
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

    const newOrder = [...user[0].orders, filteredData[0]];
    const updatedUserObject = {
      ...user[0],
      orders: newOrder,
    };

    const updateUserOrders = await fetch(
      `${process.env.EXPO_PUBLIC_USERS}/${user[0].id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserObject),
      },
    );

    if (!updateUserOrders.ok) Alert.alert("Failed to update database");

    Alert.alert("Product has been added to your orders list successfully");
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
    <View style={style.container}>
      <View style={style.headerRow}>
        <Text style={style.headerTitle}>My Wishlist</Text>
        <Text style={style.itemCount}>{wishList.length} items</Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={wishList}
          keyExtractor={(p) => p.id!.toString()}
          numColumns={2}
          columnWrapperStyle={style.row}
          contentContainerStyle={style.productsGrid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: p, index }) => (
            <View style={style.productCard} key={index}>
              <View
                style={{ display: "flex", flexDirection: "row", padding: "5" }}
              >
                <Pressable>
                  <MaterialCommunityIcons
                    color="black"
                    name="cart"
                    size={24}
                    style={{ left: -40 }}
                    onPress={() => addToOrders(p.id!)}
                  />
                </Pressable>

                <Pressable>
                  <Ionicons
                    name="heart"
                    size={24}
                    color="red"
                    style={{ right: -40 }}
                    onPress={() => deleteFromWishList(p.id!)}
                  />
                </Pressable>
              </View>
              <Image
                source={{ uri: `${p.images[0]}` }}
                style={style.productImage}
                resizeMode="contain"
              />

              <Text style={style.productTitle} numberOfLines={1}>
                {p.title}
              </Text>
              <Text style={style.productPrice}>{p.price} Euro</Text>
              <Pressable></Pressable>
            </View>
          )}
        />
      </View>

      <NavList />
    </View>
  );
}

const style = StyleSheet.create({
  addTocartBtn: {
    left: -40,
    top: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  productsGrid: {
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  itemCount: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "600",
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
