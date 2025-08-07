import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link } from "expo-router";
import BottomMenu from "../components/BottomMenu";
import usePatientData from "../hooks/usePatientData";
import useEntries from "../hooks/useEntries";
import * as Location from 'expo-location';

export default function HomeScreen() {
  const { patientData, isLoading } = usePatientData();
  const { entries, isLoading: isLoadingEntries } = useEntries();
  const [greeting, setGreeting] = useState("Good morning");
  const [location, setLocation] = useState("Loading location...");

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
      if (status !== 'granted') {
        setLocation("Permission denied");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        // Reverse geocode to get city name
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
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
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!patientData) {
    return (
      <View style={styles.container}>
        <Text>No patient data found</Text>
      </View>
    );
  }

  // Calculate today's date
  const todayDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Get recent entries (sorted by date, newest first)
  const recentEntries = entries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2); // Show only the 3 most recent entries

  // Calculate today's average blood sugar
  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date).toDateString();
    return entryDate === new Date().toDateString();
  });

  const todayAverage = todayEntries.length > 0
    ? (todayEntries.reduce((sum, entry) => sum + parseFloat(entry.bloodSugar), 0) / todayEntries.length).toFixed(1)
    : null;


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: "../../assets/images/react-logo.png" }}
              style={styles.avatar}
            />
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

        {/* Search Bar */}
        {/* <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries, reports, etc."
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.micButton}>
            <Feather name="mic" size={20} color="white" />
          </TouchableOpacity>
        </View> */}

        {/* Daily Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <Text style={styles.sectionDate}>{todayDate}</Text>
          </View>
          <View style={styles.dailySummaryGrid}>
            <View style={styles.summaryCard}>
              <MaterialCommunityIcons name="blood-bag" size={24} color="#075985" />
              <Text style={styles.summaryLabel}>Blood Sugar</Text>
              <Text style={styles.summaryValue}>
                {todayAverage ? `${todayAverage} mg/dL` : 'No data'}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <FontAwesome5 name="syringe" size={24} color="#075985" />
              <Text style={styles.summaryLabel}>Today's Insulin</Text>
              <Text style={styles.summaryValue}>
                {todayEntries.length > 0 
                  ? todayEntries.reduce((count, entry) => count + entry.insulinEntries.length, 0)
                  : 0} doses
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <MaterialCommunityIcons name="food-apple" size={24} color="#075985" />
              <Text style={styles.summaryLabel}>Diabetes Type</Text>
              <Text style={styles.summaryValue}>Type {patientData.diabetesType}</Text>
            </View>
            <View style={styles.summaryCard}>
              <MaterialCommunityIcons name="calendar" size={24} color="#075985" />
              <Text style={styles.summaryLabel}>Diagnosed</Text>
              <Text style={styles.summaryValue}>{patientData.startYear}</Text>
            </View>
          </View>
        </View>

        {/* Recent Entries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            <Link href="/screens/ReportScreen" style={styles.viewAll}>
              View All
            </Link>
          </View>

          {recentEntries.length > 0 ? (
            <View style={styles.entriesContainer}>
              {recentEntries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTime}>
                      {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={styles.entryBloodSugar}>
                      {entry.bloodSugar} mg/dL
                    </Text>
                  </View>
                  {entry.insulinEntries.length > 0 && (
                    <View style={styles.insulinContainer}>
                      <FontAwesome5 name="syringe" size={16} color="#4b5563" />
                      <Text style={styles.insulinText}>
                        {entry.insulinEntries.map(ins => `${ins.type} (${ins.amount}u)`).join(', ')}
                      </Text>
                    </View>
                  )}
                  {entry.notes && (
                    <Text style={styles.entryNotes} numberOfLines={2}>
                      <Feather name="edit-2" size={14} color="#4b5563" /> {entry.notes}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons 
                name="clipboard-text-outline" 
                size={48} 
                color="#9CA3AF" 
              />
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
  scrollViewContent: {
    padding: 24,
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
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#139C8B",
  },
  greeting: {
    fontSize: 16,
    color: "#4b5563",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#075985",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  location: {
    fontSize: 14,
    color: "#4b5563",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    color: "#374151",
  },
  micButton: {
    backgroundColor: "#075985",
    borderRadius: 8,
    padding: 8,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#075985",
  },
  sectionDate: {
    fontSize: 16,
    color: "#4b5563",
    fontWeight: "500",
  },
  viewAll: {
    fontSize: 16,
    color: "#139C8B",
    fontWeight: "600",
  },
  dailySummaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#075985",
    textAlign: "center",
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0f2fe",
    gap: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  addEntryButton: {
    backgroundColor: "#139C8B",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addEntryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  entriesContainer: {
    gap: 12,
  },
  entryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  entryTime: {
    fontSize: 16,
    color: "#4b5563",
  },
  entryBloodSugar: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#075985",
  },
  insulinContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  insulinText: {
    fontSize: 14,
    color: "#4b5563",
  },
  entryNotes: {
    fontSize: 14,
    color: "#4b5563",
    fontStyle: "italic",
  },
});