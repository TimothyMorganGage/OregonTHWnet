import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Claim, DenialRecord } from "@/types";
import { SAMPLE_CLAIMS, DENIAL_RECORDS } from "@/data/sampleData";

interface AppContextType {
  claims: Claim[];
  denials: DenialRecord[];
  addClaim: (claim: Claim) => Promise<void>;
  updateClaim: (id: string, updates: Partial<Claim>) => Promise<void>;
  deleteClaim: (id: string) => Promise<void>;
  updateDenial: (id: string, updates: Partial<DenialRecord>) => Promise<void>;
  isLoading: boolean;
  stats: {
    totalClaims: number;
    approvedClaims: number;
    deniedClaims: number;
    approvalRate: number;
    totalBilled: number;
    totalPaid: number;
    openDenials: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [denials, setDenials] = useState<DenialRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const storedClaims = await AsyncStorage.getItem("thw_claims");
      const storedDenials = await AsyncStorage.getItem("thw_denials");

      if (storedClaims) {
        setClaims(JSON.parse(storedClaims));
      } else {
        setClaims(SAMPLE_CLAIMS);
        await AsyncStorage.setItem("thw_claims", JSON.stringify(SAMPLE_CLAIMS));
      }

      if (storedDenials) {
        setDenials(JSON.parse(storedDenials));
      } else {
        setDenials(DENIAL_RECORDS);
        await AsyncStorage.setItem("thw_denials", JSON.stringify(DENIAL_RECORDS));
      }
    } catch (e) {
      setClaims(SAMPLE_CLAIMS);
      setDenials(DENIAL_RECORDS);
    } finally {
      setIsLoading(false);
    }
  }

  async function addClaim(claim: Claim) {
    const updated = [claim, ...claims];
    setClaims(updated);
    await AsyncStorage.setItem("thw_claims", JSON.stringify(updated));
  }

  async function updateClaim(id: string, updates: Partial<Claim>) {
    const updated = claims.map(c =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    );
    setClaims(updated);
    await AsyncStorage.setItem("thw_claims", JSON.stringify(updated));
  }

  async function deleteClaim(id: string) {
    const updated = claims.filter(c => c.id !== id);
    setClaims(updated);
    await AsyncStorage.setItem("thw_claims", JSON.stringify(updated));
  }

  async function updateDenial(id: string, updates: Partial<DenialRecord>) {
    const updated = denials.map(d => d.id === id ? { ...d, ...updates } : d);
    setDenials(updated);
    await AsyncStorage.setItem("thw_denials", JSON.stringify(updated));
  }

  const approved = claims.filter(c => c.status === "approved");
  const denied = claims.filter(c => c.status === "denied");
  const totalBilled = claims.reduce((sum, c) => sum + c.billedAmount, 0);
  const totalPaid = claims.reduce((sum, c) => sum + (c.paidAmount ?? 0), 0);
  const openDenials = denials.filter(d => d.status === "open" || d.status === "appealing").length;

  const stats = {
    totalClaims: claims.length,
    approvedClaims: approved.length,
    deniedClaims: denied.length,
    approvalRate: claims.length > 0 ? (approved.length / claims.length) * 100 : 0,
    totalBilled,
    totalPaid,
    openDenials,
  };

  return (
    <AppContext.Provider value={{ claims, denials, addClaim, updateClaim, deleteClaim, updateDenial, isLoading, stats }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
