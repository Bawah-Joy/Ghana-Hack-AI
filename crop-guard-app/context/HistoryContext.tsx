import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Recommendation = {
  description: string;
  symptoms: string[];
  treatment: string;
  prevention: string;
  message: string;
};

export interface ScanResult {
  id: string;
  imageUri: string;
  diagnosis: string;
  confidence: number;
  date: string;
  cropType: string;
  recommendation: Recommendation;
}

interface HistoryContextType {
  history: ScanResult[];
  addToHistory: (result: Omit<ScanResult, "id">) => Promise<void>;
  removeFromHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  loading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem("scanHistory");
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const addToHistory = async (result: Omit<ScanResult, "id">) => {
    const newItem = {
      ...result,
      id: Date.now().toString(),
    };

    const newHistory = [newItem, ...history];
    setHistory(newHistory);

    try {
      await AsyncStorage.setItem("scanHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    try {
      await AsyncStorage.removeItem("scanHistory");
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  const removeFromHistory = async (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    setHistory(newHistory);

    try {
      await AsyncStorage.setItem("scanHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to remove item from history:", error);
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        removeFromHistory,
        loading,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
