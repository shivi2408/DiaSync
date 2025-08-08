import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import BottomMenu from "../components/BottomMenu";
import useEntries from "../hooks/useEntries";
import usePatientData from "../hooks/usePatientData";
import { useNavigation } from "@react-navigation/native";

export default function ReportScreen() {
  const navigation = useNavigation();
  const { entries } = useEntries();
  const { patientData } = usePatientData();
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Generate available months from entries
  const availableMonths = useMemo(() => {
    const monthMap = new Map<string, boolean>();
    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;
      monthMap.set(monthYear, true);
    });
    return Array.from(monthMap.keys()).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [entries]);

  // Set default month to most recent if not set
  if (availableMonths.length > 0 && !selectedMonth) {
    setSelectedMonth(availableMonths[0]);
  }

  // Filter and process entries for selected month
  const monthlyData = useMemo(() => {
    if (!selectedMonth) return null;

    const monthEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const entryMonthYear = `${entryDate.toLocaleString("default", {
        month: "long",
      })} ${entryDate.getFullYear()}`;
      return entryMonthYear === selectedMonth;
    });

    if (monthEntries.length === 0) return null;

    // Calculate average blood sugar
    const totalBloodSugar = monthEntries.reduce((sum, entry) => {
      return sum + parseFloat(entry.bloodSugar);
    }, 0);
    const avgBloodSugar = (totalBloodSugar / monthEntries.length).toFixed(1);

    // Calculate total insulin
    const totalInsulin = monthEntries
      .reduce((sum, entry) => {
        return (
          sum +
          entry.insulinEntries.reduce((insSum, ins) => {
            return insSum + parseFloat(ins.amount || "0");
          }, 0)
        );
      }, 0)
      .toFixed(1);

    // Calculate range
    const bloodSugarValues = monthEntries.map((e) => parseFloat(e.bloodSugar));
    const min = Math.min(...bloodSugarValues);
    const max = Math.max(...bloodSugarValues);

    // Prepare detailed entries
    const detailedEntries = monthEntries.map((entry) => {
      const entryDate = new Date(entry.date);
      const status = patientData
        ? parseFloat(entry.bloodSugar) < parseFloat(patientData.targetMin)
          ? "Low"
          : parseFloat(entry.bloodSugar) > parseFloat(patientData.targetMax)
          ? "High"
          : "Normal"
        : "Normal";

      return {
        id: entry.id,
        date: entryDate.toLocaleDateString(),
        time: entryDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        bloodSugar: `${entry.bloodSugar} mg/dL`,
        status,
        insulin:
          entry.insulinEntries.length > 0
            ? entry.insulinEntries.map((i) => i.type).join(", ")
            : "None",
        units:
          entry.insulinEntries.length > 0
            ? entry.insulinEntries.map((i) => `${i.amount}u`).join(", ")
            : "",
      };
    });

    return {
      avgBloodSugar: `${avgBloodSugar} mg/dL`,
      totalInsulin: `${totalInsulin} units`,
      range: `${min} - ${max} mg/dL`,
      totalEntries: monthEntries.length,
      detailedEntries,
    };
  }, [selectedMonth, entries, patientData]);

  const handleDownloadPDF = () => {
    Alert.alert(
      "Download PDF",
      `Generating PDF report for ${selectedMonth}... (Functionality not implemented)`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.card}>
          <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="chevron-left" size={24} color="#212529" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Monthly Report</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

          <View style={styles.monthSelector}>
            <Feather name="calendar" size={18} color="#212529" />
            <Text style={styles.monthSelectorLabel}>Select Month</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={setSelectedMonth}
                style={styles.picker}>
                {availableMonths.map((month) => (
                  <Picker.Item key={month} label={month} value={month} />
                ))}
              </Picker>
            </View>
          </View>

          {monthlyData ? (
            <>
              <View style={styles.summaryGrid}>
                <View style={[styles.summaryItem, styles.summaryItemBlue]}>
                  <Text style={styles.summaryLabel}>Avg Blood Sugar</Text>
                  <Text style={styles.summaryValue}>
                    {monthlyData.avgBloodSugar}
                  </Text>
                </View>
                <View style={[styles.summaryItem, styles.summaryItemGreen]}>
                  <Text style={styles.summaryLabel}>Total Insulin</Text>
                  <Text style={styles.summaryValue}>
                    {monthlyData.totalInsulin}
                  </Text>
                </View>
                <View style={[styles.summaryItem, styles.summaryItemPurple]}>
                  <Text style={styles.summaryLabel}>Range</Text>
                  <Text style={styles.summaryValue}>{monthlyData.range}</Text>
                </View>
                <View style={[styles.summaryItem, styles.summaryItemOrange]}>
                  <Text style={styles.summaryLabel}>Total Entries</Text>
                  <Text style={styles.summaryValue}>
                    {monthlyData.totalEntries}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownloadPDF}>
                <Feather name="download" size={18} color="white" />
                <Text style={styles.downloadButtonText}>
                  Download PDF Report
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.noEntriesText}>
              No data available for this month
            </Text>
          )}
        </View>

        {monthlyData && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detailed Entries</Text>
            <View style={styles.tableHeader}>
              <View style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>Date</Text>
              </View>
              <View style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>Time</Text>
              </View>
              <View style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>Blood Sugar</Text>
              </View>
              <View style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>Insulin</Text>
              </View>
            </View>

            {monthlyData.detailedEntries.length > 0 ? (
              monthlyData.detailedEntries.map((entry) => (
                <View key={entry.id} style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>{entry.date}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>{entry.time}</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      { flexDirection: "row", gap: 4 },
                    ]}>
                    <Text style={styles.tableCellText}>{entry.bloodSugar}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        entry.status === "Normal"
                          ? styles.statusNormal
                          : entry.status === "High"
                          ? styles.statusHigh
                          : styles.statusLow,
                      ]}>
                      <Text style={styles.statusBadgeText}>{entry.status}</Text>
                    </View>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.insulinName}>{entry.insulin}</Text>
                    <Text style={styles.insulinUnits}>{entry.units}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noEntriesText}>
                No entries for this month.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
      <BottomMenu activeScreen="report" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 80,
    gap: 18,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0f2fe",
    gap: 20,
  },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    flex: 1,
  },
  headerRightPlaceholder: {
    width: 40, // Same as back button for balance
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0f2fe",
    paddingHorizontal: 12,
  },
  monthSelectorLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
  },
  pickerContainer: {
    flex: 1,
    height: 50,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: "100%",
    color: "#374151",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryItem: {
    borderRadius: 8,
    padding: 12,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  summaryItemBlue: {
    backgroundColor: "#e0f2fe",
  },
  summaryItemGreen: {
    backgroundColor: "#d1fae5",
  },
  summaryItemPurple: {
    backgroundColor: "#ede9fe",
  },
  summaryItemOrange: {
    backgroundColor: "#fff7ed",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "center",
  },
  downloadButton: {
    backgroundColor: "#212529",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  tableHeaderCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#212529",
    fontSize: 14,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableCell: {
    justifyContent: "center",
    alignItems: "center",
  },
  tableCellText: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusNormal: {
    backgroundColor: "#d1fae5", // Greenish
  },
  statusHigh: {
    backgroundColor: "#fee2e2", // Reddish
  },
  statusLow: {
    backgroundColor: "#bfdbfe", // Bluish
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#212529", // Darker blue for text
  },
  insulinName: {
    fontWeight: "500",
  },
  insulinUnits: {
    fontSize: 12,
    color: "#6b7280",
  },
  noEntriesText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    paddingVertical: 20,
  },
});
