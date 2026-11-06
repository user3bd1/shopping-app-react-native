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

import { Product, ProductItem, UserInfo } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";

export default function HomeScreen() {
  const [user, setUser] = useState<UserInfo>();
  const [filterdProducts, setFilterdProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productname, setProductName] = useState<string>("");
  const [thema, setThema] = useState<string>("light");

  useEffect(() => {
    const fetchUserData = async () => {
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
      const foundUser = allUsers.find((p) => p.id === userId);

      if (!foundUser) Alert.alert("Couldn't fetch user data");
      else setUser(foundUser);
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
  }, []);

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

  const handleSearch = () => {
    if (!productname.trim())
      Alert.alert("Error", "You have to search for a product");
    else
      router.push({
        pathname: "/components/ProductsByTitleScreen",
        params: { name: productname.trim() },
      });
  };

  const isDark = thema === "dark";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, isDark && styles.greetingDark]}>
          Hello {user?.firstName}👋{" "}
        </Text>
        <MaterialCommunityIcons
          name="bell-outline"
          color={isDark ? "#F4F4F4" : "#1A1A1A"}
          size={24}
        />
      </View>

      <View
        style={[styles.searchContainer, isDark && styles.searchContainerDark]}
      >
        <Pressable onPress={handleSearch}>
          <MaterialCommunityIcons
            name="magnify"
            color={isDark ? "#A0A0A5" : "#A0A0A0"}
            size={22}
          />
        </Pressable>
        <TextInput
          style={[styles.textInput, isDark && styles.textInputDark]}
          keyboardType="default"
          autoCapitalize="none"
          placeholder="Search for product..."
          placeholderTextColor={isDark ? "#707075" : "#A0A0A0"}
          value={productname}
          onChangeText={setProductName}
          onSubmitEditing={handleSearch}
        />
      </View>

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
          <Text
            style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
          >
            Popular Products
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
    paddingTop: 50,
  },
  containerDark: {
    backgroundColor: "#121212",
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
  greetingDark: {
    color: "#F4F4F4",
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
  searchContainerDark: {
    backgroundColor: "#1E1E22",
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1A1A1A",
  },
  textInputDark: {
    color: "#E0E0E0",
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
