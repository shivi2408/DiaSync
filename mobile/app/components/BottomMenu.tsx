import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Feather,AntDesign ,Entypo,Ionicons   } from "@expo/vector-icons";
import { Link } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

export default function BottomMenu({ activeScreen = "home" }: { activeScreen?: string }) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#1a1a1ad2', '#1f1f1fe0', '#1a1a1ad2']}
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
              <AntDesign 
                name="home"
                size={22}
                color={activeScreen === "home" ? "#2c2c2c" : "#fefefe"}
              />
              {activeScreen === "home" && (
                <Text style={styles.menuItemTextActive}>
                  Home
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/screens/EntryScreen" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[
              styles.iconContainer,
              activeScreen === "entry" && styles.activeIconContainer
            ]}>
              <Ionicons  
                name="add-circle-outline"
                size={24}
                color={activeScreen === "entry" ? "#2c2c2c" : "#fefefe"}
              />
              {activeScreen === "entry" && (
                <Text style={styles.menuItemTextActive}>
                  Entry
                </Text>
              )}
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
                size={22}
                color={activeScreen === "report" ? "#2c2c2c" : "#fefefe"}
              />
              {activeScreen === "report" && (
                <Text style={styles.menuItemTextActive}>
                  Reports
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/screens/DetailsScreen" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[
              styles.iconContainer,
              activeScreen === "details" && styles.activeIconContainer
            ]}>
              <AntDesign
                name="setting"
                size={22}
                color={activeScreen === "details" ? "#2c2c2c" : "#fefefe"}
              />
              {activeScreen === "details" && (
                <Text style={styles.menuItemTextActive}>
                  Profile
                </Text>
              )}
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
    bottom: 12,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 50,
    height: 60,
    width: "85%",
    maxWidth: 500,
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
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconContainer: {
    backgroundColor: "#ecececff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemTextActive: {
    color: "#1b1b1b",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
});