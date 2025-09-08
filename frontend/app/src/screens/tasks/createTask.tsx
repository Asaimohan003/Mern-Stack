import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Alert,
  ScrollView,
  ToastAndroid,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "@/constants";

type User = {
  _id: string;
  name: string;
  email: string;
};

const CreateTask = () => {
  const [workerModalVisible, setWorkerModalVisible] = useState(false);
  const [teamModalVisible, setTeamModalVisible] = useState(false);

  const [workers, setWorkers] = useState<User[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Teams (hardcoded as per your request)
  const teams = ["React", "Angular", "Marketing", "Management"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          showToast("No token found. Please login again.");
          return;
        }

        const res = await axios.get<User[]>(`${baseUrl}/admin/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWorkers(res.data);
      } catch (err: any) {
        console.error("Error fetching users:", err.response?.data || err);
        showToast("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  // Toggle worker selection
  const toggleWorker = (id: string) => {
    if (selectedWorkers.includes(id)) {
      setSelectedWorkers(selectedWorkers.filter((w) => w !== id));
    } else {
      setSelectedWorkers([...selectedWorkers, id]);
    }
  };

  // Get selected worker names for display
  const selectedWorkerNames = workers
    .filter((w) => selectedWorkers.includes(w._id))
    .map((w) => w.name)
    .join(", ");

  // Toast helper
  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      selectedWorkers.length === 0 ||
      !selectedTeam
    ) {
      showToast("Please fill all fields before submitting.");
      return;
    }

    const payload = {
      workerIds: selectedWorkers,
      title,
      description,
      teamName: selectedTeam,
    };

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        showToast("No token found. Please login again.");
        return;
      }

      const res = await axios.post(
        `${baseUrl}/admin/assigntask/team`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Task Created:", res.data);
      showToast("Task created successfully!");
      router.back();
    } catch (error: any) {
      console.error("❌ Error creating task:", error.response?.data || error);
      showToast(error.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create Task</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Worker Picker */}
        <Text style={styles.label}>Workers</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setWorkerModalVisible(true)}
        >
          <Text style={{ color: selectedWorkers.length ? "#000" : "#aaa" }}>
            {selectedWorkerNames || "Select Workers"}
          </Text>
        </TouchableOpacity>

        {/* Team Picker */}
        <Text style={styles.label}>Team Name</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setTeamModalVisible(true)}
        >
          <Text style={{ color: selectedTeam ? "#000" : "#aaa" }}>
            {selectedTeam || "Select Team"}
          </Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Task Title"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Task Description"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Submit Task
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Worker Modal (with checkboxes) */}
      <Modal visible={workerModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Workers</Text>
            <FlatList
              data={workers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const isSelected = selectedWorkers.includes(item._id);
                return (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => toggleWorker(item._id)}
                  >
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={22}
                      color={isSelected ? "green" : "gray"}
                      style={{ marginRight: 10 }}
                    />
                    <View>
                      <Text style={{ fontSize: 16 }}>{item.name}</Text>
                      <Text style={{ fontSize: 12, color: "gray" }}>
                        {item.email}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setWorkerModalVisible(false)}
            >
              <Text style={{ color: "white" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Team Modal */}
      <Modal visible={teamModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Team</Text>
            <FlatList
              data={teams}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedTeam(item);
                    setTeamModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setTeamModalVisible(false)}
            >
              <Text style={{ color: "white" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { marginRight: 15, padding: 5 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#000" },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#fff",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeBtn: {
    marginTop: 15,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
});
