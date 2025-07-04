import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <FontAwesome 
          name="times" 
          size={24} 
          color={isDark ? '#ffffff' : '#1f2937'} 
        />
      </TouchableOpacity>

      <View style={[styles.instructionsCard, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
        <View style={styles.instructionsHeader}>
          <FontAwesome name="info-circle" size={20} color="#3b82f6" />
          <Text style={[styles.instructionsTitle, { color: isDark ? '#ffffff' : '#1f2937' }]}>
            How to Use
          </Text>
        </View>
        <Text style={[styles.instructionsText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
          1. Select your crop type from the options above{'\n'}
          2. Tap the camera button to take a photo{'\n'}
          3. Get instant disease detection results
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  instructionsCard: {
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});