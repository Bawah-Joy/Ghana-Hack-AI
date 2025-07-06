// components/BottomSheet.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { ScanEntry } from "../app/storage/history";

const { height } = Dimensions.get("window");

export default function BottomSheet({
  isVisible,
  onClose,
  entry,
}: {
  isVisible: boolean;
  onClose: () => void;
  entry: ScanEntry;
}) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.content}>
        <Image source={entry.imageUri} style={styles.image} />
        <Text style={styles.title}>{entry.cropName}</Text>
        <Text style={styles.text}>Result: {entry.result}</Text>
        <Text style={styles.text}>
          Confidence: {(entry.confidence * 100).toFixed(1)}%
        </Text>
        <Text style={styles.text}>Date: {entry.timestamp}</Text>
        <TouchableWithoutFeedback onPress={onClose}>
          <Text style={styles.close}>Close</Text>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: "flex-end", margin: 0 },
  content: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: height * 0.4,
  },
  image: { width: "100%", height: 180, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  text: { fontSize: 14, marginBottom: 4 },
  close: {
    marginTop: 12,
    alignSelf: "center",
    color: "#6B8E23",
    fontWeight: "600",
  },
});
