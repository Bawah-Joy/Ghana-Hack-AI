import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Modal, Dimensions, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useHistory } from '@/context/HistoryContext';
import { useRouter } from 'expo-router';
import { getEndpointUrl, CROP_TO_MODEL_MAP, getRecommendations } from '@/config/apiConfig';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FeedbackScreen() {
  const { addToHistory } = useHistory();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { 
    imageUri, 
    diagnosis: initialDiagnosis, 
    confidence: initialConfidence, 
    cropType: initialCropType,
    fromHistory 
  } = useLocalSearchParams<{ 
    imageUri: string; 
    diagnosis?: string; 
    confidence?: string; 
    cropType?: string;
    fromHistory?: string;
  }>();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [cropType, setCropType] = useState<string>("Maize");
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to call the FastAPI backend
  const callBackendAPI = async () => {
    if (!imageUri) {
      setError('No image provided');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the model name based on crop type
      const modelName = CROP_TO_MODEL_MAP[cropType] || 'xception_maize';
      
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('model_name', modelName);
      
      // Add the image file
      const imageFile = {
        uri: imageUri,
        type: 'image/jpeg', // or detect from uri
        name: 'plant_image.jpg',
      } as any;
      formData.append('file', imageFile);

      const apiUrl = getEndpointUrl('PREDICT');
      console.log(`Making request to ${apiUrl} with model: ${modelName}`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      // Extract results from API response
      const diagnosisResult = result.label || 'Unknown';
      const confidenceResult = Math.round((result.confidence || 0) * 100);
      
      // Get recommendations based on diagnosis
      const recommendationsResult = getRecommendations(diagnosisResult);

      setDiagnosis(diagnosisResult);
      setConfidence(confidenceResult);
      setRecommendations(recommendationsResult);

      // Add to history if not from history
      if (fromHistory !== 'true') {
        addToHistory({
          imageUri: imageUri,
          diagnosis: diagnosisResult,
          confidence: confidenceResult,
          date: new Date().toISOString(),
          cropType: cropType
        });
      }

    } catch (error) {
      console.error('Backend API error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze image');
      
      // Show user-friendly error
      Alert.alert(
        'Analysis Failed',
        'Unable to connect to the analysis server. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      
      // Set fallback data
      setDiagnosis('Analysis Failed');
      setConfidence(0);
      setRecommendations(['Please try scanning the image again', 'Check your internet connection']);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If we have initial data (from history), use it
    if (initialDiagnosis && initialConfidence) {
      setDiagnosis(initialDiagnosis);
      setConfidence(parseInt(initialConfidence));
      if (initialCropType) setCropType(initialCropType);
      
      // Get recommendations for historical data
      const recommendationsResult = getRecommendations(initialDiagnosis);
      setRecommendations(recommendationsResult);
      
      setIsLoading(false);
      return;
    }

    // Set crop type from params
    if (initialCropType) {
      setCropType(initialCropType);
    }

    // Call the actual API
    callBackendAPI();
  }, [imageUri, initialCropType]);

  const handleNewScan = () => {
    router.push('/camera');
  };

  const handleBack = () => {
    if (router?.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoHome = () => {
    try {
      if (router?.replace) {
        router.replace('/(tabs)');
      } else if (router?.push) {
        router.push('/(tabs)');
      } else {
        router.navigate('/(tabs)');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.push('/(tabs)');
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return '#22c55e';
    if (conf >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getConfidenceIcon = (conf: number) => {
    if (conf >= 90) return 'check-circle';
    if (conf >= 70) return 'exclamation-triangle';
    return 'times-circle';
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.closeButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} 
          onPress={handleBack}
        >
          <FontAwesome name="times" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#1f2937' }]}>
          Analysis Results - {cropType}
        </Text>
      </View>
      
      {/* Tappable Preview Image */}
      {imageUri && (
        <TouchableOpacity 
          style={styles.imageContainer}
          onPress={() => setIsImageModalVisible(true)}
          activeOpacity={0.8}
        >
          <Image 
            source={{ uri: imageUri }} 
            style={styles.previewImage} 
            resizeMode="cover"
          />
          <Text style={styles.tapHint}>
            <FontAwesome name="expand" size={14} color="#6b7280" /> Tap to view full image
          </Text>
        </TouchableOpacity>
      )}
      
      {/* Full-screen Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setIsImageModalVisible(false)}
          >
            <FontAwesome name="times" size={30} color="white" />
          </TouchableOpacity>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.fullImage} 
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Results Card */}
      <View style={[styles.resultsCard, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDark ? '#fff' : '#1f2937'} />
            <Text style={[styles.loadingText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Analyzing {cropType.toLowerCase()} plant health...
            </Text>
            <Text style={[styles.loadingSubtext, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
              This may take a few moments
            </Text>
          </View>
        ) : (
          <View style={styles.resultsContent}>
            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <FontAwesome name="exclamation-triangle" size={20} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Diagnosis and Confidence */}
            <View style={styles.summarySection}>
              <View style={styles.resultRow}>
                <FontAwesome name="leaf" size={20} color={isDark ? '#34d399' : '#10b981'} />
                <Text style={[styles.resultLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Diagnosis:
                </Text>
                <Text style={[styles.resultValue, { 
                  color: diagnosis === 'Healthy Plant' || diagnosis?.toLowerCase().includes('healthy') 
                    ? '#22c55e' : '#ef4444' 
                }]}>
                  {diagnosis}
                </Text>
              </View>
              
              <View style={styles.resultRow}>
                <FontAwesome 
                  name={getConfidenceIcon(confidence || 0)} 
                  size={20} 
                  color={getConfidenceColor(confidence || 0)} 
                />
                <Text style={[styles.resultLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Confidence:
                </Text>
                <Text style={[styles.resultValue, { 
                  color: getConfidenceColor(confidence || 0) 
                }]}>
                  {confidence}%
                </Text>
              </View>
            </View>

            {/* Recommendations Section */}
            <View style={styles.recommendationsSection}>
              <View style={styles.recommendationsHeader}>
                <FontAwesome name="lightbulb-o" size={20} color={isDark ? '#34d399' : '#10b981'} />
                <Text style={[styles.recommendationsTitle, { color: isDark ? '#fff' : '#1f2937' }]}>
                  Treatment Recommendations
                </Text>
              </View>
              
              <ScrollView 
                style={[styles.scrollContainer, { 
                  backgroundColor: isDark ? '#374151' : '#f9fafb' 
                }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
              >
                {recommendations.length > 0 ? (
                  recommendations.map((recommendation, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <View style={[styles.bulletPoint, { 
                        backgroundColor: isDark ? '#34d399' : '#10b981' 
                      }]} />
                      <Text style={[styles.recommendationText, { 
                        color: isDark ? '#d1d5db' : '#4b5563' 
                      }]}>
                        {recommendation}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.recommendationText, { 
                    color: isDark ? '#9ca3af' : '#6b7280',
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }]}>
                    No specific recommendations available for this condition
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDark ? '#374151' : '#f3f4f6' }]}
            onPress={handleGoHome}
          >
            <FontAwesome name="home" size={20} color={isDark ? '#fff' : '#1f2937'} />
            <Text style={[styles.actionButtonText, { color: isDark ? '#fff' : '#1f2937' }]}>
              Home
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDark ? '#22c55e' : '#16a34a' }]}
            onPress={handleNewScan}
          >
            <FontAwesome name="camera" size={20} color="white" />
            <Text style={styles.actionButtonTextWhite}>New Scan</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imageContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'center',
  },
  previewImage: {
    height: 150,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  tapHint: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  resultsCard: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resultsContent: {
    flex: 1,
  },
  summarySection: {
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  recommendationsSection: {
    flex: 1,
    marginBottom: 20,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    maxHeight: 300,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 12,
    flexShrink: 0,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonTextWhite: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 60,
    left: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  fullImage: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.85,
  },
});