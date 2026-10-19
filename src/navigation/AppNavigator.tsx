import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "@/app";
import RegisterScreen from "@/components/register";

const RootStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
  },
});
type RootStackType = typeof RootStack;
declare module "@react-navigation/native" {
  interface RootNavigator extends RootStackType {}
}
const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
