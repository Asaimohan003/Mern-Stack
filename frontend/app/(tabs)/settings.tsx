import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "@/constants";

export default function Tab() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      router.replace("/src/screens/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

        setProfileData(res.data);
        console.log("==>", res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push("/src/screens/profile/profile")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color="#000000ff"
              style={styles.buttonIcon}
            />
            <Text style={styles.primaryButtonText}>View Profile</Text>
          </TouchableOpacity>
          {(profileData?.role === "admin" ||
            profileData?.role === "superadmin") && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              activeOpacity={0.8}
              onPress={() => router.push("/src/screens/admin/allusers")}
            >
              <Ionicons
                name="people-outline"
                size={24}
                color="#000000ff"
                style={styles.buttonIcon}
              />
              <Text style={styles.primaryButtonText}>Users</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color="#ff0000ff"
              style={styles.buttonIcon}
            />
            <Text style={styles.secondaryButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 50,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: "#ffffffff",
    borderWidth: 2,
    borderColor: "#b1b1afff",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eba8a8ff",
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: "#000000ff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#dc3545",
    fontSize: 18,
    fontWeight: "600",
  },
});
