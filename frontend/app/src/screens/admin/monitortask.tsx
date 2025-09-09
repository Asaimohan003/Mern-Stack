import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "@/constants";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  workerId: string;
  path: string;
}

const Monitortask = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchTask = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        return;
      }

      const res = await axios.get<{ task: Task; message: string }>(
        `${baseUrl}/task/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTask(res.data.task);
    } catch (err: any) {
      console.error("Error fetching task:", err.response?.data || err);
      Alert.alert("Error", "Unable to fetch task details");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (id) fetchTask();
    }, [id])
  );

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        return;
      }

      const res = await axios.patch(
        `${baseUrl}/task/update/${id}`,
        { status: newStatus.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Task status updated!");
      setTask(res.data.task);
      setModalVisible(false);
    } catch (err: any) {
      console.error("Error updating task:", err.response?.data || err);
      Alert.alert(
        "Error",
        err.response?.data?.error || "Unable to update task status"
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Loading task details...
        </Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#666", fontSize: 16 }}>
          No task details available
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Monitor Task</Text>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{task.title}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{task.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Status</Text>
          <Text
            style={[
              styles.value,
              task.status === "successfully completed" ||
              task.status === "completed"
                ? styles.completed
                : task.status === "working"
                ? styles.working
                : task.status === "rejected"
                ? styles.rejected
                : task.status === "in progress"
                ? styles.inProgress
                : task.status === "accepted"
                ? styles.accepted
                : task.status === "pending"
                ? styles.pending
                : null,
            ]}
          >
            {task.status.toUpperCase()}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Worker ID</Text>
          <Text style={styles.value}>{task.workerId}</Text>
        </View>

        {task.path ? (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Attached File</Text>
            <Image
              source={{ uri: `${baseUrl}${task.path}` }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
        ) : null}

        {/* Update Status Button */}
        {task.status !== "successfully completed" ? (
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.updateBtnText}>Update Status</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.updateBtn, { backgroundColor: "#ccc" }]}
            disabled
          >
            <Text style={[styles.updateBtnText, { color: "#666" }]}>
              Task Successfully Completed
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal for status update */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Task Status</Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => handleUpdateStatus("Rejected")}
            >
              <Text style={styles.modalBtnText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => handleUpdateStatus("Successfully Completed")}
            >
              <Text style={styles.modalBtnText}>Successfully Completed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalBtnText, { color: "#000" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Monitortask;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    // marginTop: -15,
    borderBottomColor: "#eee",
  },
  backBtn: { marginRight: 15, padding: 5 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#000" },
  body: { padding: 20 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 14, color: "#888", marginBottom: 5 },
  value: { fontSize: 16, color: "#000", fontWeight: "500" },
  completed: { color: "#27ae60" },
  working: { color: "#2980b9" },
  inProgress: { color: "#8e44ad" },
  accepted: { color: "#f39c12" },
  pending: { color: "#949393ff" },
  rejected: { color: "#e74c3c" },
  updateBtn: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  updateBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 15 },
  modalBtn: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  },
  modalBtnText: { color: "#fff", fontSize: 16 },
  previewContainer: {
    marginBottom: 15,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});
