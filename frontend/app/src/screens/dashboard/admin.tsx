import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";

const Admin = () => {
  return (
    <View style={styles.statsRow}>
      <TouchableOpacity
        style={styles.statCard}
        onPress={() => router.push("/src/screens/tasks/createTask")}
      >
        <Text style={styles.statLabel}>Create Task</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.statCard}
        onPress={() => router.push("/src/screens/tasks/allTasks")}
      >
        <Text style={styles.statLabel}>Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Admin;

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
    borderColor: "rgba(118, 120, 121, 1)",
    borderWidth: 1,
    height: 100,
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000ff",
  },
});
