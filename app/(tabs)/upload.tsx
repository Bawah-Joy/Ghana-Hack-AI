// app/(tabs)/upload.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickFromLibrary = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled && res.assets.length > 0) {
      setImageUri(res.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled && res.assets.length > 0) {
      setImageUri(res.assets[0].uri);
    }
  };

  const handleAnalyze = () => {
    if (!imageUri) return;
    // TODO: navigate to predict screen with imageUri
    console.log("Analyzing:", imageUri);
  };

  const clearSelection = () => {
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upload</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Info",
              "Select or take a photo of your crop leaf for analysis."
            )
          }
          style={styles.headerIcon}
        >
          <FontAwesome name="info-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Choose Buttons */}
      {!imageUri && (
        <View style={styles.choiceRow}>
          <TouchableOpacity style={styles.choiceBtn} onPress={takePhoto}>
            <FontAwesome name="camera" size={28} color="#fff" />
            <Text style={styles.choiceText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.choiceBtn} onPress={pickFromLibrary}>
            <FontAwesome name="image" size={28} color="#fff" />
            <Text style={styles.choiceText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Preview Card */}
      {imageUri && (
        <View style={styles.previewCard}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <TouchableOpacity style={styles.clearIcon} onPress={clearSelection}>
            <FontAwesome name="times-circle" size={28} color="#B22222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleAnalyze}>
            <Text style={styles.actionText}>Analyze</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F8FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6B8E23",
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingTop: "15%",
  },
  headerTitle: { flex: 1, color: "#fff", fontSize: 20, fontWeight: "bold" },
  headerIcon: { padding: 4 },

  choiceRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  choiceBtn: {
    alignItems: "center",
    backgroundColor: "#6B8E23",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: (width - 80) / 2,
    elevation: 3,
  },
  choiceText: { marginTop: 8, color: "#fff", fontSize: 16 },

  previewCard: {
    width: CARD_WIDTH,
    alignSelf: "center",
    marginTop: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    overflow: "hidden",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: CARD_WIDTH * 0.75,
    resizeMode: "cover",
  },
  clearIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 16,
  },
  actionBtn: {
    backgroundColor: "#228B22",
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
  },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
