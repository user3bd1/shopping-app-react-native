import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "@/app/components/home";
import OrdersScreen from "@/app/components/orders";
import ProfileScreen from "@/app/components/profile";
import RegisterScreen from "@/app/components/register";
import WishListScreen from "@/app/components/wishList";
import LoginScreen from "@/app/index";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="index"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="register"
          component={RegisterScreen}
          options={{ title: "Register" }}
        />
        <Stack.Screen
          name="profile"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="orders"
          component={OrdersScreen}
          options={{ title: "Orders" }}
        />
        <Stack.Screen
          name="wishlist"
          component={WishListScreen}
          options={{ title: "Wish List" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
