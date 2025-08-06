import React, { useState } from "react";
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

export default function ReportScreen() {
  const [activeTab, setActiveTab] = useState("Report");
  const [selectedMonth, setSelectedMonth] = useState("July 2025");

  // Placeholder data for demonstration
  const monthlyReportData = {
    "July 2025": {
      avgBloodSugar: "105.0 mg/dL",
      totalInsulin: "9.0 units",
      range: "105 - 105 mg/dL",
      totalEntries: 1,
      detailedEntries: [
        {
          date: "8/5/2025",
          time: "11:39 PM",
          bloodSugar: "105 mg/dL",
          status: "Normal",
          insulin: "Insugen",
          units: "9 units",
        },
      ],
    },
    "June 2025": {
      avgBloodSugar: "115.5 mg/dL",
      totalInsulin: "25.0 units",
      range: "90 - 160 mg/dL",
      totalEntries: 15,
      detailedEntries: [
        {
          date: "6/30/2025",
          time: "8:00 AM",
          bloodSugar: "120 mg/dL",
          status: "Normal",
          insulin: "Insugen",
          units: "5 units",
        },
        {
          date: "6/29/2025",
          time: "1:00 PM",
          bloodSugar: "150 mg/dL",
          status: "High",
          insulin: "Humalog",
          units: "7 units",
        },
        {
          date: "6/28/2025",
          time: "6:00 PM",
          bloodSugar: "95 mg/dL",
          status: "Normal",
          insulin: "Insugen",
          units: "3 units",
        },
      ],
    },
  };

  const currentMonthData = monthlyReportData[
    selectedMonth as keyof typeof monthlyReportData
  ] || {
    avgBloodSugar: "N/A",
    totalInsulin: "N/A",
    range: "N/A",
    totalEntries: 0,
    detailedEntries: [],
  };

  const handleDownloadPDF = () => {
    Alert.alert(
      "Download PDF",
      `Generating PDF report for ${selectedMonth}... (Functionality not implemented)`
    );
    // In a real app, you would integrate a PDF generation library here
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {activeTab === "Report" && (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Feather name="file-text" size={20} color="#075985" />
                <Text style={styles.cardTitle}>Monthly Report</Text>
              </View>

              <View style={styles.monthSelector}>
                <Feather name="calendar" size={18} color="#075985" />
                <Text style={styles.monthSelectorLabel}>Select Month</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="July 2025" value="July 2025" />
                    <Picker.Item label="June 2025" value="June 2025" />
                    <Picker.Item label="May 2025" value="May 2025" />
                  </Picker>
                </View>
              </View>

              <View style={styles.summaryGrid}>
                <View style={[styles.summaryItem, styles.summaryItemBlue]}>
                  <Text style={styles.summaryLabel}>Avg Blood Sugar</Text>
                  <Text style={styles.summaryValue}>
                    {currentMonthData.avgBloodSugar}
                  </Text>
                </View>
                <View style={[styles.summaryItem, styles.summaryItemGreen]}>
                  <Text style={styles.summaryLabel}>Total Insulin</Text>
                  <Text style={styles.summaryValue}>
                    {currentMonthData.totalInsulin}
                  </Text>
                </View>
                <View style={[styles.summaryItem, styles.summaryItemPurple]}>
                  <Text style={styles.summaryLabel}>Range</Text>
                  <Text style={styles.summaryValue}>
                    {currentMonthData.range}
                  </Text>
                </View>
                <View style={[styles.summaryItem, styles.summaryItemOrange]}>
                  <Text style={styles.summaryLabel}>Total Entries</Text>
                  <Text style={styles.summaryValue}>
                    {currentMonthData.totalEntries}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownloadPDF}>
                <Feather name="download" size={20} color="white" />
                <Text style={styles.downloadButtonText}>
                  Download PDF Report
                </Text>
              </TouchableOpacity>
            </View>

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

  {currentMonthData.detailedEntries.length > 0 ? (
    currentMonthData.detailedEntries.map((entry, index) => (
      <View key={index} style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tableCellText}>{entry.date}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tableCellText}>{entry.time}</Text>
        </View>
        <View style={[styles.tableCell, { flexDirection: "row", gap: 4 }]}>
          <Text style={styles.tableCellText}>{entry.bloodSugar}</Text>
          <View
            style={[
              styles.statusBadge,
              entry.status === "Normal"
                ? styles.statusNormal
                : entry.status === "High"
                ? styles.statusHigh
                : styles.statusLow,
            ]}
          >
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
    <Text style={styles.noEntriesText}>No entries for this month.</Text>
  )}
</View>

          </>
        )}
        {/* Placeholder for Entry and History tabs if they were to be implemented here */}
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
    gap: 24,
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
    color: "#075985",
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
    padding: 16,
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
    color: "#075985",
    textAlign: "center",
  },
  downloadButton: {
    backgroundColor: "#139C8B",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "space-between"
  },
  tableHeaderCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#075985",
    fontSize: 14,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "space-between"
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
    color: "#075985", // Darker blue for text
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
