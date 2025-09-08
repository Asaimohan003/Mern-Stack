import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { baseUrl } from "@/constants";
import AntDesign from "@expo/vector-icons/AntDesign";

// ✅ Define a User type (adjust fields as per your API response)
interface User {
  _id: string;
  name: string;
  email?: string;
}

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Error", "No token found. Please login again.");
          return;
        }

        const response = await axios.get<User[]>(`${baseUrl}/admin/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error: any) {
        console.error("Error fetching users:", error.response?.data || error);
        Alert.alert("Error", "The Session has been ended please login again");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const handleDeleteUser = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        return;
      }

      // Confirm before deleting
      Alert.alert(
        "Delete User",
        "Are you sure you want to delete this user and their tasks?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await axios.delete(`${baseUrl}/delete/user/${userId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                // ✅ Remove user from local state
                setUsers((prev) => prev.filter((user) => user._id !== userId));

                Alert.alert("Success", "User deleted successfully");
              } catch (error: any) {
                console.error("Delete error:", error.response?.data || error);
                Alert.alert("Error", "Failed to delete user");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Token error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleUserPress = (user: User) => {
    // ✅ Make sure to use _id instead of id
    router.push({
      pathname: "/src/screens/admin/assigntask",
      params: { userId: user._id, name: user.name },
    });
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleUserPress(item)}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        {/* <Text style={styles.id}>{item._id}</Text> */}
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDeleteUser(item._id)}
      >
        <AntDesign name="deleteuser" size={20} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workers</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#000"
          style={{ marginTop: 30 }}
        />
      ) : users.length === 0 ? (
        <Text style={styles.noUsers}>No users</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </SafeAreaView>
  );
};

export default AllUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backBtn: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  card: {
    flexDirection: "row", // ✅ align name + delete side by side
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  id: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },

  // name: {
  //   fontSize: 16,
  //   fontWeight: "500",
  // },
  noUsers: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
});
