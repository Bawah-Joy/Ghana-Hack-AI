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
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  getHistory,
  clearHistory,
  removeFromHistory,
  ScanEntry,
} from "../storage/history";
// import BottomSheet from "@/components/BottomSheet";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [filtered, setFiltered] = useState<ScanEntry[]>([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailEntry, setDetailEntry] = useState<ScanEntry | null>(null);

  // load
  useEffect(() => {
    (async () => {
      const data = await getHistory();
      setHistory(data);
      setFiltered(data);
    })();
  }, []);

  // filter on search
  useEffect(() => {
    if (!search) return setFiltered(history);
    const q = search.toLowerCase();
    setFiltered(
      history.filter(
        (e) =>
          e.cropName.toLowerCase().includes(q) ||
          e.result.toLowerCase().includes(q)
      )
    );
  }, [search, history]);

  const handleClearAll = () => {
    Alert.alert(
      "Clear History?",
      "Are you sure you want to delete all entries?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            setHistory([]);
            setFiltered([]);
            setSelectedIds(new Set());
          },
        },
      ]
    );
  };

  const handleDeleteOne = async (id: string) => {
    await removeFromHistory(id);
    const updated = await getHistory();
    setHistory(updated);
  };

  const handleBulkDelete = () => {
    Alert.alert(
      `Delete ${selectedIds.size} item(s)?`,
      "This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            for (let id of selectedIds) {
              await removeFromHistory(id);
            }
            const updated = await getHistory();
            setHistory(updated);
            setSelectedIds(new Set());
          },
        },
      ]
    );
  };

  const handleDeleteAction = () => {
    if (selectedIds.size > 0) {
      // Bulk delete flow
      Alert.alert(
        `Delete ${selectedIds.size} item(s)?`,
        "This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              for (let id of selectedIds) {
                await removeFromHistory(id);
              }
              const updated = await getHistory();
              setHistory(updated);
              setFiltered(updated);
              setSelectedIds(new Set());
            },
          },
        ]
      );
    } else {
      // Clear all flow
      Alert.alert(
        "Clear History?",
        "Are you sure you want to delete all entries?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            style: "destructive",
            onPress: async () => {
              await clearHistory();
              setHistory([]);
              setFiltered([]);
              setSelectedIds(new Set());
            },
          },
        ]
      );
    }
  };

  const onCardPress = (item: ScanEntry) => {
    if (selectedIds.size) {
      // toggle selection
      const next = new Set(selectedIds);
      next.has(item.id) ? next.delete(item.id) : next.add(item.id);
      setSelectedIds(next);
    } else {
      setDetailEntry(item);
    }
  };

  const onCardLongPress = (item: ScanEntry) => {
    const next = new Set(selectedIds);
    next.has(item.id) ? next.delete(item.id) : next.add(item.id);
    setSelectedIds(next);
  };

  const renderItem = ({ item }: { item: ScanEntry }) => {
    const isSelected = selectedIds.has(item.id);
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => onCardPress(item)}
        onLongPress={() => onCardLongPress(item)}
        activeOpacity={0.8}
      >
        <Image source={item.imageUri} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.cropName}>{item.cropName}</Text>
          <Text style={styles.result}>{item.result}</Text>
          <Text style={styles.confidence}>
            Confidence: {(item.confidence * 100).toFixed(1)}%
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        {/* {!selectedIds.size && (
          <TouchableOpacity onPress={() => handleDeleteOne(item.id)}>
            <FontAwesome name="trash" size={24} color="#B22222" />
          </TouchableOpacity>
        )} */}
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <FontAwesome name="check-circle" size={28} color="#6B8E23" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <View style={styles.headerActions}>
          {/* {!!selectedIds.size && ( */}
          {/* // <TouchableOpacity onPress={handleBulkDelete} style={styles.iconBtn}> */}
          {/* // <FontAwesome name="trash" size={24} color="#fff" /> */}
          {/* </TouchableOpacity> */}
          {/* // )} */}
          <TouchableOpacity onPress={handleDeleteAction} style={styles.iconBtn}>
            <FontAwesome name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} style={{ marginHorizontal: 8 }} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search crops or results"
          style={styles.searchInput}
        />
      </View>

      {/* LIST OR EMPTY */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No scans match your criteria.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      {/* 
      // DETAILS BOTTOM SHEET 
      {detailEntry && (
        <BottomSheet
          isVisible
          entry={detailEntry}
          onClose={() => setDetailEntry(null)}
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F8FF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6B8E23",
    paddingHorizontal: 16,
    paddingTop: "15%",
    paddingBottom: 16,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  headerActions: { flexDirection: "row" },
  iconBtn: {
    marginLeft: 16,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 6,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    paddingHorizontal: 4,
  },

  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    overflow: "hidden",
    alignItems: "center",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#6B8E23",
    opacity: 0.8,
  },
  image: { width: 150, height: 100 },
  info: { flex: 1, padding: 12 },
  cropName: { fontSize: 16, fontWeight: "bold", color: "#2F4F4F" },
  result: { fontSize: 14, color: "#228B22", marginVertical: 2 },
  confidence: { fontSize: 12, color: "#6B8E23" },
  timestamp: { fontSize: 10, color: "#A9A9A9", marginTop: 4 },

  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#696969" },

  selectedOverlay: {
    position: "absolute",
    top: 6,
    right: 6,
  },
});

// https://expo.dev/accounts/saiah/projects/crop-guard-app/builds/a173f643-a231-40ec-969d-742353221806
