// storage/history.ts
// import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ScanEntry {
  id: string;
  imageUri: number;
  result: string;
  timestamp: string;
  confidence: number;
  cropName: string;
}

const STORAGE_KEY = "scan_history";

export const dummyHistoryData = [
  {
    id: "1",
    cropName: "Tomato",
    result: "Early Blight",
    confidence: 0.87,
    imageUri: require("@/assets/images/tomatoes.png"),
    timestamp: "2025-07-04 14:23",
  },
  {
    id: "2",
    cropName: "Cassava",
    result: "Brown Streak",
    confidence: 0.75,
    imageUri: require("@/assets/images/cassava.jpg"),
    timestamp: "2025-07-03 10:15",
  },
  {
    id: "3",
    cropName: "Maize",
    result: "Healthy",
    confidence: 0.95,
    imageUri: require("@/assets/images/maize.jpg"),
    timestamp: "2025-07-01 09:42",
  },
  {
    id: "4",
    cropName: "Cassava",
    result: "Brown Streak",
    confidence: 0.75,
    imageUri: require("@/assets/images/cassava.jpg"),
    timestamp: "2025-07-03 10:15",
  },
  {
    id: "5s",
    cropName: "Maize",
    result: "Healthy",
    confidence: 0.95,
    imageUri: require("@/assets/images/maize.jpg"),
    timestamp: "2025-07-01 09:42",
  },
];

/**
 * Fetches the scan history from AsyncStorage.
 * @returns Array of ScanEntry or empty array if none exists.
 */
export async function getHistory(): Promise<ScanEntry[]> {
  //   try {
  //     const raw = await AsyncStorage.getItem(STORAGE_KEY);
  //     return raw ? (JSON.parse(raw) as ScanEntry[]) : [];
  //   } catch (e) {
  //     console.error("Failed to load history:", e);
  //     return [];
  //   }
  console.log("Getting History");
  //   return [];
  return dummyHistoryData;
}

/**
 * Adds a new scan entry to history and persists it.
 * @param entry The ScanEntry to add.
 */
export async function addToHistory(entry: ScanEntry): Promise<void> {
  //   const history = await getHistory();
  //   const updated = [entry, ...history];
  //   try {
  //     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  //   } catch (e) {
  //     console.error("Failed to save history:", e);
  //   }
  console.log("Adding History, ", entry);
}

/**
 * Clears all scan history.
 */
export async function clearHistory(): Promise<void> {
  //   try {
  //     await AsyncStorage.removeItem(STORAGE_KEY);
  //   } catch (e) {
  //     console.error("Failed to clear history:", e);
  //   }
  console.log("Clearing History");
}

export async function removeFromHistory(id: string): Promise<void> {
  const history = await getHistory();
  const filtered = history.filter((item) => item.id !== id);
  //   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  console.log("Clearing History");
}
