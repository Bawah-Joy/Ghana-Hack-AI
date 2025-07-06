// import { StyleSheet } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';

// export default function HistoryScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>History</Text>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });

// app/(tabs)/history.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  getHistory,
  clearHistory,
  removeFromHistory,
  ScanEntry,
} from "../storage/history";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [selected, setSelected] = useState<ScanEntry | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getHistory();
      setHistory(data);
    };
    load();
  }, []);

  const handleClear = async () => {
    await clearHistory();
    setHistory([]);
  };

  const handleDelete = async (id: string) => {
    await removeFromHistory(id);
    setHistory(await getHistory());
  };

  const renderItem = ({ item }: { item: ScanEntry }) => (
    <View style={styles.card}>
      <Image source={item.imageUri} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.cropName}>{item.cropName}</Text>
        <Text style={styles.result}>{item.result}</Text>
        <Text style={styles.confidence}>
          Confidence: {(item.confidence * 100).toFixed(1)}%
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <FontAwesome name="trash" size={24} color="#B22222" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No scans yet.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      {history.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          activeOpacity={0.8}
        >
          <Text style={styles.clearButtonText}>Clear All History</Text>
        </TouchableOpacity>
      )}
      {/* Bottom sheet for details */}
      {selected && (
        <BottomSheet
          isVisible={!!selected}
          onClose={() => setSelected(null)}
          entry={selected}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F8FF", paddingTop: 16 },
  list: { padding: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
    width: CARD_WIDTH,
    alignSelf: "center",
  },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 12, justifyContent: "center" },
  cropName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2F4F4F",
    marginBottom: 4,
  },
  result: { fontSize: 16, color: "#228B22", marginBottom: 4 },
  confidence: { fontSize: 14, color: "#6B8E23", marginBottom: 4 },
  timestamp: { fontSize: 12, color: "#A9A9A9" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#696969" },
  clearButton: {
    backgroundColor: "#6B8E23",
    paddingVertical: 14,
    borderRadius: 24,
    marginHorizontal: 32,
    marginBottom: 24,
    alignItems: "center",
  },
  clearButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
