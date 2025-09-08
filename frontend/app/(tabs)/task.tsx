import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { baseUrl } from "../../constants";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  workerid: string;
}

const TaskScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true); // initial page loader
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh loader
  const [profileData, setProfileData] = useState<any>(null);

  const fetchProfileAndTasks = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        return;
      }

      // 1. Fetch profile
      const res = await axios.get(`${baseUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileData(res.data);
      const workerid = res.data._id;

      // 2. Fetch tasks
      const response = await axios.get<{ tasks: Task[]; message: string }>(
        `${baseUrl}/task/worker/${workerid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data.tasks);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error);
      if (error.response?.status === 404) {
        Alert.alert("No Tasks", "No tasks found for this worker.");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ This will run every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchProfileAndTasks();
    }, [])
  );

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileAndTasks();
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/src/screens/workers/taskupdate",
          params: { id: item._id },
        })
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Hide status if already successfully completed */}
      {item.status.toLowerCase() !== "successfully completed" && (
        <Text
          style={[
            styles.status,
            item.status.toLowerCase() === "completed" ||
            item.status.toLowerCase() === "successfully completed"
              ? styles.completed
              : item.status.toLowerCase() === "in progress" ||
                item.status.toLowerCase() === "in-progress"
              ? styles.inProgress
              : item.status.toLowerCase() === "working"
              ? styles.working
              : item.status.toLowerCase() === "accepted"
              ? styles.accepted
              : item.status.toLowerCase() === "pending"
              ? styles.pending
              : item.status.toLowerCase() === "rejected"
              ? styles.rejected
              : null,
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ color: "#666", marginTop: 10 }}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={renderTask}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.centered}>
          <Text style={{ color: "#666", fontSize: 16 }}>No tasks found</Text>
        </View>
      )}
    </View>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#444",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
  completed: { color: "#27ae60" },
  working: { color: "#2980b9" },
  inProgress: { color: "#8e44ad" },
  accepted: { color: "#f39c12" },
  pending: { color: "#949393ff" },
  rejected: { color: "#e74c3c" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
