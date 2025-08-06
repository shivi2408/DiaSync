import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import usePatientData from '../hooks/usePatientData';

export default function PatientSetupScreen() {
  const router = useRouter();
  const { savePatientData, patientData } = usePatientData();
  const params = useLocalSearchParams();
  const isEditMode = params.mode === 'edit';
  const [newTiming, setNewTiming] = useState("");

  // Initialize state with patientData if in edit mode
  const [insulins, setInsulins] = useState<Array<{
    name: string;
    timings: string[];
  }>>(isEditMode && patientData ? patientData.insulins : []);

  const [patientDetails, setPatientDetails] = useState({
    name: isEditMode && patientData ? patientData.name : "",
    age: isEditMode && patientData ? patientData.age : "",
    gender: isEditMode && patientData ? patientData.gender : "",
    diabetesType: isEditMode && patientData ? patientData.diabetesType : "1",
    startYear: isEditMode && patientData ? patientData.startYear : "",
    targetMin: isEditMode && patientData ? patientData.targetMin : "70",
    targetMax: isEditMode && patientData ? patientData.targetMax : "180",
    notes: isEditMode && patientData ? patientData.notes : ""
  });

  const addInsulin = () => {
    setInsulins([...insulins, { name: "", timings: [] }]);
  };

  const updateInsulinName = (index: number, name: string) => {
    const newInsulins = [...insulins];
    newInsulins[index].name = name;
    setInsulins(newInsulins);
  };

  const addNewTiming = (insulinIndex: number) => {
    if (newTiming.trim()) {
      const newInsulins = [...insulins];
      newInsulins[insulinIndex].timings.push(newTiming);
      setInsulins(newInsulins);
      setNewTiming("");
    }
  };

  const deleteTiming = (insulinIndex: number, timingIndex: number) => {
    const newInsulins = [...insulins];
    newInsulins[insulinIndex].timings.splice(timingIndex, 1);
    setInsulins(newInsulins);
  };

  const handleInputChange = (field: string, value: string) => {
    setPatientDetails({...patientDetails, [field]: value});
  };

  const completeSetup = async () => {
    const data = {
      ...patientDetails,
      insulins: insulins.filter(insulin => insulin.name.trim() !== "")
    };
    await savePatientData(data);
    router.push("/screens/DetailsScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditMode ? "Edit Patient Details" : "Patient Setup"}
        </Text>
        <Text style={styles.subtitle}>
          {isEditMode ? "Update your diabetes care profile" : "Let's set up your diabetes care profile"}
        </Text>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Name</Text>
        <TextInput
          style={styles.input}
          placeholder={isEditMode ? "" : "Enter your name"}
          placeholderTextColor="#acacac"
          value={patientDetails.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
      </View>

      {/* Diabetes Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diabetes Start Year</Text>
        <TextInput
          style={styles.input}
          placeholder={isEditMode ? "" : "e.g., 2020"}
          placeholderTextColor="#acacac"
          keyboardType="numeric"
          value={patientDetails.startYear}
          onChangeText={(text) => handleInputChange('startYear', text)}
        />
      </View>

      {/* Insulin Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insulin Types & Times</Text>
        {insulins.map((insulin, insulinIndex) => (
          <View key={insulinIndex} style={styles.insulinCard}>
            <TextInput
              style={styles.input}
              placeholder="Insulin name (e.g., Humalog)"
              placeholderTextColor="#acacac"
              value={insulin.name}
              onChangeText={(text) => updateInsulinName(insulinIndex, text)}
            />
            
            <View style={styles.timingsContainer}>
              {insulin.timings.map((timing, timingIndex) => (
                <View key={timingIndex} style={styles.timingPill}>
                  <Text style={styles.timingText}>{timing}</Text>
                  <TouchableOpacity 
                    onPress={() => deleteTiming(insulinIndex, timingIndex)}
                    style={styles.deletePillButton}
                  >
                    <Text style={styles.deletePillText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            <View style={styles.addTimingContainer}>
              <TextInput
                style={styles.newTimingInput}
                placeholder="Time (e.g., Morning, Evening)"
                placeholderTextColor="#acacac"
                value={newTiming}
                onChangeText={setNewTiming}
                onSubmitEditing={() => addNewTiming(insulinIndex)}
              />
              <TouchableOpacity 
                style={styles.addTimingButton}
                onPress={() => addNewTiming(insulinIndex)}
              >
                <Text style={styles.addTimingButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.addInsulinButton} 
          onPress={addInsulin}
        >
          <MaterialCommunityIcons name="needle" size={20} color="white" />
          <Text style={styles.addInsulinButtonText}>Add Insulin Type</Text>
        </TouchableOpacity>
      </View>

      {/* Complete/Update Button */}
      <TouchableOpacity 
        style={styles.completeButton} 
        onPress={completeSetup}
      >
        <Text style={styles.completeButtonText}>
          {isEditMode ? "Update Profile" : "Complete Setup"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f9ff",
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#139686",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#075985",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f8fafc",
    color: "#5a5a5a",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0f2fe",
    marginBottom: 12,
  },
  insulinCard: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  timingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  timingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#e0f2fe",
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 6,
    borderRadius: 20,
  },
  timingText: {
    color: "#075985",
    fontSize: 14,
  },
  deletePillButton: {
    marginLeft: 6,
  },
  deletePillText: {
    color: "#ef4444",
    fontWeight: 'bold',
  },
  addTimingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  newTimingInput: {
    flex: 1,
    backgroundColor: "#f8fafc",
    color: "#5a5a5a",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  addTimingButton: {
    backgroundColor: "#139C8B",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addTimingButtonText: {
    color: "white",
    fontWeight: 'bold',
  },
  addInsulinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    backgroundColor: "#139C8B",
    borderRadius: 8,
    marginTop: 8,
  },
  addInsulinButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: "#139C8B",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  completeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});