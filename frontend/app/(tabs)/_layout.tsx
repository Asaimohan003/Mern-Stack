import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "@/constants";

export default function TabLayout() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        const res = await axios.get(`${baseUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRole(res.data.role);
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  // Show nothing until role is fetched (prevents blank tab flicker)
  if (loading) return null;

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "black" }}>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />

      {role === "admin" || role === "superadmin" ? (
        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="plus" color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="add"
          options={{
            // hides tab completely
            href: null,
          }}
        />
      )}
      {role === "admin" || role === "superadmin" ? (
        <Tabs.Screen
          name="supervise"
          options={{
            title: "Supervise",
            tabBarIcon: ({ color }) => (
              <AntDesign name="videocamera" size={24} color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="supervise"
          options={{
            // hides tab completely
            href: null,
          }}
        />
      )}
      {role === "superadmin" ? (
        <Tabs.Screen
          name="growth"
          options={{
            headerShown: false,
            title: "Growth",
            tabBarIcon: ({ color }) => (
              <Entypo name="line-graph" size={24} color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="growth"
          options={{
            // hides tab completely
            href: null,
          }}
        />
      )}
      {role === "user" ? (
        <Tabs.Screen
          name="task"
          options={{
            title: "Tasks",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="tasks" color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="task"
          options={{
            // hides tab completely
            href: null,
          }}
        />
      )}

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
