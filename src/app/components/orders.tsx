import { ProductItem, UserAccount } from "@/types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";
import NavList from "./nav";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<ProductItem[]>([]);

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
        setOrders(user[0].orders);
      }
    };

    getWishList();
  }, [orders]);

  const deleteFromOrders = async (id: number) => {
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

    const newOrders: ProductItem[] = user[0].orders.filter((p) => p.id !== id);
    const updatedUserObject = {
      ...user[0],
      orders: newOrders,
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

    Alert.alert("Product has been deleted from your orders list successfully");
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.itemCount}>{orders.length} orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(p) => p.id!.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item: p, index }) => (
          <View style={styles.card} key={index}>
            <View style={styles.orderTopRow}>
              <Text style={styles.orderIdText}>Order #{p.id}</Text>
              <MaterialCommunityIcons
                name="trash-can-outline"
                color="#FF3B30"
                size={22}
                onPress={() => deleteFromOrders(p.id!)}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.productRow}>
              <Image
                source={{
                  uri:
                    p.images && p.images[0]
                      ? p.images[0]
                      : "https://via.placeholder.com/100",
                }}
                style={styles.image}
                resizeMode="contain"
              />

              <View style={styles.detailsContainer}>
                <Text style={styles.brandText}>{p.brand}</Text>
                <Text style={styles.titleText} numberOfLines={1}>
                  {p.title}
                </Text>
                <Text style={styles.descriptionText} numberOfLines={2}>
                  {p.description}
                </Text>
                <Text style={styles.priceText}>{p.price} €</Text>
              </View>
            </View>
          </View>
        )}
      />
      <NavList />
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
  listContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#F8F8FA",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EFEFF1",
  },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderIdText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#5B1D88",
  },

  divider: {
    height: 1,
    backgroundColor: "#EFEFF1",
    marginBottom: 12,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  brandText: {
    fontSize: 10,
    color: "#8E8E93",
    marginBottom: 2,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  titleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 11,
    color: "#636366",
    marginBottom: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#5B1D88",
  },
});
