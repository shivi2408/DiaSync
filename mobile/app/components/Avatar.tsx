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

// Helper function to generate a random color
const getRandomColor = (seed: string) => {
  const colors = ["#eaffeeff", "#effffeff", "#e3fff2ff"];
  const index = seed.charCodeAt(0) % colors.length;
  return colors[index];
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
  const backgroundColor = getRandomColor(name);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          backgroundColor,
        },
      ]}>
      <Text
        style={[
          styles.avatarText,
          {
            fontSize: size * 0.36,
            color: borderColor, // Using borderColor for text color
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
  },
  avatarText: {
    fontWeight: "bold",
  },
});

export default Avatar;
