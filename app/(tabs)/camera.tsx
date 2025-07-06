import React, { useState } from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function CameraScreen() {
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const openNativeCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      router.push({
        pathname: "/predict",
        params: { imageUri: uri },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a Picture" onPress={openNativeCamera} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  preview: { width: 200, height: 200, marginTop: 20 },
});
