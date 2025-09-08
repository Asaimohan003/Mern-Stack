import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { baseUrl } from "@/constants";

const AssignTask = () => {
  const { userId, name } = useLocalSearchParams<{
    userId?: string;
    name?: string;
  }>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Validation Error", "Title and description are required.");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        return;
      }

      await axios.post(
        `${baseUrl}/admin/assigntask`,
        {
          workerid: userId,
          title,
          description,
          status: "pending",
          name: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      ToastAndroid.show(
        `Task Sucessfully assigned to ${name}`,
        ToastAndroid.SHORT
      );
      router.back();
    } catch (error: any) {
      console.error("Error assigning task:", error.response?.data || error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to assign task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ✅ Header with back button */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Task</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Worker name</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={name}
          editable={false} // ✅ read-only field
        />
        <Text style={styles.label}>Worker ID</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={userId}
          editable={false} // ✅ read-only field
        />

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Task Title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Task Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* <Text style={styles.label}>Status</Text> */}
        {/* <TextInput
          style={[styles.input, styles.disabledInput]}
          placeholder="Enter Status"
          value="Pending"
          editable={false}
        /> */}

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "gray" }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Assign Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssignTask;

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backBtn: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0", // ✅ visually show it's not editable
    color: "#555",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
