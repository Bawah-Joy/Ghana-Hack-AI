import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
// @ts-ignore: missing type declarations for gesture-handler
// import {
//   PinchGestureHandler,
//   TapGestureHandler,
//   State,
// } from "react-native-gesture-handler";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
  FlashMode,
  CameraMode,
} from "expo-camera";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = useMicrophonePermissions();

  const cameraRef = useRef<any>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>(
    "photo" as CameraMode
  );
  const [isRecording, setIsRecording] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [flash, setFlash] = useState<FlashMode>("off" as FlashMode);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleFlash = () => {
    const next = flash === "on" ? "off" : "on";
    setFlash(next);
    const msg = next === "on" ? "Flash Enabled" : "Flash Disabled";
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    else Alert.alert(msg);
  };

  const onPinchEvent = (e: any) => {
    let newZoom = zoom + (e.nativeEvent.scale - 1) / 10;
    setZoom(Math.min(Math.max(newZoom, 0), 1));
  };

  // const onPinchStateChange = (e: any) => {
  //   if (e.nativeEvent.state === State.END) {
  //     setZoom((z) => Math.min(Math.max(z, 0), 1));
  //   }
  // };

  const handleTakePhoto = async () => {
    try {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Photo captured:", photo.uri);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecord = async () => {
    if (isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      setElapsedTime(0);
    } else {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      console.log("Video saved:", video.uri);
      setIsRecording(false);
    }
  };

  if (!permission || !audioPermission) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  if (!permission.granted || !audioPermission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white", marginBottom: 20 }}>
          Camera and audio permissions are required.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{ marginBottom: 10 }}
        >
          <Text style={{ color: "blue" }}>Grant Camera Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={requestAudioPermission}>
          <Text style={{ color: "blue" }}>Grant Audio Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* <PinchGestureHandler
        onGestureEvent={onPinchEvent}
        onHandlerStateChange={onPinchStateChange}
      >
        <TapGestureHandler
          numberOfTaps={2}
          onHandlerStateChange={({ nativeEvent }: any) => {
            if (nativeEvent.state === State.END) toggleFlash();
          }}
        > */}
      <CameraView
        style={{ flex: 1 }}
        ref={cameraRef}
        zoom={zoom}
        flash={flash}
        mode={cameraMode}
      />
      {/* </TapGestureHandler>
      </PinchGestureHandler> */}

      <View
        style={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleTakePhoto}
          style={{ marginHorizontal: 20 }}
        >
          <Text style={{ color: "white", fontSize: 24 }}>📸</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRecord}
          style={{ marginHorizontal: 20 }}
        >
          <Text style={{ color: "white", fontSize: 24 }}>
            {isRecording
              ? `⏹️ ${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60)
                  .toString()
                  .padStart(2, "0")}`
              : "🎥"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
