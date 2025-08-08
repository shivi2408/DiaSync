// app/screens/DetailsScreen.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import usePatientData from "../hooks/usePatientData";
import BottomMenu from "../components/BottomMenu";

export default function DetailsScreen() {
  const router = useRouter();
  const { patientData, isLoading } = usePatientData();

  const editDetails = () => {
    if (!patientData) return;

    router.push({
      pathname: "/screens/PatientSetupScreen",
      params: {
        mode: "edit",
        ...patientData,
        insulins: JSON.stringify(patientData.insulins),
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8ec1e2ff" />
      </View>
    );
  }

  if (!patientData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#212529" />
          </TouchableOpacity>
          <Text style={styles.title}>Patient Information</Text>
          <View style={styles.editButton} />
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No patient data found</Text>
        </View>
        <BottomMenu activeScreen="details" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#212529" />
          </TouchableOpacity>
          <Text style={styles.title}>Patient Information</Text>
          <TouchableOpacity onPress={editDetails} style={styles.editButton}>
            <FontAwesome5 name="edit" size={22} color="#212529" />
          </TouchableOpacity>
        </View>

        {/* Rest of your existing JSX remains the same */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{patientData.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{patientData.age}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>{patientData.gender}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diabetes Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>
              Type {patientData.diabetesType}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Diagnosed in:</Text>
            <Text style={styles.infoValue}>{patientData.startYear}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Target Range:</Text>
            <Text style={styles.infoValue}>
              {patientData.targetMin}-{patientData.targetMax} mg/dL
            </Text>
          </View>
        </View>

        {patientData.insulins.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insulin Management</Text>
            {patientData.insulins.map((insulin, index) => (
              <View key={index} style={styles.insulinCard}>
                <Text style={styles.insulinName}>{insulin.name}</Text>
                {insulin.timings.map((timing, tIndex) => (
                  <Text key={tIndex} style={styles.timingText}>
                    • {timing}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {patientData.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text style={styles.notesText}>{patientData.notes}</Text>
          </View>
        )}
      </ScrollView>
      <BottomMenu activeScreen="details" />
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
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2b2b2bff",
    flex: 1,
    textAlign: "center",
  },
  editButton: {
    padding: 8,
  },
  section: {
    gap: 12,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 14,
    color: "#212529",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    color: "#4b5563",
  },
  insulinCard: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  insulinName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  timingText: {
    fontSize: 14,
    color: "#7a7f86ff",
  },
  notesText: {
    fontSize: 14,
    color: "#7a7f86ff",
    lineHeight: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100, // Account for bottom menu
  },
  noDataText: {
    fontSize: 18,
    color: "#4b5563",
    textAlign: "center",
  },
});
