// app/screens/PatientSetupScreen.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign, Feather, FontAwesome6  } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import usePatientData from "../hooks/usePatientData";

export default function PatientSetupScreen() {
  const router = useRouter();
  const { savePatientData } = usePatientData();
  const params = useLocalSearchParams();
  const isEditMode = params.mode === "edit";
  const [newTiming, setNewTiming] = useState("");

  // Parse the insulins if they exist in params
  const initialInsulins = params.insulins
    ? JSON.parse(params.insulins as string)
    : [];

  const [insulins, setInsulins] = useState<
    Array<{
      name: string;
      timings: string[];
    }>
  >(initialInsulins);

  const [patientDetails, setPatientDetails] = useState({
    name: (params.name as string) || "",
    age: (params.age as string) || "",
    gender: (params.gender as string) || "",
    diabetesType: (params.diabetesType as string) || "1",
    startYear: (params.startYear as string) || "",
    targetMin: (params.targetMin as string) || "70",
    targetMax: (params.targetMax as string) || "180",
    notes: (params.notes as string) || "",
  });

  // Handle case when params are loaded after component mounts
  useEffect(() => {
    if (isEditMode && params.insulins) {
      setInsulins(JSON.parse(params.insulins as string));
    }
  }, [params.insulins]);

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
    setPatientDetails({ ...patientDetails, [field]: value });
  };

  const completeSetup = async () => {
    const data = {
      ...patientDetails,
      insulins: insulins.filter((insulin) => insulin.name.trim() !== ""),
    };
    await savePatientData(data);
    router.push("/screens/DetailsScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* New Header with Back Button */}
      <View style={styles.headerContainer}>
        {isEditMode ? (
          <TouchableOpacity
            onPress={() => router.push("/screens/DetailsScreen")}
            style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#212529" />
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyBackButtonPlaceholder} />
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            {isEditMode ? "Edit Patient Details" : "Patient Setup"}
          </Text>
          <Text style={styles.subtitle}>
            {isEditMode
              ? "Update your diabetes care profile"
              : "Let's set up your diabetes care profile"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={completeSetup}
          style={styles.headerCompleteButton}>
          <Text style={styles.headerCompleteButtonText}>
            {isEditMode ? "Update" : "Done"}
          </Text>
        </TouchableOpacity>
      </View>

        <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.section}>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#acacac"
            value={patientDetails.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="30"
              placeholderTextColor="#acacac"
              keyboardType="numeric"
              value={patientDetails.age}
              onChangeText={(text) => handleInputChange("age", text)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              placeholder="Male"
              placeholderTextColor="#acacac"
              value={patientDetails.gender}
              onChangeText={(text) => handleInputChange("gender", text)}
            />
          </View>
        </View>
      </View>

<Text style={styles.sectionTitle}>Diabetes Information</Text>
      <View style={styles.section}>
        
        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Diabetes Type</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  patientDetails.diabetesType === "1" &&
                    styles.radioButtonSelected,
                ]}
                onPress={() => handleInputChange("diabetesType", "1")}>
                <Text
                  style={
                    patientDetails.diabetesType === "1"
                      ? styles.radioTextSelected
                      : styles.radioText
                  }>
                  Type 1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  patientDetails.diabetesType === "2" &&
                    styles.radioButtonSelected,
                ]}
                onPress={() => handleInputChange("diabetesType", "2")}>
                <Text
                  style={
                    patientDetails.diabetesType === "2"
                      ? styles.radioTextSelected
                      : styles.radioText
                  }>
                  Type 2
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Diagnosis Year</Text>
            <TextInput
              style={styles.input}
              placeholder="2025"
              placeholderTextColor="#acacac"
              keyboardType="numeric"
              value={patientDetails.startYear}
              onChangeText={(text) => handleInputChange("startYear", text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Target Min (mg/dL)</Text>
            <TextInput
              style={styles.input}
              placeholder="70"
              placeholderTextColor="#acacac"
              keyboardType="numeric"
              value={patientDetails.targetMin}
              onChangeText={(text) => handleInputChange("targetMin", text)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Target Max (mg/dL)</Text>
            <TextInput
              style={styles.input}
              placeholder="180"
              placeholderTextColor="#acacac"
              keyboardType="numeric"
              value={patientDetails.targetMax}
              onChangeText={(text) => handleInputChange("targetMax", text)}
            />
          </View>
        </View>
      </View>

<Text style={styles.sectionTitle}>Insulin Types & Times</Text>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Insulin </Text>
          {/* Changed to small plus button */}
          <TouchableOpacity onPress={addInsulin} style={styles.smallAddButton}>
            <FontAwesome6  name="add" size={16} color="#212529" />
          </TouchableOpacity>
        </View>
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
                    style={styles.deletePillButton}>
                    <Feather name="x" size={12} color="#962c2cff" />
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
                onPress={() => addNewTiming(insulinIndex)}>
                <Text style={styles.addTimingButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f9ff",
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
   emptyBackButtonPlaceholder: {
    width: 40, 
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0f2fe",
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212529",
  },
  formGroup: {
    gap: 8,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#212529",
  },
  input: {
    backgroundColor: "#f8fafc",
    color: "#5a5a5a",
    padding: 9,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 12,
  },
  radioButton: {
    flex: 1,
    padding: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: "#e0f2fe",
  },
  radioText: {
    color: "#64748b",
  },
  radioTextSelected: {
    color: "#212529",
    fontWeight: "500",
  },
  insulinCard: {
    backgroundColor: "#ffffffff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0f2fe",
    gap: 12,
  },
  timingsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 6,
    borderRadius: 20,
  },
  timingText: {
    color: "#212529",
    fontSize: 12,
  },
  deletePillButton: {
    marginLeft: 6,
  },
  addTimingContainer: {
    flexDirection: "row",
    gap: 8,
  },
  newTimingInput: {
    flex: 1,
    backgroundColor: "#f8fafc",
    color: "#5a5a5a",
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  addTimingButton: {
    backgroundColor: "#212529",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  addTimingButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  smallAddButton: {
    padding:8,
    borderRadius: 8,
    backgroundColor: "#e0f2fe",
  },
  headerCompleteButton: {
    backgroundColor: "#050505d8",
    padding: 7,
    borderRadius: 50,
  },
  headerCompleteButtonText: {
    color: "white",
    fontSize: 12,
  },
});
