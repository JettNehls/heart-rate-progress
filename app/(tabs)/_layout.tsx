import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="trends"
        options={{
          title: "Trends",
        }}
      />

      <Tabs.Screen
        name="health-info"
        options={{
          title: "Health Info",
        }}
      />
    </Tabs>
  );
}
