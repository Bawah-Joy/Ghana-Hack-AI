import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/constants/Colors";
import { useCrop, CropType } from "@/context/CropContext";

const { width } = Dimensions.get("window");

// Crop data with placeholder images
const crops = [
  {
    id: "maize",
    name: "Maize",
    image: require("@/assets/images/maize.jpg"),
    color: "#FFA500",
    icon: require("@/assets/images/corn-ico.png"),
  },
  {
    id: "tomato",
    name: "Tomato",
    image: require("@/assets/images/tomato.jpg"),
    color: "#FF6B6B",
    icon: require("@/assets/images/tomato-ico.png"),
  },
  {
    id: "cassava",
    name: "Cassava",
    image: require("@/assets/images/cassava.jpg"),
    color: "#8B4513",
    icon: require("@/assets/images/cassava-ico.png"),
  },
  {
    id: "cashew",
    name: "Cashew",
    image: require("@/assets/images/cashew.jpg"),
    color: "#32CD32",
    icon: require("@/assets/images/cashew-ico.png"),
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedCrop, setSelectedCrop] = useState(0);
  const { setCropType } = useCrop();

  const handleCropSelect = (index: number) => {
    setSelectedCrop(index);
    setCropType(crops[index].name as CropType);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111827" : "#f8fafc" },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.greeting,
                { color: isDark ? "#ffffff" : "#1f2937" },
              ]}
            >
              Hello Farmer! 👋
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? "#9ca3af" : "#6b7280" },
              ]}
            >
              Select a crop to analyze
            </Text>
          </View>

          {/* Modal Icon */}
          <Link href="/modal" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="info-circle"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        </View>

        {/* Image Card */}
        <View
          style={[
            styles.imageCard,
            { backgroundColor: isDark ? "#1f2937" : "#ffffff" },
          ]}
        >
          <Image
            source={crops[selectedCrop].image}
            style={styles.cropImage}
            defaultSource={require("@/assets/images/favicon.png")}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.cropName}>{crops[selectedCrop].name}</Text>
            <View
              style={[
                styles.cropBadge,
                { backgroundColor: crops[selectedCrop].color },
              ]}
            >
              <Image
                source={crops[selectedCrop].icon}
                style={[styles.cropImageIconSmall, { tintColor: "white" }]}
                defaultSource={require("@/assets/images/favicon.png")}
              />
            </View>
          </View>
        </View>

        {/* Swipeable Crop Buttons */}
        <View style={styles.cropButtonsContainer}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#ffffff" : "#1f2937" },
            ]}
          >
            Choose Crop Type
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cropButtonsScroll}
            decelerationRate="fast"
            snapToInterval={width * 0.3}
            snapToAlignment="center"
          >
            {crops.map((crop, index) => (
              <TouchableOpacity
                key={crop.id}
                style={[
                  styles.cropButton,
                  {
                    backgroundColor:
                      selectedCrop === index
                        ? crop.color
                        : isDark
                        ? "#374151"
                        : "#ffffff",
                  },
                  selectedCrop === index && styles.selectedCropButton,
                ]}
                onPress={() => handleCropSelect(index)}
                activeOpacity={0.8}
              >
                <Image
                  source={crop.icon}
                  style={[
                    styles.cropImageIcon,
                    {
                      tintColor: selectedCrop === index ? "white" : "black",
                      opacity: selectedCrop === index ? 1 : 0.5,
                    },
                  ]}
                  defaultSource={require("@/assets/images/favicon.png")}
                />
                <Text
                  style={[
                    styles.cropButtonText,
                    {
                      color:
                        selectedCrop === index
                          ? "white"
                          : isDark
                          ? "#9ca3af"
                          : "#6b7280",
                    },
                  ]}
                >
                  {crop.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Camera Button - Fixed at Bottom */}
      <TouchableOpacity
        style={[
          styles.cameraButtonInner,
          {
            backgroundColor: crops[selectedCrop].color,
            borderColor: isDark ? "#111827" : "#f8fafc",
          },
        ]}
        activeOpacity={0.8}
        onPress={() => router?.push?.("/camera")}
      >
        <FontAwesome
          style={styles.cameraButtonInnerIcon}
          name="camera"
          size={30}
          color="white"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  imageCard: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cropImageIconSmall: {
    width: 20,
    height: 20,
    resizeMode: "cover",
  },
  cropImageIcon: {
    width: 32,
    height: 32,
    resizeMode: "cover",
    // opacity: 0.5,
  },
  cropImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  cropName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  cropBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cropButtonsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cropButtonsScroll: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cropButton: {
    width: width * 0.25,
    height: 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCropButton: {
    transform: [{ scale: 1.05 }],
    elevation: 8,
  },
  cropButtonText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  instructionsCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  cameraContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },

  cameraButton: {
    alignItems: "center",

    // backgroundColor: "red",
  },

  cameraButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    position: "absolute",
    bottom: "1%",
    right: "5%",
    borderWidth: 1,
  },
  cameraButtonInnerIcon: {
    alignItems: "center",
  },
  cameraButtonText: {
    color: "#22c55e",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
});
