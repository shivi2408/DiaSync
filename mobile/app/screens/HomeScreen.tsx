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
  const currentYear = new Date().getFullYear();
  const yearsManaged = patientData?.startYear
    ? currentYear - parseInt(patientData.startYear)
    : 0;

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

  const bloodSugarStatus = todayAverage
    ? parseFloat(todayAverage) <
      parseFloat(patientData?.targetMin?.toString() || "70")
      ? "Low"
      : parseFloat(todayAverage) >
        parseFloat(patientData?.targetMax?.toString() || "130")
      ? "High"
      : "Normal"
    : "No data";

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
              <View style={styles.summaryHeader}>
                <Fontisto
                  name="blood-drop"
                  size={16}
                  color="#a11135ff"
                  style={styles.summaryIcon}
                />
                <Text style={styles.summaryLabel}>Blood Sugar</Text>
              </View>
              <Text style={styles.summaryValue}>
                {todayAverage ? `${todayAverage} mg/dL` : "No data"}
              </Text>
              <View style={styles.summaryStatusContainer}>
                <Text
                  style={[
                    styles.summaryStatus,
                    {
                      color:
                        bloodSugarStatus === "High"
                          ? "#a11135ff"
                          : bloodSugarStatus === "Low"
                          ? "#FFA500"
                          : "#00a15eff",
                    },
                  ]}>
                  {bloodSugarStatus}
                </Text>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Fontisto
                  name="injection-syringe"
                  size={16}
                  color="#01488fff"
                  style={styles.summaryIcon}
                />
                <Text style={styles.summaryLabel}>Today's Insulin</Text>
              </View>
              <Text style={styles.summaryValue}>
                {todayEntries.length > 0
                  ? todayEntries.reduce(
                      (count, entry) => count + entry.insulinEntries.length,
                      0
                    )
                  : 0}{" "}
                doses
              </Text>
              <View style={styles.summaryStatusContainer}>
                <Text style={[styles.summaryStatus, { color: "#00a15eff" }]}>
                  On track
                </Text>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <MaterialCommunityIcons
                  name="food-variant"
                  size={16}
                  color="#00a15eff"
                  style={styles.summaryIcon}
                />
                <Text style={styles.summaryLabel}>Diabetes Type</Text>
              </View>
              <Text style={styles.summaryValue}>
                Type {patientData?.diabetesType || "Unknown"}
              </Text>
              <View style={styles.summaryStatusContainer}>
                <Text style={styles.summaryStatus}>Managed</Text>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <MaterialCommunityIcons
                  name="diabetes"
                  size={16}
                  color="#aa6000ff"
                  style={styles.summaryIcon}
                />
                <Text style={styles.summaryLabel}>Diagnosed</Text>
              </View>
              <Text style={styles.summaryValue}>
                {yearsManaged} {yearsManaged === 1 ? "year" : "years"}
              </Text>
              <View style={styles.summaryStatusContainer}>
                <Text style={styles.summaryStatus}>
                  {patientData?.startYear || "Unknown"}
                </Text>
              </View>
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
              {recentEntries.map((entry) => {
                const entryStatus =
                  parseFloat(entry.bloodSugar) <
                  parseFloat(patientData?.targetMin?.toString() || "70")
                    ? "Low"
                    : parseFloat(entry.bloodSugar) >
                      parseFloat(patientData?.targetMax?.toString() || "130")
                    ? "High"
                    : "Normal";

                const entryDate = new Date(entry.date);
                const timeString = entryDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const dateString = entryDate.toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <View key={entry.id} style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <View>
                        <Text style={styles.entryDate}>{dateString}</Text>
                        <Text style={styles.entryTime}>{timeString}</Text>
                      </View>
                      <View style={styles.entryBloodSugarContainer}>
                        <Text
                          style=
                            {styles.entryBloodSugar}
                        >
                          {entry.bloodSugar} mg/dL
                        </Text>
                        <Text
                          style={[
                            styles.entryStatus,
                            {
                              color:
                                entryStatus === "High"
                                  ? "#a11135ff"
                                  : entryStatus === "Low"
                                  ? "#FFA500"
                                  : "#00a15eff",
                              backgroundColor:
                                entryStatus === "High"
                                  ? "#ff9db5ff"
                                  : entryStatus === "Low"
                                  ? "#ffe0a7ff"
                                  : "#c1ffe5ff",
                            },
                          ]}>
                          {entryStatus.toLowerCase()}
                        </Text>
                      </View>
                    </View>
                    {entry.insulinEntries.length > 0 && (
                      <View style={styles.insulinContainer}>
                        <Fontisto
                          name="injection-syringe"
                          size={14}
                          color="#01488fff"
                        />
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
                );
              })}
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
    paddingBottom: 100,
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
    paddingBottom: 100,
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
    fontSize: 13,
    color: "#838383ff",
    fontWeight: "500",
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
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryIcon: {
    width: 24,
    textAlign: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  summaryStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  summaryStatus: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  syringeIconSmall: {
    width: 13,
    height: 13,
    backgroundColor: "#c1e6ffff",
    borderRadius: 2,
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
    alignItems: "center",
  },
  entryDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  entryTime: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  entryBloodSugarContainer: {
    alignItems: "flex-end",
    gap:8
  },
  entryStatus: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
    paddingHorizontal: 6,
    paddingVertical:2,
    borderRadius:50
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
});
