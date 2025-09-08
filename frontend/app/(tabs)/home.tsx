import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "@/constants";
import Admin from "../src/screens/dashboard/admin";
import Login from "../src/screens/auth/login";
import { SafeAreaView } from "react-native-safe-area-context";

const home = () => {
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${baseUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdminData(res.data);
        // console.log("home profile data", res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  if (loading) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        height: "100%",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Hii {adminData?.name + "!"}
      </Text>

      {adminData?.role === "superadmin" && (
        <View>
          <Admin />
        </View>
      )}
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});
