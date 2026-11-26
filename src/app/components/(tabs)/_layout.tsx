import { NativeTabs } from "expo-router/native-tabs";
import { useTheme } from "../../../context/ThemeContext";

export default function TabLayout() {
  const { isDark } = useTheme();

  const activeTint = isDark ? "#D0BCFF" : "#5B1D88";
  const indicatorBg = isDark ? "#2B223F" : "#EAE2F8";
  const barBg = isDark ? "#121212" : "#ffffff";
  const ripple = isDark ? "#2B223F" : "#EAE2F8";

  return (
    <NativeTabs
      tintColor={activeTint}
      backgroundColor={barBg}
      indicatorColor={indicatorBg}
      rippleColor={ripple}
      labelStyle={{
        fontSize: 12,
        fontWeight: "600",
      }}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="wishList">
        <NativeTabs.Trigger.Label>Wishlist</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="heart.fill" md="favorite" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bag.fill" md="shopping_bag" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
