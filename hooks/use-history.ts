"use client";

import { useState, useEffect, useCallback } from "react";
import type { HistoryEntry, ParsedData, FormValues } from "@/lib/types";

const STORAGE_KEY = "biznet_history";
const MAX_HISTORY = 50;

export function useHistory() {
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistoryData(JSON.parse(stored));
      } catch {
        setHistoryData([]);
      }
    }
  }, []);

  const saveToStorage = useCallback((data: HistoryEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const addToHistory = useCallback((
    generatedText: string,
    selectedData: ParsedData,
    formValues: FormValues
  ) => {
    const timestamp = new Date().toLocaleString("id-ID", { hour12: false });
    const ringkasan = `${selectedData.nama} - ${selectedData.alamat.substring(0, 35)}`;
    
    const entry: HistoryEntry = {
      id: Date.now() + Math.random(),
      timestamp,
      ringkasan,
      fullText: generatedText,
      detail: {
        nama: selectedData.nama,
        alamat: selectedData.alamat,
        hp: selectedData.hp,
        sales: selectedData.sales,
        wo: formValues.wo,
        brim: formValues.brim,
        sn: formValues.sn,
        modem: formValues.modem,
        kode_dp_wo: selectedData.kode_dp,
        kode_dp_real: formValues.kode_dp_real,
        port: formValues.port,
        output: formValues.output,
        redaman: formValues.redaman,
        installer: formValues.installerList,
        layanan: selectedData.layanan,
        panjang: selectedData.panjang
      }
    };

    setHistoryData(prev => {
      const newData = [entry, ...prev].slice(0, MAX_HISTORY);
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  const clearHistory = useCallback(() => {
    setHistoryData([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    historyData,
    addToHistory,
    clearHistory
  };
}
