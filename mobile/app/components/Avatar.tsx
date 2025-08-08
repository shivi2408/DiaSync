// components/Avatar.tsx
import { View, Text, StyleSheet } from "react-native";
import React from "react";

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

interface AvatarProps {
  name: string;
  size?: number;
  borderColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 50,
  borderColor = "#212529",
}) => {
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
        },
      ]}>
      <Text
        style={[
          styles.avatarText,
          {
            fontSize: size * 0.5,
          },
        ]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "#000000", // Black background
  },
  avatarText: {
    fontWeight: "bold",
    color: "#ffffff", // White text
  },
});

export default Avatar;