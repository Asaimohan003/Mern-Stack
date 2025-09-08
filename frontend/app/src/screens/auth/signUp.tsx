import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import axios from "axios";
import { baseUrl } from "@/constants";

const Signup = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log("Toast:", message); // fallback for iOS
    }
  };
  const handleSignup = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast("Please fill all fields");
      return;
    }

    axios
      .post(`${baseUrl}/signup`, {
        name,
        email,
        password,
      })
      .then((response) => {
        showToast("Signup successful! Please log in.");
        console.log("Signup successful:", response.data);
        router.push("/src/screens/auth/login");
      })
      .catch((error) => {
        if (error.response) {
          showToast(
            error.response.data.error || "Something went wrong. Try again."
          );
          console.error("Signup error:", error.response.data);
        } else if (error.request) {
          showToast("No response from server. Please check your connection.");
          console.error("Signup error - no response:", error.request);
        } else {
          showToast("Error: " + error.message);
          console.error("Signup error:", error.message);
        }
      });

    console.log("Signing up with:", { name, email, password });
  };

  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign-Up✨</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#888"
        value={age}
        onChangeText={setAge}
      /> */}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Superadmin" value="superadmin" />
        </Picker>
      </View> */}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/src/screens/auth/login")}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  dropdownContainer: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#4A90E2",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#555",
  },
  loginLink: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
});
