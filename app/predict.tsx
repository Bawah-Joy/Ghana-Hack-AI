// app/predict.tsx
import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams as useSearchParams } from "expo-router";

export default function Predict() {
  const { imageUri } = useSearchParams<{ imageUri: string }>();
  return (
    <View>
      <Text>Predicting: {imageUri}</Text>
    </View>
  );
}
