import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "@/constants";

const Add = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    role: "user",
  });

  const [currentRole, setCurrentRole] = useState<"admin" | "superadmin" | "">(
    ""
  );
  const [loading, setLoading] = useState(true);

  // for dropdown modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const roleOptions = ["user", "admin"];

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const fetchCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        return;
      }

      const res = await axios.get(`${baseUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentRole(res.data.role); // "admin" or "superadmin"
    } catch (err) {
      console.error("Failed to fetch user:", err);
      Alert.alert("Error", "Could not fetch current user role.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        return;
      }

      const response = await axios.post(`${baseUrl}/add`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", response.data.message);
      console.log("User added:", response.data);

      setForm({ name: "", email: "", age: "", role: "user" });
    } catch (error: any) {
      if (error.response) {
        Alert.alert("Error", error.response.data.error || "Failed to add user");
      } else if (error.request) {
        Alert.alert("Error", "No response from server. Check your connection.");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add User Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => handleChange("email", text.toLowerCase())}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Age"
        keyboardType="numeric"
        value={form.age}
        onChangeText={(text) => handleChange("age", text)}
      />

      {currentRole === "superadmin" ? (
        <>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowRoleModal(true)}
          >
            <Text style={styles.dropdownText}>{form.role}</Text>
          </TouchableOpacity>

          {/* Custom Modal Dropdown */}
          <Modal visible={showRoleModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Select Role</Text>
                <FlatList
                  data={roleOptions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => {
                        handleChange("role", item);
                        setShowRoleModal(false);
                      }}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <Button
                  title="Cancel"
                  onPress={() => setShowRoleModal(false)}
                />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <TextInput style={styles.lockinput} value="user" editable={false} />
      )}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  lockinput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#b3b2b2b2",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
  },
});
