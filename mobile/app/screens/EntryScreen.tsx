import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Feather, FontAwesome6 ,Fontisto  } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import BottomMenu from "../components/BottomMenu";
import Toast from "react-native-toast-message";
import useEntries from "../hooks/useEntries";
import usePatientData from "../hooks/usePatientData";
import { useNavigation } from "@react-navigation/native";

export default function EntryScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Entry");
  const [bloodSugar, setBloodSugar] = useState("");
  const [insulinEntries, setInsulinEntries] = useState([
    { id: 1, type: "", amount: "", time: "" },
  ]);
  const [notes, setNotes] = useState("");
  const { addEntry, isLoading: isSaving } = useEntries();
  const { patientData } = usePatientData();

  const addInsulinEntry = () => {
    setInsulinEntries([
      ...insulinEntries,
      {
        id: insulinEntries.length + 1,
        type: "",
        amount: "",
        time: "",
      },
    ]);
  };

  const updateInsulinEntry = (id: number, field: string, value: string) => {
    setInsulinEntries(
      insulinEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removeInsulinEntry = (id: number) => {
    setInsulinEntries(insulinEntries.filter((entry) => entry.id !== id));
  };

  const insulinTypes =
    patientData?.insulins.map((insulin) => insulin.name) || [];

  // Get available times for selected insulin type
  const getAvailableTimes = (insulinType: string) => {
    if (!patientData) return [];
    const insulin = patientData.insulins.find((i) => i.name === insulinType);
    return insulin?.timings || [];
  };

  const handleSubmit = async () => {
    if (!bloodSugar) {
      Alert.alert("Validation Error", "Please enter blood sugar level.");
      return;
    }

    // Validate insulin entries
    const invalidInsulinEntries = insulinEntries.filter(
      (entry) =>
        (entry.type || entry.amount || entry.time) &&
        (!entry.type || !entry.amount || !entry.time)
    );

    if (invalidInsulinEntries.length > 0) {
      Alert.alert(
        "Validation Error",
        "Please complete all insulin entry fields or remove incomplete entries."
      );
      return;
    }

    try {
      await addEntry({
        bloodSugar,
        insulinEntries: insulinEntries.filter(
          (entry) => entry.type && entry.amount && entry.time
        ),
        notes,
      });

      // Reset form
      setBloodSugar("");
      setInsulinEntries([{ id: 1, type: "", amount: "", time: "" }]);
      setNotes("");

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Entry added successfully!",
        position: "bottom",
        visibilityTime: 3000,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save entry. Please try again.",
        position: "bottom",
        visibilityTime: 3000,
      });
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <View style={styles.header}>
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={styles.backButton}>
    <Feather name="chevron-left" size={24} color="#212529" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>New Entry</Text>
  <TouchableOpacity 
    onPress={handleSubmit}
    style={styles.headerAddButton}
    disabled={isSaving}
  >
    <Text style={styles.headerAddButtonText}>
      {isSaving ? "Saving..." : "Add"}
    </Text>
  </TouchableOpacity>
</View>

          <View style={styles.card}>
            <Text style={styles.cardSubtitle}>
              Record your blood sugar and insulin
            </Text>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Fontisto  name="blood-drop" size={18} color="#a11135ff" />
                <Text style={styles.inputLabel}>Blood Sugar (mg/dL)</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter blood sugar level"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={bloodSugar}
                onChangeText={setBloodSugar}
              />
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Feather name="edit-3" size={18} color="#0062c4ff" />
                <Text style={styles.inputLabel}>Insulin Entries</Text>
                <TouchableOpacity
                  onPress={addInsulinEntry}
                  style={styles.addInsulinButton}>
                  <FontAwesome6  name="plus" size={16} color="#212529" />
                </TouchableOpacity>
              </View>

              {insulinEntries.map((entry, index) => (
                <View key={entry.id} style={styles.insulinCard}>
                  <View style={styles.insulinCardHeader}>
                    <Text style={styles.insulinCardTitle}>
                      Insulin {index + 1}
                    </Text>
                    {insulinEntries.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeInsulinEntry(entry.id)}>
                        <Feather name="x-circle" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text style={styles.insulinLabel}>Insulin Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={entry.type}
                      onValueChange={(itemValue) =>
                        updateInsulinEntry(entry.id, "type", itemValue)
                      }
                      style={styles.picker}>
                      <Picker.Item label="Select insulin type" value="" />
                      {insulinTypes.map((type) => (
                        <Picker.Item key={type} label={type} value={type} />
                      ))}
                    </Picker>
                  </View>

                  {entry.type && (
                    <>
                      <Text style={styles.insulinLabel}>Time</Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={entry.time}
                          onValueChange={(itemValue) =>
                            updateInsulinEntry(entry.id, "time", itemValue)
                          }
                          style={styles.picker}>
                          <Picker.Item label="Select time" value="" />
                          {getAvailableTimes(entry.type).map((time) => (
                            <Picker.Item key={time} label={time} value={time} />
                          ))}
                        </Picker>
                      </View>
                    </>
                  )}

                  <Text style={styles.insulinLabel}>Amount (units)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter insulin units"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={entry.amount}
                    onChangeText={(text) =>
                      updateInsulinEntry(entry.id, "amount", text)
                    }
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any relevant notes"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomMenu activeScreen="entry" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  content: {
    flexDirection: "column",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "center",
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0f2fe",
    paddingHorizontal: 16,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: "#e0f2fe",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
  },
  activeTabText: {
    color: "#212529",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0f2fe",
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#212529",
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#4b5563",
  },
  inputGroup: {
    gap: 8,
  },
  inputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0f2fe",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#374151",
    backgroundColor: "#f8fafc",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  addInsulinButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: "auto",
    backgroundColor: "#e0f2fe",
  },
  insulinCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0f2fe",
    gap: 12,
  },
  insulinCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  insulinCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
  },
  insulinLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0f2fe",
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    overflow: "hidden", // Ensures picker content stays within bounds
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#374151",
  },
  submitButton: {
    backgroundColor: "#212529",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  headerAddButton: {
  backgroundColor: '#212529',
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 20,
},
headerAddButtonText: {
  color: 'white',
  fontSize: 13,
},
});
