// app/hooks/usePatientData.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PatientData {
  name: string;
  age: string;
  gender: string;
  diabetesType: string;
  startYear: string;
  targetMin: string;
  targetMax: string;
  notes: string;
  insulins: Array<{
    name: string;
    timings: string[];
  }>;
}

export default function usePatientData() {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@patient_data');
        if (storedData) {
          setPatientData(JSON.parse(storedData));
        }
      } catch (e) {
        console.error('Failed to load patient data', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatientData();
  }, []);

  const savePatientData = async (data: PatientData) => {
    try {
      await AsyncStorage.setItem('@patient_data', JSON.stringify(data));
      setPatientData(data);
    } catch (e) {
      console.error('Failed to save patient data', e);
    }
  };

  return { patientData, isLoading, savePatientData };
}