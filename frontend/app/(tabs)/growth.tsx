import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-gifted-charts";
import { baseUrl } from "@/constants";

const Growth = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setLoading(false);
        console.warn("You are not LOgged in");
        return;
      }

      const res = await axios.get(`${baseUrl}/status/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ textAlign: "center" }}>Loading Growth</Text>
      </SafeAreaView>
    );
  }

  if (!stats) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Failed to load stats</Text>
      </SafeAreaView>
    );
  }

  const barData = [
    { value: stats?.completed ?? 0, label: "Completed", frontColor: "#4CAF50" },
    {
      value: stats?.successfullyCompleted ?? 0,
      label: "Success",
      frontColor: "#2196F3",
    },
    { value: stats?.pending ?? 0, label: "Pending", frontColor: "#FFC107" },
    { value: stats?.rejected ?? 0, label: "Rejected", frontColor: "#F44336" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Total Tasks */}
      <View style={styles.headerCard}>
        <Text style={styles.totalTitle}>Total Tasks</Text>
        <Text style={styles.totalValue}>{stats?.totalTasks}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#FFC10720" }]}>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={[styles.statValue, { color: "#FFC107" }]}>
            {stats?.pending}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#F4433620" }]}>
          <Text style={styles.statLabel}>Rejected</Text>
          <Text style={[styles.statValue, { color: "#F44336" }]}>
            {stats?.rejected}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#4CAF5020" }]}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={[styles.statValue, { color: "#4CAF50" }]}>
            {stats?.completed}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#2196F320" }]}>
          <Text style={styles.statLabel}>Success</Text>
          <Text style={[styles.statValue, { color: "#2196F3" }]}>
            {stats?.successfullyCompleted}
          </Text>
        </View>
      </View>

      {/* Bar Chart */}
      {/* <Text style={styles.subTitle}>Task Status Comparison</Text>
      <View style={styles.chartWrapper}>
        {barData.some((item) => item.value > 0) && (
          <BarChart
            data={barData}
            barWidth={35}
            noOfSections={5}
            barBorderRadius={6}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelTextStyle={{ fontSize: 12 }}
            yAxisTextStyle={{ fontSize: 12 }}
          />
        )}
      </View> */}
    </SafeAreaView>
  );
};

export default Growth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  headerCard: {
    backgroundColor: "#c8c5c5ff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    borderColor: "rgba(98, 99, 99, 1)",
    borderWidth: 1,
  },
  totalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
    borderColor: "rgba(98, 99, 99, 1)",
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 12,
    textAlign: "center",
    color: "#333",
  },
  chartWrapper: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
