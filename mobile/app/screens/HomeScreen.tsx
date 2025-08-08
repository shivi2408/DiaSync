import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import BottomMenu from "../components/BottomMenu";
import Avatar from "../components/Avatar";
import usePatientData from "../hooks/usePatientData";
import useEntries from "../hooks/useEntries";

export default function HomeScreen() {
  const router = useRouter();
  const { patientData, isLoading } = usePatientData();
  const { entries, isLoading: isLoadingEntries } = useEntries();
  const [greeting, setGreeting] = useState("Good morning");
  const [location, setLocation] = useState("Permission denied");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Permission denied");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Reverse geocode to get city name
        const geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (geocode[0]?.city && geocode[0]?.region) {
          setLocation(`${geocode[0].city}, ${geocode[0].region}`);
        } else {
          setLocation("Location found");
        }
      } catch (error) {
        console.error("Error getting location:", error);
        setLocation("Unable to get location");
      }
    })();
  }, []);

  if (isLoading || isLoadingEntries) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8ec1e2ff" />
      </View>
    );
  }

  if (!patientData) {
    return (
      <View style={styles.container}>
        {/* Centered no data content */}
        <View style={styles.noDataContainer}>
          <View style={styles.noDataContent}>
            <MaterialCommunityIcons
              name="account-question"
              size={48}
              color="#8ec1e2ff"
            />
            <Text style={styles.noDataTitle}>No Patient Data Found</Text>
            <Text style={styles.noDataMessage}>
              Please set up your patient profile to continue
            </Text>
            <TouchableOpacity
              style={styles.setupButton}
              onPress={() => router.push("/screens/PatientSetupScreen")}>
              <Text style={styles.setupButtonText}>Set Up Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Calculate today's date
  const todayDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const recentEntries = entries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const todayEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date).toDateString();
    return entryDate === new Date().toDateString();
  });

  const todayAverage =
    todayEntries.length > 0
      ? (
          todayEntries.reduce(
            (sum, entry) => sum + parseFloat(entry.bloodSugar),
            0
          ) / todayEntries.length
        ).toFixed(1)
      : null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar name={patientData.name} size={40} />
            <View>
              <Text style={styles.greeting}>{greeting}!</Text>
              <Text style={styles.userName}>{patientData.name}</Text>
            </View>
          </View>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={16} color="#4b5563" />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>

        {/* Daily Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Overview</Text>
            <Text style={styles.sectionDate}>{todayDate}</Text>
          </View>
          <View style={styles.dailySummaryGrid}>
            <View style={styles.summaryCard}>
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconBackground,
                    { backgroundColor: "rgba(129, 129, 129, 0.1)" },
                  ]}>
                  <Fontisto name="blood-drop" size={24} color="#a11135ff" />
                </View>
              </View>
              <Text style={styles.summaryLabel}>Blood Sugar</Text>
              <Text style={styles.summaryValue}>
                {todayAverage ? `${todayAverage} mg/dL` : "No data"}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconBackground,
                    { backgroundColor: "rgba(129, 129, 129, 0.1)" },
                  ]}>
                  <Fontisto
                    name="injection-syringe"
                    size={24}
                    color="#01488fff"
                  />
                </View>
              </View>
              <Text style={styles.summaryLabel}>Today&apos;s Insulin</Text>
              <Text style={styles.summaryValue}>
                {todayEntries.length > 0
                  ? todayEntries.reduce(
                      (count, entry) => count + entry.insulinEntries.length,
                      0
                    )
                  : 0}{" "}
                doses
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconBackground,
                    { backgroundColor: "rgba(129, 129, 129, 0.1)" },
                  ]}>
                  <MaterialCommunityIcons
                    name="food-variant"
                    size={24}
                    color="#00a15eff"
                  />
                </View>
              </View>
              <Text style={styles.summaryLabel}>Diabetes Type</Text>
              <Text style={styles.summaryValue}>
                Type {patientData.diabetesType}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconBackground,
                    { backgroundColor: "rgba(129, 129, 129, 0.1)" },
                  ]}>
                  <MaterialCommunityIcons
                    name="diabetes"
                    size={24}
                    color="#aa6000ff"
                  />
                </View>
              </View>
              <Text style={styles.summaryLabel}>Diagnosed</Text>
              <Text style={styles.summaryValue}>{patientData.startYear}</Text>
            </View>
          </View>
        </View>

        {/* Recent Entries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            <Link href="/screens/ReportScreen" asChild>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {recentEntries.length > 0 ? (
            <View style={styles.entriesContainer}>
              {recentEntries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTime}>
                      {new Date(entry.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    <Text style={styles.entryBloodSugar}>
                      {entry.bloodSugar} mg/dL
                    </Text>
                  </View>
                  {entry.insulinEntries.length > 0 && (
                    <View style={styles.insulinContainer}>
                      <View style={styles.syringeIconSmall} />
                      <Text style={styles.insulinText}>
                        {entry.insulinEntries
                          .map((ins) => `${ins.type} (${ins.amount}u)`)
                          .join(", ")}
                      </Text>
                    </View>
                  )}
                  {entry.notes && (
                    <Text style={styles.entryNotes} numberOfLines={2}>
                      <Feather name="edit-2" size={14} color="#4b5563" />{" "}
                      {entry.notes}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon} />
              <Text style={styles.emptyStateText}>No entries recorded yet</Text>
              <Link href="/screens/EntryScreen" asChild>
                <TouchableOpacity style={styles.addEntryButton}>
                  <Feather name="plus" size={20} color="white" />
                  <Text style={styles.addEntryButtonText}>Add First Entry</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomMenu activeScreen="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100, // Account for bottom menu
  },
  noDataContent: {
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  noDataTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#212529",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  noDataMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 300,
  },
  setupButton: {
    backgroundColor: "#212529",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 200,
  },
  setupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  scrollViewContent: {
    padding: 20,
    gap: 24,
    paddingBottom: 100, // Space for bottom menu
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "#EEF2FF",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#212529",
  },
  greeting: {
    fontSize: 16,
    color: "#6B7280",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  location: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    gap: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sectionDate: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  viewAll: {
    fontSize: 14,
    color: "#838383ff",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  dailySummaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    width: "48%",
    alignItems: "center",
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  iconContainer: {},
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  syringeIconSmall: {
    width: 13,
    height: 13,
    backgroundColor: "#c1e6ffff",
    borderRadius: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  emptyStateIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#E5E7EB",
    borderRadius: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  addEntryButton: {
    backgroundColor: "#212529",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addEntryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  entriesContainer: {
    gap: 12,
  },
  entryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryTime: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  entryBloodSugar: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212529",
  },
  insulinContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  insulinText: {
    fontSize: 14,
    color: "#6B7280",
  },
  entryNotes: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
  },
  bottomMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  homeIcon: {
    width: 20,
    height: 20,
    backgroundColor: "#212529",
    borderRadius: 4,
  },
  statsIcon: {
    width: 20,
    height: 20,
    backgroundColor: "#9CA3AF",
    borderRadius: 4,
  },
  settingsIcon: {
    width: 20,
    height: 20,
    backgroundColor: "#9CA3AF",
    borderRadius: 4,
  },
  menuText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  activeMenuItem: {
    backgroundColor: "rgba(129, 129, 129, 0.1)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeMenuText: {
    color: "#212529",
    fontWeight: "600",
  },
});
