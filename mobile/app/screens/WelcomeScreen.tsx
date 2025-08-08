// app/screens/WelcomeScreen.tsx
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import {
  Fontisto ,
  FontAwesome6 ,
  Feather,
  SimpleLineIcons 
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import usePatientData from "../hooks/usePatientData";

export default function WelcomeScreen() {
  const router = useRouter();
  const { patientData, isLoading } = usePatientData();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (!isLoading && patientData) {
      const timer = setTimeout(() => {
        router.replace("/screens/HomeScreen");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, patientData]);

  // Show nothing while loading or if patient data exists and welcome time is over
  if (isLoading || (patientData && !showWelcome)) {
    return null;
  }

  // If we have patient data but still in welcome period, show welcome screen
  if (patientData) {
    return (
      <View style={styles.container}>
        <View style={styles.centeredContent}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Image
                source={require("../../assets/images/logowithname.png")}
                style={styles.logo}
              />
              {/* <Text style={styles.appName}>GlucoBuddy</Text> */}
            </View>
            <View style={styles.content}>
              <Text style={styles.tagline}>Welcome back!</Text>
              <ActivityIndicator size="large" color="#8ec1e2ff" />
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Show the full welcome screen for new users
  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/logowithname.png")}
              style={styles.logo}
            />
            {/* <Text style={styles.appName}>GlucoBuddy</Text> */}
          </View>
          <View style={styles.content}>
            <Text style={styles.tagline}>Your assistant in diabetes care</Text>
            <Text style={styles.subTagline}>
              Take control of your health together with GlucoBuddy
            </Text>
          </View>
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <SimpleLineIcons 
                name="graph"
                size={24}
                color="#212529"
              />
              <Text style={styles.featureText}>Track blood sugar levels</Text>
            </View>
            <View style={styles.featureItem}>
              <Fontisto  name="injection-syringe" size={22} color="#004488ff" />
              <Text style={styles.featureText}>Record insulin doses</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome6  name="calendar-check" size={22} color="#212529" />
              <Text style={styles.featureText}>
                Monthly reports & PDF export
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/screens/PatientSetupScreen")}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
    padding: 32,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
  },
  mainContent: {
    gap: 40,
  },
  header: {
    alignItems: "center",
    gap: 16,
  },
  logo: {
    width: 250,
    height: 250,
  },
  appName: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#2c2c2cff",
  },
  content: {
    gap: 8,
    alignItems: "center",
  },
  tagline: {
    fontSize: 22,
    fontWeight: "600",
    color: "#212529",
    textAlign: "center",
  },
  subTagline: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 24,
  },
  features: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#212529",
    fontWeight: "500",
  },
  buttonContainer: { // Add some padding at the bottom
  },
  button: {
    backgroundColor: "#212529",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
