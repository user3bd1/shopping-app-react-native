import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import NavList from "./nav";

import { Product, ProductItem, UserInfo } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";

export default function ProductsByTitleScreen() {
  const [user, setUser] = useState<UserInfo>();
  const [filterdProducts, setFilterdProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [thema, setThema] = useState<string>("light");
  const params = useLocalSearchParams<{ name: string }>();

  useEffect(() => {
    const fetchData = async () => {
      let userId = 0;
      const getUserId: string | null = await AsyncStorage.getItem("userId");
      if (getUserId != null) userId = parseInt(getUserId);

      const savedTheme = await AsyncStorage.getItem("thema");
      if (savedTheme) {
        setThema(savedTheme);
      }

      const usersApi = process.env.EXPO_PUBLIC_USERS;
      const productsApi = process.env.EXPO_PUBLIC_PRODUCTSAPI;
      if (!usersApi || !productsApi) return undefined;

      const [userRes, productRes] = await Promise.all([
        fetch(usersApi),
        fetch(productsApi),
      ]);

      const allUsers: UserInfo[] = await userRes.json();
      const foundUser = allUsers.find((p) => p.id === userId);

      if (!foundUser) {
        Alert.alert("Couldn't fetch user data");
      } else {
        setUser(foundUser);
      }

      const data: Product[] = await productRes.json();
      const searchName = params.name ? params.name.toLowerCase() : "";
      const filteredData = data.filter((p) =>
        p.title.toLowerCase().includes(searchName),
      );

      setFilterdProducts(filteredData);
      setLoading(false);
    };

    fetchData();
  }, [params.name]);

  const addToWishList = async (id: number) => {
    if (!user) return;
    const productsApi = process.env.EXPO_PUBLIC_PRODUCTSAPI;
    if (!productsApi) return undefined;

    const resProduct = await fetch(productsApi);
    const dataProduct: Product[] = await resProduct.json();
    const filteredData: ProductItem[] = dataProduct.filter((p) => p.id === id);

    if (filteredData.length === 0) return;

    const newWishList = [...user.wishList, filteredData[0]];
    const updatedUserObject = {
      ...user,
      wishList: newWishList,
    };

    const updateUserWishList = await fetch(
      `${process.env.EXPO_PUBLIC_USERS}/${user.id}`,
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
      return;
    }

    setUser(updatedUserObject);
    Alert.alert(
      "Success",
      "Product has been added to your wishlist successfully",
    );
  };

  const deleteFromWishList = async (id: number) => {
    if (!user) return;

    const newWishList: ProductItem[] = user.wishList.filter((p) => p.id !== id);
    const updatedUserObject = {
      ...user,
      wishList: newWishList,
    };

    const updateUserWishList = await fetch(
      `${process.env.EXPO_PUBLIC_USERS}/${user.id}`,
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
      return;
    }

    setUser(updatedUserObject);
    Alert.alert(
      "Success",
      "Product has been deleted from your wishlist successfully",
    );
  };

  const isDark = thema === "dark";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {loading ? (
        <View style={styles.loadIndeicator}>
          <ActivityIndicator
            size="large"
            color={isDark ? "#D0BCFF" : "#0000ff"}
          />
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
            Loading your data...
          </Text>
        </View>
      ) : (
        <View style={styles.section}>
          <View style={[styles.topHeader, isDark && styles.topHeaderDark]}>
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
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
            >
              Search Results for "{params.name}"
            </Text>
            <FlatList
              data={filterdProducts}
              keyExtractor={(p) => p.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.productsGrid}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: p, index }) => (
                <View
                  style={[styles.productCard, isDark && styles.productCardDark]}
                  key={index}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
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
                          color={isDark ? "#E0E0E0" : "black"}
                          style={styles.heartStyle}
                          onPress={() => addToWishList(p.id)}
                        />
                      )}
                    </Pressable>
                  </View>

                  <Image
                    source={{ uri: `${p.images[0]}` }}
                    style={[
                      styles.productImage,
                      isDark && styles.productImageDark,
                    ]}
                    resizeMode="contain"
                  />
                  <Link
                    href={{
                      pathname: `/components/ProductInfoScreen`,
                      params: { id: p.id },
                    }}
                  >
                    <View>
                      <Text
                        style={[
                          styles.productTitle,
                          isDark && styles.productTitleDark,
                        ]}
                        numberOfLines={1}
                      >
                        {p.title}
                      </Text>
                      <Text
                        style={[
                          styles.productPrice,
                          isDark && styles.productPriceDark,
                        ]}
                      >
                        {p.price} Euro
                      </Text>
                    </View>
                  </Link>
                </View>
              )}
            />
          </View>
        </View>
      )}

      <NavList />
    </View>
  );
}

const styles = StyleSheet.create({
  heartStyle: {
    padding: 4,
  },
  loadIndeicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#1A1A1A",
  },
  loadingTextDark: {
    color: "#E0E0E0",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  topHeaderDark: {
    backgroundColor: "#121212",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
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
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  sectionTitleDark: {
    color: "#F4F4F4",
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
