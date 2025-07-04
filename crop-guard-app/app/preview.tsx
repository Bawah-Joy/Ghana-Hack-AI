import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function PreviewScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();

  const handleSubmit = () => {
    router.push({
      pathname: '/feedback',
      params: { imageUri },
    });
  };

  const handleRetake = () => {
    if (router.canGoBack()) {
      router.back(); // Go back to camera screen
    } else {
      router.push('/camera'); // Navigate to camera if no back stack
    }
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  if (!imageUri) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
        <Text style={[styles.errorText, { color: isDark ? '#fff' : '#000' }]}>
          No image to preview
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <FontAwesome name="times" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
      {/* Preview Image */}
      <Image source={{ uri: imageUri }} style={styles.previewImage} />
      
      {/* Close Button */}
      <TouchableOpacity 
        style={[styles.closeButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} 
        onPress={handleClose}
      >
        <FontAwesome name="times" size={24} color="white" />
      </TouchableOpacity>
      
      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#ef4444' }]} 
          onPress={handleRetake}
        >
          <FontAwesome name="close" size={24} color="white" />
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#22c55e' }]} 
          onPress={handleSubmit}
        >
          <FontAwesome name="check" size={24} color="white" />
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
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
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 140,
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});