import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import {
  useHistory,
  Recommendation,
  ScanResult,
} from "@/context/HistoryContext";
import {
  getEndpointUrl,
  CROP_TO_MODEL_MAP,
  DEFAULT_MODEL,
} from "@/config/apiConfig";
import { useCrop } from "@/context/CropContext";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type PredictResponse = {
  model: string;
  label: string;
  confidence: number;
  recommendation: Recommendation;
};

type Params = {
  id?: string;
  imageUri?: string;
  fromHistory?: string;
};

export default function FeedbackScreen() {
  const { addToHistory, history } = useHistory();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { id, imageUri, fromHistory } = useLocalSearchParams<Params>();
  const { cropType: initialCropType } = useCrop();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [cropType, setCropType] = useState<string>(initialCropType);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const callBackendAPI = async () => {
    if (!imageUri) {
      setError("No image provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const modelName = CROP_TO_MODEL_MAP[cropType] || DEFAULT_MODEL;

      const formData = new FormData();
      formData.append("model_name", modelName);

      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "plant_image.jpg",
      } as any);
      console.table("Endpoint: ", getEndpointUrl("PREDICT"));

      const response = await fetch(getEndpointUrl("PREDICT"), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = (await response.json()) as PredictResponse;
      console.log("API Response:", result);

      setDiagnosis(result.label);
      setConfidence(Math.round(result.confidence * 100));
      setRecommendation(result.recommendation);

      if (fromHistory !== "true") {
        addToHistory({
          imageUri,
          diagnosis: result.label,
          confidence: Math.round(result.confidence * 100),
          date: new Date().toISOString(),
          cropType,
          recommendation: result.recommendation,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
      Alert.alert(
        "Analysis Failed",
        "Unable to connect to the analysis server. Please try again.",
        [{ text: "OK" }]
      );
      setDiagnosis("Analysis Failed");
      setConfidence(0);
      setRecommendation(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!imageUri || (fromHistory === "true" && id)) {
      const record = history.find((item: ScanResult) => item.id === id);
      if (record) {
        setDiagnosis(record.diagnosis);
        setConfidence(record.confidence);
        setCropType(record.cropType);
        setRecommendation(record.recommendation); // full object
        setIsLoading(false);
        return; // skip API call
      }
    }
    // else… do your normal callBackendAPI()
    callBackendAPI();
  }, [fromHistory, id, imageUri]);

  const handleGoHome = () => router.replace("/(tabs)");
  const handleNewScan = () => router.push("/camera");
  const handleBack = () =>
    router.canGoBack() ? router.back() : handleGoHome();

  const getConfidenceColor = (conf: number) =>
    conf >= 90 ? "#22c55e" : conf >= 70 ? "#f59e0b" : "#ef4444";

  const getConfidenceIcon = (conf: number) =>
    conf >= 90
      ? "check-circle"
      : conf >= 70
      ? "exclamation-triangle"
      : "times-circle";

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111827" : "#f8fafc" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.closeButton,
            { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          ]}
          onPress={handleBack}
        >
          <FontAwesome name="times" size={24} color="white" />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: isDark ? "#fff" : "#1f2937" }]}
        >
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
            <FontAwesome name="expand" size={14} color="#6b7280" /> Tap to view
            full image
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
      <View
        style={[
          styles.resultsCard,
          { backgroundColor: isDark ? "#1f2937" : "#ffffff" },
        ]}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={isDark ? "#fff" : "#1f2937"}
            />
            <Text
              style={[
                styles.loadingText,
                { color: isDark ? "#9ca3af" : "#6b7280" },
              ]}
            >
              Analyzing {cropType.toLowerCase()} plant health...
            </Text>
            <Text
              style={[
                styles.loadingSubtext,
                { color: isDark ? "#6b7280" : "#9ca3af" },
              ]}
            >
              This may take a few moments
            </Text>
          </View>
        ) : (
          <View style={styles.resultsContent}>
            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <FontAwesome
                  name="exclamation-triangle"
                  size={20}
                  color="#ef4444"
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Diagnosis and Confidence */}
            <View style={styles.summarySection}>
              <View style={styles.resultRow}>
                <FontAwesome
                  name="leaf"
                  size={20}
                  color={isDark ? "#34d399" : "#10b981"}
                />
                <Text
                  style={[
                    styles.resultLabel,
                    { color: isDark ? "#9ca3af" : "#6b7280" },
                  ]}
                >
                  Diagnosis:
                </Text>
                <Text
                  style={[
                    styles.resultValue,
                    {
                      color:
                        diagnosis === "Healthy Plant" ||
                        diagnosis?.toLowerCase().includes("healthy")
                          ? "#22c55e"
                          : "#ef4444",
                    },
                  ]}
                >
                  {diagnosis}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <FontAwesome
                  name={getConfidenceIcon(confidence || 0)}
                  size={20}
                  color={getConfidenceColor(confidence || 0)}
                />
                <Text
                  style={[
                    styles.resultLabel,
                    { color: isDark ? "#9ca3af" : "#6b7280" },
                  ]}
                >
                  Confidence:
                </Text>
                <Text
                  style={[
                    styles.resultValue,
                    {
                      color: getConfidenceColor(confidence || 0),
                    },
                  ]}
                >
                  {confidence}%
                </Text>
              </View>
            </View>

            {/* Recommendations Section */}
            <View style={styles.recommendationsSection}>
              <View style={styles.recommendationsHeader}>
                <FontAwesome
                  name="lightbulb-o"
                  size={20}
                  color={isDark ? "#34d399" : "#10b981"}
                />
                <Text
                  style={[
                    styles.recommendationsTitle,
                    { color: isDark ? "#fff" : "#1f2937" },
                  ]}
                >
                  Treatment Recommendations
                </Text>
              </View>

              <View
                style={[
                  styles.scrollContainer,
                  { backgroundColor: isDark ? "#374151" : "#f9fafb" },
                  styles.scrollContent,
                ]}
                // style={styles.scrollContent}
              >
                {recommendation ? (
                  <>
                    {/* Description */}
                    <Text
                      style={[
                        styles.recLabel,
                        { color: isDark ? "#d1d5db" : "#4b5563" },
                      ]}
                    >
                      Description:
                    </Text>
                    <Text
                      style={[
                        styles.recText,
                        { color: isDark ? "#e5e7eb" : "#1f2937" },
                      ]}
                    >
                      {recommendation.description}
                    </Text>

                    {/* Symptoms */}
                    {recommendation.symptoms.length > 0 && (
                      <>
                        <Text
                          style={[
                            styles.recLabel,
                            { color: isDark ? "#d1d5db" : "#4b5563" },
                          ]}
                        >
                          Symptoms:
                        </Text>
                        {recommendation.symptoms.map((s, i) => (
                          <Text
                            key={i}
                            style={[
                              styles.recText,
                              { color: isDark ? "#e5e7eb" : "#1f2937" },
                            ]}
                          >
                            • {s}
                          </Text>
                        ))}
                      </>
                    )}

                    {/* Treatment */}
                    <Text
                      style={[
                        styles.recLabel,
                        { color: isDark ? "#d1d5db" : "#4b5563" },
                      ]}
                    >
                      Treatment:
                    </Text>
                    <Text
                      style={[
                        styles.recText,
                        { color: isDark ? "#e5e7eb" : "#1f2937" },
                      ]}
                    >
                      {recommendation.treatment}
                    </Text>

                    {/* Prevention */}
                    <Text
                      style={[
                        styles.recLabel,
                        { color: isDark ? "#d1d5db" : "#4b5563" },
                      ]}
                    >
                      Prevention:
                    </Text>
                    <Text
                      style={[
                        styles.recText,
                        { color: isDark ? "#e5e7eb" : "#1f2937" },
                      ]}
                    >
                      {recommendation.prevention}
                    </Text>

                    {/* Friendly Message */}
                    <Text
                      style={[
                        styles.recMessage,
                        { color: isDark ? "#a7f3d0" : "#065f46" },
                      ]}
                    >
                      {recommendation.message}
                    </Text>
                  </>
                ) : (
                  <Text
                    style={[
                      styles.recText,
                      {
                        color: isDark ? "#9ca3af" : "#6b7280",
                        fontStyle: "italic",
                      },
                    ]}
                  >
                    No recommendations available.
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? "#374151" : "#f3f4f6" },
            ]}
            onPress={handleGoHome}
          >
            <FontAwesome
              name="home"
              size={20}
              color={isDark ? "#fff" : "#1f2937"}
            />
            <Text
              style={[
                styles.actionButtonText,
                { color: isDark ? "#fff" : "#1f2937" },
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? "#22c55e" : "#16a34a" },
            ]}
            onPress={handleNewScan}
          >
            <FontAwesome name="camera" size={20} color="white" />
            <Text style={styles.actionButtonTextWhite}>New Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imageContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: "center",
  },
  previewImage: {
    height: 150,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  tapHint: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
  },
  resultsCard: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 50,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resultsContent: {
    flex: 1,
    padding: 5,
    height: "100%",
    marginBottom: "70%",
  },
  summarySection: {
    flex: 1,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: "auto",
  },
  recommendationsSection: {
    flex: 1,
    marginBottom: 20,
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    paddingBottom: 50,
    maxHeight: 300,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  recommendationsItem: {
    flexDirection: "row",
    alignItems: "flex-start",
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
  recommendationsText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButtonTextWhite: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 60,
    left: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  fullImage: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.85,
  },
  recLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },

  recText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },

  recMessage: {
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 16,
  },
});
