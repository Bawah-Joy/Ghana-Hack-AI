import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the possible crops
export type CropType = "Maize" | "Cassava" | "Cashew" | "Tomato";

// Context shape
interface CropContextType {
  cropType: CropType;
  setCropType: (crop: CropType) => void;
}

// Create context with default values
const CropContext = createContext<CropContextType | undefined>(undefined);

// Provider component
export const CropProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cropType, setCropType] = useState<CropType>("Maize");
  return (
    <CropContext.Provider value={{ cropType, setCropType }}>
      {children}
    </CropContext.Provider>
  );
};

// Custom hook to consume context
export function useCrop(): CropContextType {
  const context = useContext(CropContext);
  if (!context) {
    throw new Error("useCrop must be used within a CropProvider");
  }
  return context;
}
