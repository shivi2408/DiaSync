// components/BottomMenu.tsx
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function BottomMenu({ activeScreen = "home" }: { activeScreen?: string }) {
  return (
    <View style={styles.container}>
      <Link href="/screens/HomeScreen" asChild>
        <TouchableOpacity style={styles.menuItem}>
          <Feather
            name="home"
            size={24}
            color={activeScreen === "home" ? "#139C8B" : "#9CA3AF"}
          />
          <Text style={[
            styles.menuItemText,
            activeScreen === "home" && styles.menuItemTextActive
          ]}>
            Home
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/screens/EntryScreen" asChild>
        <TouchableOpacity style={styles.menuItem}>
          <Feather
            name="plus"
            size={24}
            color={activeScreen === "entry" ? "#139C8B" : "#9CA3AF"}
          />
          <Text style={[
            styles.menuItemText,
            activeScreen === "entry" && styles.menuItemTextActive
          ]}>
            Entry
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/screens/ReportScreen" asChild>
        <TouchableOpacity style={styles.menuItem}>
          <Feather
            name="file-text"
            size={24}
            color={activeScreen === "report" ? "#139C8B" : "#9CA3AF"}
          />
          <Text style={[
            styles.menuItemText,
            activeScreen === "report" && styles.menuItemTextActive
          ]}>
            Report
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/screens/DetailsScreen" asChild>
        <TouchableOpacity style={styles.menuItem}>
          <Feather
            name="user"
            size={24}
            color={activeScreen === "details" ? "#139C8B" : "#9CA3AF"}
          />
          <Text style={[
            styles.menuItemText,
            activeScreen === "details" && styles.menuItemTextActive
          ]}>
            Profile
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf:"center",
    paddingVertical: 8,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    position: "absolute",
    width: "95%",
    borderRadius: 50,
    bottom: 16,
    left: 0,
    right: 0,
  },
  menuItem: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
  },
  menuItemTextActive: {
    color: "#139C8B",
  },
});