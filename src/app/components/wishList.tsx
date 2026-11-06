import { Product, ProductItem, UserInfo } from "@/types/types";
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
  const [thema, setThema] = useState<string>("light");

  useEffect(() => {
    const getWishList = async () => {
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
      const user: UserInfo[] = allUsers.filter((p) => p.id == userId);
      if (user.length == 0) Alert.alert("Couldn't fetch user data");
      else {
        setWishList(user[0].wishList || []);
      }
    };

    getWishList();
  }, []);

  const addToOrders = async (id: number) => {
    let userId = 0;
    const getUserId: string | null = await AsyncStorage.getItem("userId");
    if (getUserId != null) userId = parseInt(getUserId);
    const usersApi = process.env.EXPO_PUBLIC_USERS;
    if (!usersApi) return undefined;
    const resUser = await fetch(usersApi);
    const dataUser = await resUser.json();
    const allUsers: UserInfo[] = dataUser;
    const user: UserInfo[] = allUsers.filter((p) => p.id == userId);
    if (user.length == 0) return Alert.alert("Couldn't fetch user data");

    const productsApi = process.env.EXPO_PUBLIC_PRODUCTSAPI;
    if (!productsApi) return undefined;
    const resProduct = await fetch(productsApi);
    const dataProduct: Product[] = await resProduct.json();
    const filteredData: ProductItem[] = dataProduct.filter((p) => p.id === id);

    if (filteredData.length === 0) return;

    const newOrder = [...(user[0].orders || []), filteredData[0]];
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

    if (!updateUserOrders.ok) {
      Alert.alert("Failed to update database");
    } else {
      Alert.alert(
        "Success",
        "Product has been added to your orders list successfully",
      );
    }
  };

  const deleteFromWishList = async (id: number) => {
    let userId = 0;
    const getUserId: string | null = await AsyncStorage.getItem("userId");
    if (getUserId != null) userId = parseInt(getUserId);
    const usersApi = process.env.EXPO_PUBLIC_USERS;
    if (!usersApi) return undefined;
    const resUser = await fetch(usersApi);
    const dataUser = await resUser.json();
    const allUsers: UserInfo[] = dataUser;
    const user: UserInfo[] = allUsers.filter((p) => p.id == userId);
    if (user.length == 0) return Alert.alert("Couldn't fetch user data");

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

    if (!updateUserWishList.ok) {
      Alert.alert("Failed to update database");
    } else {
      setWishList(newWishList);
      Alert.alert(
        "Success",
        "Product has been deleted from your wishlist successfully",
      );
    }
  };

  const isDark = thema === "dark";

  return (
    <View style={[style.container, isDark && style.containerDark]}>
      <View style={style.headerRow}>
        <Text style={[style.headerTitle, isDark && style.headerTitleDark]}>
          My Wishlist
        </Text>
        <Text style={[style.itemCount, isDark && style.itemCountDark]}>
          {wishList.length} items
        </Text>
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
            <View
              style={[style.productCard, isDark && style.productCardDark]}
              key={index}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 5,
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Pressable onPress={() => addToOrders(p.id!)}>
                  <MaterialCommunityIcons
                    color={isDark ? "#D0BCFF" : "black"}
                    name="cart"
                    size={22}
                  />
                </Pressable>

                <Pressable onPress={() => deleteFromWishList(p.id!)}>
                  <Ionicons name="heart" size={22} color="red" />
                </Pressable>
              </View>
              <Image
                source={{ uri: `${p.images[0]}` }}
                style={[style.productImage, isDark && style.productImageDark]}
                resizeMode="contain"
              />

              <Text
                style={[style.productTitle, isDark && style.productTitleDark]}
                numberOfLines={1}
              >
                {p.title}
              </Text>
              <Text
                style={[style.productPrice, isDark && style.productPriceDark]}
              >
                {p.price} Euro
              </Text>
            </View>
          )}
        />
      </View>

      <NavList />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  containerDark: {
    backgroundColor: "#121212",
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
  headerTitleDark: {
    color: "#F4F4F4",
  },
  itemCount: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "600",
  },
  itemCountDark: {
    color: "#A0A0A5",
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
    borderWidth: 1,
    borderColor: "#EFEFF1",
  },
  productCardDark: {
    backgroundColor: "#1E1E22",
    borderColor: "#2C2C30",
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  productImageDark: {
    backgroundColor: "#2C2C30",
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    flexShrink: 1,
  },
  productTitleDark: {
    color: "#E0E0E0",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1A1A",
    width: "100%",
    textAlign: "center",
  },
  productPriceDark: {
    color: "#D0BCFF",
  },
});
