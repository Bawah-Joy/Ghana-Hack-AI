import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useHistory } from '@/app/context/HistoryContext';

export default function FeedbackScreen() {
  const { addToHistory } = useHistory();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  // Simulate API call to get model results
  useEffect(() => {
    const simulateAnalysis = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated results - replace with actual API call
      const diagnosisResult = "Healthy Plant";
      const confidenceResult = 95;
      
      setDiagnosis(diagnosisResult);
      setConfidence(confidenceResult);
      setIsLoading(false);

      // Save to history after analysis
      if (imageUri) {
        addToHistory({
          imageUri: imageUri,
          diagnosis: diagnosisResult,
          confidence: confidenceResult,
          date: new Date().toISOString(),
          cropType: "Maize" // You'll need to pass the selected crop from previous screens
        });
      }
    };

    simulateAnalysis();
  }, [imageUri]);

  const handleNewScan = () => {
    router.push('/camera');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f8fafc' }]}>
      {/* Close Button */}
      <TouchableOpacity 
        style={[styles.closeButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} 
        onPress={handleBack}
      >
        <FontAwesome name="times" size={24} color="white" />
      </TouchableOpacity>
      
      {/* Preview Image */}
      {imageUri && (
        <Image 
          source={{ uri: imageUri }} 
          style={styles.previewImage} 
          resizeMode="contain"
        />
      )}
      
      {/* Results Container */}
      <View style={[styles.resultsCard, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#1f2937' }]}>
          Analysis Results
        </Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDark ? '#fff' : '#1f2937'} />
            <Text style={[styles.loadingText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Analyzing plant health...
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.resultRow}>
              <FontAwesome name="leaf" size={20} color={isDark ? '#34d399' : '#10b981'} />
              <Text style={[styles.resultLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                Diagnosis:
              </Text>
              <Text style={[styles.resultValue, { color: diagnosis === 'Healthy Plant' ? '#22c55e' : '#ef4444' }]}>
                {diagnosis}
              </Text>
            </View>
            
            <View style={styles.resultRow}>
              <FontAwesome name="leaf" size={20} color={isDark ? '#34d399' : '#10b981'} />
              <Text style={[styles.resultLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                Confidence:
              </Text>
              <Text style={[styles.resultValue, { color: isDark ? '#fff' : '#1f2937' }]}>
                {confidence}%
              </Text>
            </View>
            
            <View style={styles.resultRow}>
              <FontAwesome name="lightbulb-o" size={20} color={isDark ? '#34d399' : '#10b981'} />
              <Text style={[styles.resultLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                Recommendations:
              </Text>
            </View>
            <Text style={[styles.recommendation, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
              {diagnosis === 'Healthy Plant' 
                ? 'Your plant is healthy! Continue current care routine.' 
                : 'Apply organic fungicide weekly. Remove affected leaves to prevent spread.'}
            </Text>
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
    padding: 16,
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
    zIndex: 10,
  },
  previewImage: {
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultsCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
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
  recommendation: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 5,
    marginBottom: 25,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
});