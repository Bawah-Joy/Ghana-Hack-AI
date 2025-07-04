import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';

export default function CameraScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const cameraRef = useRef<Camera>(null);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handle taking a picture
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });
        
        // Navigate to preview screen with the captured image
        router.push({
          pathname: '/preview',
          params: { imageUri: photo.uri },
        });
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  // Handle selecting image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      router.push({
        pathname: '/preview',
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  // Handle closing camera
  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // Handle flipping camera
  const flipCamera = () => {
    setCameraType(
      cameraType === CameraType.back
        ? CameraType.front
        : CameraType.back
    );
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
        <Text style={[styles.permissionText, { color: isDark ? '#fff' : '#000' }]}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
        <Text style={[styles.permissionText, { color: isDark ? '#fff' : '#000' }]}>
          No access to camera. Please enable camera permissions in settings.
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <FontAwesome name="times" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
      <Camera 
        ref={cameraRef} 
        style={styles.camera} 
        type={cameraType}
        ratio="16:9"
      >
        {/* Overlay UI */}
        <View style={styles.overlay}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <FontAwesome name="times" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Camera Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <FontAwesome name="photo" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
              <FontAwesome name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'white',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});