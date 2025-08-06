import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

export default function BottomMenu({ activeScreen = "home" }: { activeScreen?: string }) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#9affe6ec', '#cffeecec', '#9affe6ec']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <Link href="/screens/HomeScreen" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[
              styles.iconContainer,
              activeScreen === "home" && styles.activeIconContainer
            ]}>
              <Feather
                name="home"
                size={20}
                color={activeScreen === "home" ? "#fefefe":"#0bac9e"}
              />
            <Text style={[
              styles.menuItemText,
              activeScreen === "home" && styles.menuItemTextActive
            ]}>
              Home
            </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/screens/EntryScreen" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[
              styles.iconContainer,
              activeScreen === "entry" && styles.activeIconContainer
            ]}>
              <Feather
                name="calendar"
                size={20}
                color={activeScreen === "entry" ? "#fefefe":"#0bac9e"}
              />
            <Text style={[
              styles.menuItemText,
              activeScreen === "entry" && styles.menuItemTextActive
            ]}>
              Entry
            </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/screens/ReportScreen" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[
              styles.iconContainer,
              activeScreen === "report" && styles.activeIconContainer
            ]}>
              <Feather
                name="bar-chart"
                size={20}
                color={activeScreen === "report" ?  "#fefefe":"#0bac9e"}
              />
            <Text style={[
              styles.menuItemText,
              activeScreen === "report" && styles.menuItemTextActive
            ]}>
              Reports
            </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/screens/DetailsScreen" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[
              styles.iconContainer,
              activeScreen === "details" && styles.activeIconContainer
            ]}>
              <Feather
                name="settings"
                size={20}
                color={activeScreen === "details" ? "#fefefe":"#0bac9e"}
              />
              
            <Text style={[
              styles.menuItemText,
              activeScreen === "details" && styles.menuItemTextActive
            ]}>
              Profile
            </Text>
            </View>
          </TouchableOpacity>
        </Link>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    width:"100%",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 50,
    height: 60,
    width:"95%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    gap: 4,
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconContainer: {
    backgroundColor: "#0bac9e",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemText: {
    display: "none"
  },
  menuItemTextActive: {
    color: "#ffffff",
    display:"contents",
    fontWeight: "600",
  },
});