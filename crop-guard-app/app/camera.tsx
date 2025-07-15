import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useFocusEffect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

export default function CameraScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  
  // Reset camera state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setIsCameraReady(false);
      setIsCapturing(false);
      
      // Small delay to ensure camera is properly initialized
      const timer = setTimeout(() => {
        setIsCameraReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }, [])
  );

  useEffect(() => {
    // Request permissions on native platforms
    if (Platform.OS !== 'web' && !permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Handle camera ready state
  const onCameraReady = () => {
    console.log('Camera is ready');
    setIsCameraReady(true);
  };

  // Handle taking a picture
  const takePicture = async () => {
    if (!isCameraReady || isCapturing || !cameraRef.current) {
      console.log('Camera not ready or already capturing');
      return;
    }

    setIsCapturing(true);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
        base64: false,
      });
      
      console.log('Photo taken:', photo.uri);
      
      // Ensure the photo is saved to a permanent location
      const fileName = `crop_photo_${Date.now()}.jpg`;
      const permanentUri = `${FileSystem.documentDirectory}${fileName}`;
      
      try {
        await FileSystem.copyAsync({
          from: photo.uri,
          to: permanentUri,
        });
        console.log('Photo saved to permanent location:', permanentUri);
        
        router.push({
          pathname: '/preview',
          params: { imageUri: permanentUri },
        });
      } catch (copyError) {
        console.error('Error copying image:', copyError);
        // Fallback to original URI
        router.push({
          pathname: '/preview',
          params: { imageUri: photo.uri },
        });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsCapturing(false);
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

    if (!result.canceled && result.assets?.[0]?.uri) {
      router.push({
        pathname: '/preview',
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  // Handle closing camera
  const handleClose = () => {
    router.back();
  };

  // Handle flipping camera
  const flipCamera = () => {
    if (!isCapturing) {
      setCameraType(cameraType === 'back' ? 'front' : 'back');
    }
  };

  // Web fallback UI
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
        <Text style={[styles.permissionText, { color: isDark ? '#fff' : '#000' }]}>
          Camera not supported in browser
        </Text>
        <TouchableOpacity 
          style={[styles.webButton, { backgroundColor: '#22c55e' }]} 
          onPress={pickImage}
        >
          <FontAwesome name="photo" size={24} color="white" />
          <Text style={styles.webButtonText}>Select from Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
        <Text style={[styles.permissionText, { color: isDark ? '#fff' : '#000' }]}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
        <Text style={[styles.permissionText, { color: isDark ? '#fff' : '#000' }]}>
          No access to camera. Please enable camera permissions in settings.
        </Text>
        <TouchableOpacity 
          style={[styles.webButton, { backgroundColor: '#22c55e' }]} 
          onPress={requestPermission}
        >
          <Text style={styles.webButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <FontAwesome name="times" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
    );
  }

  // Main camera UI for native
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing={cameraType}
        ratio="16:9"
        onCameraReady={onCameraReady}
      >
        {/* Overlay UI */}
        <View style={styles.overlay}>
          {/* Close Button - Top Left */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <FontAwesome name="times" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Camera status indicator */}
          {!isCameraReady && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Initializing camera...</Text>
            </View>
          )}
          
          {/* Camera Controls - Bottom */}
          <View style={styles.controls}>
            <TouchableOpacity 
              style={[styles.galleryButton, { opacity: isCameraReady ? 1 : 0.5 }]} 
              onPress={pickImage}
              disabled={!isCameraReady}
            >
              <FontAwesome name="photo" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.captureButton, 
                { 
                  opacity: (isCameraReady && !isCapturing) ? 1 : 0.5,
                  transform: [{ scale: isCapturing ? 0.95 : 1 }]
                }
              ]} 
              onPress={takePicture}
              disabled={!isCameraReady || isCapturing}
            >
              <View style={[
                styles.captureInner,
                { backgroundColor: isCapturing ? '#ef4444' : 'white' }
              ]} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.flipButton, { opacity: isCameraReady ? 1 : 0.5 }]} 
              onPress={flipCamera}
              disabled={!isCameraReady || isCapturing}
            >
              <FontAwesome name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  statusContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    marginBottom: 20,
  },
  webButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: 'center',
    gap: 8,
  },
  webButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});