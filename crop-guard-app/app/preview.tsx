import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function PreviewScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [processedImageUri, setProcessedImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log('Image URI received:', imageUri);
    if (imageUri) {
      processImageForOfflineUse();
    }
  }, [imageUri]);

  const processImageForOfflineUse = async () => {
    if (!imageUri) return;
    
    setIsProcessing(true);
    try {
      // Clean up the URI - remove extra spaces and ensure proper format
      let cleanUri = imageUri.trim();
      
      // Fix common URI format issues
      if (cleanUri.startsWith('file: //')) {
        cleanUri = cleanUri.replace('file: //', 'file://');
      }
      
      console.log('Cleaned URI:', cleanUri);
      
      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(cleanUri);
      console.log('File info:', fileInfo);
      
      if (fileInfo.exists) {
        // For offline functionality, copy to a permanent location
        const fileName = `crop_image_${Date.now()}.jpg`;
        const permanentUri = `${FileSystem.documentDirectory}${fileName}`;
        
        await FileSystem.copyAsync({
          from: cleanUri,
          to: permanentUri,
        });
        
        // Store image metadata for offline access
        await storeImageMetadata(permanentUri, fileName);
        
        setProcessedImageUri(permanentUri);
        console.log('Image processed and stored at:', permanentUri);
      } else {
        console.error('File does not exist at URI:', cleanUri);
        setImageError(true);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback to original URI
      setProcessedImageUri(imageUri);
    } finally {
      setIsProcessing(false);
    }
  };

  const storeImageMetadata = async (uri: string, fileName: string) => {
    try {
      const metadata = {
        uri,
        fileName,
        timestamp: Date.now(),
        processed: false, // Will be true after crop diagnosis
      };
      
      // Store in AsyncStorage for offline access
      const existingImages = await AsyncStorage.getItem('stored_images');
      const images = existingImages ? JSON.parse(existingImages) : [];
      images.push(metadata);
      
      await AsyncStorage.setItem('stored_images', JSON.stringify(images));
      console.log('Image metadata stored for offline access');
    } catch (error) {
      console.error('Error storing image metadata:', error);
    }
  };

  const handleSubmit = () => {
    const finalImageUri = processedImageUri || imageUri;
    if (!finalImageUri) {
      Alert.alert('Error', 'No image to submit');
      return;
    }
    
    router.push({
      pathname: '/feedback',
      params: { imageUri: finalImageUri },
    });
  };

  const handleRetake = () => {
    if (router?.canGoBack?.()) {
      router.back(); // Go back to camera screen
    } else {
      router.push('/camera'); // Navigate to camera if no back stack
    }
  };

  const handleClose = () => {
    if (router?.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (error: any) => {
    console.error('Image load error:', error);
    setImageError(true);
    setImageLoaded(false);
  };

  if (!imageUri) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
        <Text style={[styles.errorText, { color: isDark ? '#fff' : '#000' }]}>
          No image to preview
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#22c55e' }]} 
          onPress={handleClose}
        >
          <FontAwesome name="home" size={24} color="white" />
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
      {/* Header with Close Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.closeButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} 
          onPress={handleClose}
        >
          <FontAwesome name="times" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
          Preview Image
        </Text>
      </View>

      {/* Preview Image Container */}
      <View style={styles.imageContainer}>
        {(isProcessing || (!imageLoaded && !imageError)) && (
          <View style={styles.loadingContainer}>
            <FontAwesome name="spinner" size={32} color="#22c55e" />
            <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>
              {isProcessing ? 'Processing image for offline use...' : 'Loading image...'}
            </Text>
          </View>
        )}
        
        {imageError && !isProcessing && (
          <View style={styles.errorContainer}>
            <FontAwesome name="exclamation-triangle" size={48} color="#ef4444" />
            <Text style={[styles.errorText, { color: isDark ? '#fff' : '#000' }]}>
              Failed to load image
            </Text>
            <Text style={[styles.errorSubtext, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Please try taking another photo
            </Text>
          </View>
        )}
        
        {(processedImageUri || imageUri) && (
          <Image 
            source={{ uri: processedImageUri || imageUri }} 
            style={styles.previewImage}
            onLoad={handleImageLoad}
            onError={handleImageError}
            resizeMode="contain"
          />
        )}
      </View>
      
      {/* Action Buttons - Now outside the image container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#ef4444' }]} 
          onPress={handleRetake}
        >
          <FontAwesome name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            { 
              backgroundColor: (imageLoaded && !imageError && !isProcessing) ? '#22c55e' : '#9ca3af',
            }
          ]} 
          onPress={handleSubmit}
          disabled={!imageLoaded || imageError || isProcessing}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10, // Reduced bottom margin to make room for buttons
  },
  previewImage: {
    width: '100%',
    flex: 1,
    borderRadius: 10,
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  errorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    paddingVertical: 20,
    paddingBottom: 40, // Extra padding at bottom for safe area
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    marginTop: 10,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
});