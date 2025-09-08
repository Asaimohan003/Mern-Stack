import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { baseUrl } from "@/constants";

type User = {
  _id: string;
  name: string;
  email: string;
  age: number;
};

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
};

const Supervise = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Error", "No token found. Please login again.");
          return;
        }

        const res = await axios.get<User[]>(`${baseUrl}/admin/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data);
      } catch (err: any) {
        console.error("Error fetching users:", err.response?.data || err);
        Alert.alert("Error", "Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  const fetchTasks = async (workerId: string) => {
    try {
      setLoadingTasks(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        return;
      }

      const res = await axios.get<{ tasks: Task[] }>(
        `${baseUrl}/task/worker/${workerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks(res.data.tasks);
    } catch (err: any) {
      console.error("Error fetching tasks:", err.response?.data || err);
      Alert.alert("Error", "Failed to load tasks");
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSelectedUser(null);
      setTasks([]);
      setShowModal(false);
      // refresh users on reset
      const refreshUsers = async () => {
        try {
          const token = await AsyncStorage.getItem("userToken");
          if (token) {
            const res = await axios.get<User[]>(`${baseUrl}/admin/user`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
          }
        } catch (err) {
          console.error("Error refreshing users:", err);
        }
      };
      refreshUsers();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Button to open modal */}
      <Text style={styles.headText}>Select Worker</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedUser ? selectedUser.name : "Select Worker"}
        </Text>
      </TouchableOpacity>

      {/* Custom Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose a Worker</Text>

            <FlatList
              data={users}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedUser(item);
                    fetchTasks(item._id); // Fetch tasks when selecting
                    setShowModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  <Text style={styles.modalSubText}>{item.email}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tasks List */}
      <View style={styles.tasksContainer}>
        <Text style={styles.tasksTitle}>Assigned Tasks</Text>
        {loadingTasks ? (
          <ActivityIndicator size="large" color="#374151" />
        ) : tasks.length > 0 ? (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.taskCard}
                onPress={() =>
                  router.push({
                    pathname: "/src/screens/admin/monitortask",
                    params: { id: item._id },
                  })
                }
              >
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDesc}>{item.description}</Text>
                {/* <Text style={styles.taskStatus}>Status: {item.status}</Text>
                <Text>{item._id}</Text> */}
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noTasksText}>No tasks found</Text>
        )}
      </View>
    </View>
  );
};

export default Supervise;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  headText: { fontSize: 15, fontWeight: "bold", marginBottom: 10 },
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownButtonText: { fontSize: 16, color: "#374151" },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: { fontSize: 16, fontWeight: "500", color: "#111" },
  modalSubText: { fontSize: 14, color: "#555" },
  closeButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#374151",
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontWeight: "600" },

  tasksContainer: { flex: 1, marginTop: 20 },
  tasksTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  taskCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  taskTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  taskDesc: { fontSize: 14, color: "#444", marginTop: 4 },
  taskStatus: { fontSize: 14, color: "#1D4ED8", marginTop: 6 },
  noTasksText: { fontSize: 14, color: "#555", textAlign: "center" },
});
