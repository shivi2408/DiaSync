// components/CustomDropdown.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface DropdownItem {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  items: DropdownItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  selectedValue,
  onSelect,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(!visible)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Feather 
          name={visible ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#075985" 
        />
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdownList}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  selectedValue === item.value && styles.selectedItem,
                ]}
                onPress={() => {
                  onSelect(item.value);
                  setVisible(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item.label}</Text>
                {selectedValue === item.value && (
                  <Feather name="check" size={20} color="#139C8B" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0f2fe',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#075985',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    marginTop: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 99999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f9ff',
  },
  selectedItem: {
    backgroundColor: '#f0f9ff',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#075985',
  },
});

export default CustomDropdown;