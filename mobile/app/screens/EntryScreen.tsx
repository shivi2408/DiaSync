import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker'; // For dropdown
import BottomMenu from "../components/BottomMenu";

export default function EntryScreen() {
  const [activeTab, setActiveTab] = useState("Entry");
  const [bloodSugar, setBloodSugar] = useState("");
  const [insulinEntries, setInsulinEntries] = useState([{ id: 1, type: "", amount: "" }]);
  const [notes, setNotes] = useState("");

  const addInsulinEntry = () => {
    setInsulinEntries([...insulinEntries, { id: insulinEntries.length + 1, type: "", amount: "" }]);
  };

  const updateInsulinEntry = (id: number, field: string, value: string) => {
    setInsulinEntries(insulinEntries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const removeInsulinEntry = (id: number) => {
    setInsulinEntries(insulinEntries.filter(entry => entry.id !== id));
  };

  const handleSubmit = () => {
    if (!bloodSugar) {
      Alert.alert("Validation Error", "Please enter blood sugar level.");
      return;
    }
    // Here you would typically save the data to your backend or local storage
    Alert.alert("Entry Added", `Blood Sugar: ${bloodSugar} mg/dL\nInsulin Entries: ${JSON.stringify(insulinEntries)}\nNotes: ${notes}`);
    // Reset form
    setBloodSugar("");
    setInsulinEntries([{ id: 1, type: "", amount: "" }]);
    setNotes("");
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {activeTab === "Entry" && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="plus" size={20} color="#075985" />
              <Text style={styles.cardTitle}>New Entry</Text>
            </View>
            <Text style={styles.cardSubtitle}>Record your blood sugar and insulin</Text>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <MaterialCommunityIcons name="fire" size={18} color="#ef4444" />
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

            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <Feather name="edit-3" size={18} color="#075985" />
                <Text style={styles.inputLabel}>Insulin Entries</Text>
                <TouchableOpacity onPress={addInsulinEntry} style={styles.addInsulinButton}>
                  <Feather name="plus" size={16} color="#075985" />
                </TouchableOpacity>
              </View>

              {insulinEntries.map((entry, index) => (
                <View key={entry.id} style={styles.insulinCard}>
                  <View style={styles.insulinCardHeader}>
                    <Text style={styles.insulinCardTitle}>Insulin {index + 1}</Text>
                    {insulinEntries.length > 1 && (
                      <TouchableOpacity onPress={() => removeInsulinEntry(entry.id)}>
                        <Feather name="x-circle" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.insulinLabel}>Insulin Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={entry.type}
                      onValueChange={(itemValue) => updateInsulinEntry(entry.id, "type", itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select insulin type" value="" />
                      <Picker.Item label="Insugen" value="Insugen" />
                      <Picker.Item label="Humalog" value="Humalog" />
                      <Picker.Item label="Novolog" value="Novolog" />
                      <Picker.Item label="Lantus" value="Lantus" />
                    </Picker>
                  </View>

                  <Text style={styles.insulinLabel}>Amount (units)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter insulin units"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={entry.amount}
                    onChangeText={(text) => updateInsulinEntry(entry.id, "amount", text)}
                  />
                </View>
              ))}
            </View>

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

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Add Entry</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Placeholder for Report and History tabs if they were to be implemented here */}
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
    color: "#139C8B",
  },
  scrollViewContent: {
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0f2fe",
    gap: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#075985",
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
    color: "#075985",
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
    minHeight: 100,
    textAlignVertical: "top",
  },
  addInsulinButton: {
    padding: 8,
    borderRadius: 8,
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
    color: "#075985",
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
    overflow: 'hidden', // Ensures picker content stays within bounds
  },
  picker: {
    height: 50,
    width: '100%',
    color: "#374151",
  },
  submitButton: {
    backgroundColor: "#139C8B",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
