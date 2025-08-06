// app/screens/DetailsScreen.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import usePatientData from '../hooks/usePatientData';

export default function DetailsScreen() {
  const router = useRouter();
  const { patientData } = usePatientData();

  const editDetails = () => {
    router.push("/screens/PatientSetupScreen");
  };

  if (!patientData) {
    return (
      <View style={styles.container}>
        <Text>No patient data found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patient Information</Text>
        <TouchableOpacity onPress={editDetails} style={styles.editButton}>
          <Feather name="edit" size={20} color="#139C8B" />
        </TouchableOpacity>
      </View>

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
          <Text style={styles.infoValue}>Type {patientData.diabetesType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Diagnosed in:</Text>
          <Text style={styles.infoValue}>{patientData.startYear}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Target Range:</Text>
          <Text style={styles.infoValue}>{patientData.targetMin}-{patientData.targetMax} mg/dL</Text>
        </View>
      </View>

      {patientData.insulins.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insulin Management</Text>
          {patientData.insulins.map((insulin, index) => (
            <View key={index} style={styles.insulinCard}>
              <Text style={styles.insulinName}>{insulin.name}</Text>
              {insulin.timings.map((timing, tIndex) => (
                <Text key={tIndex} style={styles.timingText}>• {timing}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f9ff",
    padding: 24,
    gap: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#139686",
  },
  editButton: {
    padding: 8,
  },
  section: {
    gap: 12,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#075985",
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: "#075985",
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
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
    fontWeight: '600',
    color: "#075985",
  },
  timingText: {
    fontSize: 14,
    color: "#4b5563",
  },
  notesText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
});