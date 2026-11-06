import { Product } from "@/types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductInfoScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const productId = Number(params.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [product, setProduct] = useState<Product>();
  const [thema, setThema] = useState<string>("light");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const savedTheme = await AsyncStorage.getItem("thema");
      if (savedTheme) {
        setThema(savedTheme);
      }

      let userId = 0;
      const getUserId: string | null = await AsyncStorage.getItem("userId");
      if (getUserId != null) userId = parseInt(getUserId);

      const usersApi = process.env.EXPO_PUBLIC_USERS;
      const productsApi = process.env.EXPO_PUBLIC_PRODUCTSAPI;
      if (!productsApi || !usersApi) return undefined;

      const [productRes, userRes] = await Promise.all([
        fetch(`${productsApi}/${productId}`),
        fetch(usersApi),
      ]);

      const productData = await productRes.json();
      const usersData = await userRes.json();
      const currentUser = usersData.find((u: any) => u.id === userId);

      if (currentUser && currentUser.wishList) {
        const foundInWishlist = currentUser.wishList.some(
          (item: any) => item.id === productId,
        );
        setIsWishlisted(foundInWishlist);
      }

      setProduct(productData);
    };

    fetchData();
  }, [productId]);

  const toggleWishlist = async () => {
    if (!product) return;
    let userId = 0;
    const getUserId: string | null = await AsyncStorage.getItem("userId");
    if (getUserId != null) userId = parseInt(getUserId);

    const usersApi = process.env.EXPO_PUBLIC_USERS;
    if (!usersApi) return;

    const resUser = await fetch(usersApi);
    const dataUser = await resUser.json();
    const currentUser = dataUser.find((u: any) => u.id === userId);
    if (!currentUser) return Alert.alert("Couldn't fetch user data");

    let updatedWishlist = currentUser.wishList || [];
    if (isWishlisted) {
      updatedWishlist = updatedWishlist.filter(
        (item: any) => item.id !== product.id,
      );
    } else {
      updatedWishlist.push(product);
    }

    const updatedUserObject = {
      ...currentUser,
      wishList: updatedWishlist,
    };

    const response = await fetch(`${usersApi}/${currentUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUserObject),
    });

    if (!response.ok) {
      Alert.alert("Failed to update wishlist");
      return;
    }

    setIsWishlisted(!isWishlisted);
    Alert.alert(
      "Success",
      isWishlisted ? "Removed from wishlist" : "Added to wishlist",
    );
  };

  const addToOrders = async () => {
    if (!product) return;
    let userId = 0;
    const getUserId: string | null = await AsyncStorage.getItem("userId");
    if (getUserId != null) userId = parseInt(getUserId);

    const usersApi = process.env.EXPO_PUBLIC_USERS;
    if (!usersApi) return;

    const resUser = await fetch(usersApi);
    const dataUser = await resUser.json();
    const currentUser = dataUser.find((u: any) => u.id === userId);
    if (!currentUser) return Alert.alert("Couldn't fetch user data");

    const updatedOrders = [...(currentUser.orders || []), product];
    const updatedUserObject = {
      ...currentUser,
      orders: updatedOrders,
    };

    const response = await fetch(`${usersApi}/${currentUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUserObject),
    });

    if (!response.ok) {
      Alert.alert("Failed to add to orders");
      return;
    }

    Alert.alert("Success", "Added to your orders!");
  };

  if (!product) return undefined;

  const originalPrice = (
    product.price /
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  const isDark = thema === "dark";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
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

        <Pressable
          style={[
            styles.wishlistIconCircle,
            isDark && styles.wishlistIconCircleDark,
          ]}
          onPress={toggleWishlist}
        >
          <MaterialCommunityIcons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={22}
            color={isWishlisted ? "red" : isDark ? "#F4F4F4" : "#1C1C1E"}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.imageGalleryContainer,
            isDark && styles.imageGalleryContainerDark,
          ]}
        >
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(
                event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width,
              );
              setActiveImageIndex(slideIndex);
            }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={[styles.productImage, isDark && styles.productImageDark]}
                resizeMode="contain"
              />
            )}
          />

          <View style={styles.paginationDots}>
            {product.images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  isDark && styles.dotDark,
                  activeImageIndex === i &&
                    (isDark ? styles.activeDotDark : styles.activeDot),
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.mainInfoContainer}>
          <Text style={styles.brandText}>{product.brand}</Text>
          <Text style={[styles.titleText, isDark && styles.titleTextDark]}>
            {product.title}
          </Text>

          <View style={styles.ratingRow}>
            <View style={[styles.starBadge, isDark && styles.starBadgeDark]}>
              <MaterialCommunityIcons name="star" color="#FFB800" size={16} />
              <Text
                style={[styles.ratingText, isDark && styles.ratingTextDark]}
              >
                {product.rating.toFixed(1)}
              </Text>
            </View>
            <Text style={styles.reviewsCountText}>
              ({product.reviews.length} reviews)
            </Text>
            <View style={[styles.stockBadge, isDark && styles.stockBadgeDark]}>
              <Text style={styles.stockText}>
                {product.availabilityStatus} ({product.stock})
              </Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text
              style={[styles.currentPrice, isDark && styles.currentPriceDark]}
            >
              {product.price.toFixed(2)} €
            </Text>
            <Text style={styles.originalPrice}>{originalPrice} €</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                -{product.discountPercentage}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text
            style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
          >
            Description
          </Text>
          <Text
            style={[
              styles.descriptionText,
              isDark && styles.descriptionTextDark,
            ]}
          >
            {product.description}
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text
            style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
          >
            Specifications
          </Text>
          <View style={[styles.specCard, isDark && styles.specCardDark]}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>SKU</Text>
              <Text style={[styles.specValue, isDark && styles.specValueDark]}>
                {product.sku}
              </Text>
            </View>
            <View
              style={[styles.specDivider, isDark && styles.specDividerDark]}
            />
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Category</Text>
              <Text style={[styles.specValue, isDark && styles.specValueDark]}>
                {product.category}
              </Text>
            </View>
            <View
              style={[styles.specDivider, isDark && styles.specDividerDark]}
            />
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Warranty</Text>
              <Text style={[styles.specValue, isDark && styles.specValueDark]}>
                {product.warrantyInformation}
              </Text>
            </View>
            <View
              style={[styles.specDivider, isDark && styles.specDividerDark]}
            />
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Shipping</Text>
              <Text style={[styles.specValue, isDark && styles.specValueDark]}>
                {product.shippingInformation}
              </Text>
            </View>
            <View
              style={[styles.specDivider, isDark && styles.specDividerDark]}
            />
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Return Policy</Text>
              <Text style={[styles.specValue, isDark && styles.specValueDark]}>
                {product.returnPolicy}
              </Text>
            </View>
            <View
              style={[styles.specDivider, isDark && styles.specDividerDark]}
            />
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Dimensions</Text>
              <Text style={[styles.specValue, isDark && styles.specValueDark]}>
                {product.dimensions.width} x {product.dimensions.height} x{" "}
                {product.dimensions.depth} cm
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text
            style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
          >
            Customer Reviews
          </Text>
          {product.reviews.map((rev, index) => (
            <View
              key={index}
              style={[styles.reviewCard, isDark && styles.reviewCardDark]}
            >
              <View style={styles.reviewHeader}>
                <Text
                  style={[
                    styles.reviewerName,
                    isDark && styles.reviewerNameDark,
                  ]}
                >
                  {rev.reviewerName}
                </Text>
                <View style={styles.reviewStars}>
                  {[...Array(5)].map((_, i) => (
                    <MaterialCommunityIcons
                      key={i}
                      name="star"
                      size={14}
                      color={
                        i < rev.rating
                          ? "#FFB800"
                          : isDark
                            ? "#2C2C30"
                            : "#E5E5EA"
                      }
                    />
                  ))}
                </View>
              </View>
              <Text
                style={[
                  styles.reviewComment,
                  isDark && styles.reviewCommentDark,
                ]}
              >
                {rev.comment}
              </Text>
              <Text style={styles.reviewDate}>
                {new Date(rev.date).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, isDark && styles.bottomBarDark]}>
        <Pressable
          style={[
            styles.addToOrderButton,
            isDark && styles.addToOrderButtonDark,
          ]}
          onPress={addToOrders}
        >
          <MaterialCommunityIcons name="cart-plus" color="#FFFFFF" size={20} />
          <Text style={styles.addToOrderText}>Add to Orders</Text>
        </Pressable>
      </View>
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
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
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
  wishlistIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8F8FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFF1",
  },
  wishlistIconCircleDark: {
    backgroundColor: "#1E1E22",
    borderColor: "#2C2C30",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageGalleryContainer: {
    height: 280,
    width: "100%",
    backgroundColor: "#F8F8FA",
    justifyContent: "center",
    position: "relative",
  },
  imageGalleryContainerDark: {
    backgroundColor: "#1E1E22",
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: 260,
  },
  productImageDark: {
    backgroundColor: "#1E1E22",
  },
  paginationDots: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C7C7CC",
    marginHorizontal: 4,
  },
  dotDark: {
    backgroundColor: "#444448",
  },
  activeDot: {
    backgroundColor: "#5B1D88",
    width: 20,
  },
  activeDotDark: {
    backgroundColor: "#D0BCFF",
    width: 20,
  },
  mainInfoContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  brandText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  titleTextDark: {
    color: "#F4F4F4",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  starBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  starBadgeDark: {
    backgroundColor: "#2B281B",
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1C1C1E",
    marginLeft: 4,
  },
  ratingTextDark: {
    color: "#F4F4F4",
  },
  reviewsCountText: {
    fontSize: 13,
    color: "#8E8E93",
    marginRight: 12,
  },
  stockBadge: {
    backgroundColor: "#EAF9E7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockBadgeDark: {
    backgroundColor: "#182C1C",
  },
  stockText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#34C759",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5B1D88",
    marginRight: 10,
  },
  currentPriceDark: {
    color: "#D0BCFF",
  },
  originalPrice: {
    fontSize: 16,
    color: "#8E8E93",
    textDecorationLine: "line-through",
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  sectionTitleDark: {
    color: "#F4F4F4",
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#636366",
  },
  descriptionTextDark: {
    color: "#A0A0A5",
  },
  specCard: {
    backgroundColor: "#F8F8FA",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#EFEFF1",
  },
  specCardDark: {
    backgroundColor: "#1E1E22",
    borderColor: "#2C2C30",
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  specLabel: {
    fontSize: 13,
    color: "#8E8E93",
  },
  specValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  specValueDark: {
    color: "#E0E0E0",
  },
  specDivider: {
    height: 1,
    backgroundColor: "#EFEFF1",
  },
  specDividerDark: {
    backgroundColor: "#2C2C30",
  },
  reviewCard: {
    backgroundColor: "#F8F8FA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EFEFF1",
  },
  reviewCardDark: {
    backgroundColor: "#1E1E22",
    borderColor: "#2C2C30",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  reviewerNameDark: {
    color: "#F4F4F4",
  },
  reviewStars: {
    flexDirection: "row",
  },
  reviewComment: {
    fontSize: 13,
    color: "#636366",
    marginBottom: 4,
  },
  reviewCommentDark: {
    color: "#A0A0A5",
  },
  reviewDate: {
    fontSize: 11,
    color: "#8E8E93",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: "#EFEFF1",
  },
  bottomBarDark: {
    backgroundColor: "#121212",
    borderTopColor: "#2C2C30",
  },
  addToOrderButton: {
    backgroundColor: "#5B1D88",
    height: 50,
    position: "relative",
    top: -20,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addToOrderButtonDark: {
    backgroundColor: "#7D3CB5",
  },
  addToOrderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
