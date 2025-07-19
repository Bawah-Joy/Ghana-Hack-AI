import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "@/components/useColorScheme";
import { useHistory, ScanResult } from "../../context/HistoryContext";

import { format } from "date-fns";

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { history, clearHistory, removeFromHistory, loading } = useHistory();

  const handleBack = () => {
    router.back();
  };

  const renderItem = ({ item }: { item: ScanResult }) => (
    <View
      style={[
        styles.historyItem,
        { backgroundColor: isDark ? "#1f2937" : "#ffffff" },
      ]}
    >
      {/* Content area (clickable to view details) */}
      <TouchableOpacity
        style={styles.historyContent}
        onPress={() =>
          router.push({
            pathname: "/feedback",
            params: {
              id: item.id,
              imageUri: item.imageUri,
              cropType: item.cropType,
              fromHistory: "true",
            },
          })
        }
      >
        <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
        <View style={styles.historyDetails}>
          <Text
            style={[styles.historyCrop, { color: isDark ? "#fff" : "#1f2937" }]}
          >
            {item.cropType}
          </Text>
          <Text
            style={[
              styles.historyDiagnosis,
              {
                color:
                  item.diagnosis === "Healthy Plant" ? "#22c55e" : "#ef4444",
              },
            ]}
          >
            {item.diagnosis}
          </Text>
          <Text
            style={[
              styles.historyDate,
              { color: isDark ? "#9ca3af" : "#6b7280" },
            ]}
          >
            {format(new Date(item.date), "MMM dd, yyyy h:mm a")}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromHistory(item.id)}
      >
        <FontAwesome name="trash" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111827" : "#f8fafc" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={clearHistory}
          disabled={history.length === 0}
        >
          <Text
            style={[
              styles.clearButton,
              {
                color:
                  history.length === 0
                    ? isDark
                      ? "#4b5563"
                      : "#9ca3af"
                    : "#ef4444",
              },
            ]}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text
            style={[styles.loadingText, { color: isDark ? "#fff" : "#000" }]}
          >
            Loading history...
          </Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="history"
            size={48}
            color={isDark ? "#4b5563" : "#d1d5db"}
          />
          <Text
            style={[
              styles.emptyText,
              { color: isDark ? "#9ca3af" : "#6b7280" },
            ]}
          >
            No scan history yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,

    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  clearButton: {
    fontSize: 16,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  historyContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  historyDetails: {
    flex: 1,
  },
  historyCrop: {
    fontSize: 16,
    fontWeight: "bold",
  },
  historyDiagnosis: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  historyDate: {
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
  },
});
