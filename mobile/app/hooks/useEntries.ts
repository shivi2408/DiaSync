// app/hooks/useEntries.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// app/hooks/useEntries.ts
export interface InsulinEntry {
  id: number;
  type: string;
  amount: string;
  time: string; // Add time field
}

export interface DiabetesEntry {
  id: string;
  date: string;
  bloodSugar: string;
  insulinEntries: InsulinEntry[];
  notes: string;
}

export default function useEntries() {
  const [entries, setEntries] = useState<DiabetesEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem('@diabetes_entries');
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        }
      } catch (e) {
        console.error('Failed to load entries', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  const saveEntries = async (newEntries: DiabetesEntry[]) => {
    try {
      await AsyncStorage.setItem('@diabetes_entries', JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (e) {
      console.error('Failed to save entries', e);
    }
  };

// In useEntries.ts
const addEntry = async (entry: Omit<DiabetesEntry, 'id' | 'date'>) => {
  const newEntry = {
    ...entry,
    id: Date.now().toString(),
    date: new Date().toISOString(), // Automatically add current date
  };
  
  const updatedEntries = [newEntry, ...entries];
  await saveEntries(updatedEntries);
  return newEntry;
};

  const updateEntry = async (id: string, updatedData: Partial<DiabetesEntry>) => {
    const updatedEntries = entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedData } : entry
    );
    await saveEntries(updatedEntries);
  };

  const deleteEntry = async (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    await saveEntries(updatedEntries);
  };

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}