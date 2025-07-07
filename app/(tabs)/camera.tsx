// app/(tabs)/camera.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  CameraView as ExpoCamera,
  useCameraPermissions,
  useMicrophonePermissions,
  FlashMode,
  CameraType,
} from "expo-camera";

const { width } = Dimensions.get("window");
const CAPTURE_SIZE = 70;

export default function CameraScreen() {
  const router = useRouter();
  const [cameraPerm, requestCameraPerm] = useCameraPermissions();
  const [audioPerm, requestAudioPerm] = useMicrophonePermissions();
  const cameraRef = useRef<ExpoCamera | null>(null);
  const [flash, setFlash] = useState<FlashMode>("off");
  const [type, setType] = useState<CameraType>("back");

  // Ask permissions on mount
  useEffect(() => {
    (async () => {
      if (!cameraPerm?.granted) await requestCameraPerm();
      if (!audioPerm?.granted) await requestAudioPerm();
    })();
  }, []);

  // Toggle flash on/off
  const toggleFlash = () => {
    const next = flash === "off" ? "on" : "off";
    setFlash(next);
    const msg = next === "on" ? "Flash On" : "Flash Off";
    Platform.OS === "android"
      ? ToastAndroid.show(msg, ToastAndroid.SHORT)
      : alert(msg);
  };

  // Flip camera
  const flipCamera = () => {
    setType((old) => (old === "back" ? "front" : "back"));
  };

  // Capture photo
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        router.push({ pathname: "/predict", params: { imageUri: photo.uri } });
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!cameraPerm?.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.warnText}>Camera permission required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
        >
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Capture</Text>
        <TouchableOpacity onPress={toggleFlash} style={styles.headerBtn}>
          <FontAwesome
            name={flash === "on" ? "bolt" : "bolt"} // Use same icon, change color
            size={24}
            color={flash === "on" ? "#FFD700" : "#fff"} // yellow for on, white for off
          />
        </TouchableOpacity>
      </View>

      {/* Camera Preview */}
      <ExpoCamera
        ref={cameraRef}
        style={styles.camera}
        // facing={type}
        flash={flash}
      />

      {/* Controls Overlay */}
      <View style={styles.controls}>
        {/* <TouchableOpacity onPress={flipCamera} style={styles.ctrlBtn}>
          <FontAwesome name="retweet" size={28} color="#fff" />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={takePicture} style={styles.captureBtn} />
        {/* <View style={styles.ctrlPlaceholder} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  warnText: { color: "#fff", fontSize: 16 },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 100,
    backgroundColor: "#6B8E23",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 10,
    paddingBottom: 20,
  },
  headerBtn: { padding: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  camera: { flex: 1 },

  controls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    // backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  ctrlBtn: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
    borderRadius: 40,
  },
  // ctrlPlaceholder: { width: CAPTURE_SIZE }, // for symmetry

  captureBtn: {
    width: CAPTURE_SIZE,
    height: CAPTURE_SIZE,
    borderRadius: CAPTURE_SIZE / 2,
    backgroundColor: "#228B22",
    borderWidth: 4,
    borderColor: "#fff",
  },
});
