import { Text, View } from "react-native";
import Login from "./src/screens/auth/login";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Login />
    </View>
  );
}
