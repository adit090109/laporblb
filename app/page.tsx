"use client";

import { useState, useRef, useCallback } from "react";
import { Zap, Trash2, Copy, Send, History, X, FileText, ClipboardList } from "lucide-react";
import { Header } from "@/components/header";
import { ScheduleCard } from "@/components/schedule-card";
import { FormPanel } from "@/components/form-panel";
import { HistoryCard } from "@/components/history-card";
import { ToastNotification } from "@/components/toast-notification";
import { Button } from "@/components/ui/button";
import { parseScheduleData } from "@/lib/parser";
import { useHistory } from "@/hooks/use-history";
import type { ParsedData, FormValues } from "@/lib/types";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const [selectedData, setSelectedData] = useState<ParsedData | null>(null);
  const [resultText, setResultText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLTextAreaElement>(null);
  
  const { historyData, addToHistory, clearHistory } = useHistory();

  const handleParse = useCallback(() => {
    if (!inputText.trim()) {
      setToast("Paste jadwal terlebih dahulu");
      return;
    }
    
    const data = parseScheduleData(inputText);
    if (data.length === 0) {
      setToast("Tidak ada data terdeteksi");
      return;
    }
    
    setParsedData(data);
    setSelectedData(null);
    setResultText("");
    setToast(`${data.length} jadwal ditemukan`);
  }, [inputText]);

  const handleSelectData = useCallback((data: ParsedData) => {
    setSelectedData(data);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const handleGenerate = useCallback((formValues: FormValues, result: string) => {
    if (!selectedData) return;
    
    setResultText(result);
    addToHistory(result, selectedData, formValues);
    setToast("Laporan berhasil dibuat");
    
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [selectedData, addToHistory]);

  const handleViewHistory = useCallback((index: number) => {
    const entry = historyData[index];
    if (entry) {
      setResultText(entry.fullText);
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [historyData]);

  const handleSendWhatsApp = useCallback(() => {
    if (!resultText.trim()) {
      setToast("Belum ada hasil untuk dikirim");
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(resultText)}`, "_blank");
  }, [resultText]);

  const handleCopyResult = useCallback(() => {
    if (!resultText.trim()) {
      setToast("Belum ada hasil untuk disalin");
      return;
    }
    navigator.clipboard.writeText(resultText);
    setToast("Disalin ke clipboard");
  }, [resultText]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Input Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paste Jadwal</h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputText("")}
                className="h-7 px-2.5 text-xs gap-1.5"
              >
                <Trash2 className="w-3 h-3" />
                Hapus
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const textarea = document.querySelector("textarea");
                  if (textarea) {
                    textarea.focus();
                    textarea.select();
                  }
                }}
                className="h-7 px-2.5 text-xs gap-1.5"
              >
                <Copy className="w-3 h-3" />
                Select All
              </Button>
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste teks jadwal instalasi di sini...

Contoh:
1. Nama - Alamat - No HP - Home 0D ..."
            className="w-full min-h-[140px] p-4 rounded-xl bg-card border border-border text-sm font-mono resize-y focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
          />

          <Button
            onClick={handleParse}
            className="w-full h-11 text-sm font-semibold gap-2"
          >
            <Zap className="w-4 h-4" />
            Parse Jadwal
          </Button>
        </section>

        {/* Parsed Data List */}
        {parsedData.length > 0 && (
          <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hasil Parse ({parsedData.length})
              </h2>
            </div>
            
            <div className="space-y-2">
              {parsedData.map((data, i) => (
                <ScheduleCard
                  key={i}
                  data={data}
                  onClick={() => handleSelectData(data)}
                  isSelected={selectedData?.index === data.index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Form Panel */}
        <div ref={formRef}>
          <FormPanel selectedData={selectedData} onGenerate={handleGenerate} />
        </div>

        {/* Result Section */}
        {resultText && (
          <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-success" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hasil Generate</h2>
            </div>

            <Button
              onClick={handleSendWhatsApp}
              className="w-full h-11 text-sm font-semibold gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              <Send className="w-4 h-4" />
              Kirim ke WhatsApp
            </Button>

            <div className="relative">
              <textarea
                ref={resultRef}
                value={resultText}
                onChange={(e) => setResultText(e.target.value)}
                className="w-full min-h-[300px] p-4 rounded-xl bg-card border border-border text-sm font-mono resize-y focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                onClick={handleCopyResult}
                className="absolute top-3 right-3 p-2 rounded-lg bg-secondary hover:bg-muted transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </section>
        )}

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* History Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-success" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Riwayat Generate</h2>
            </div>
            {historyData.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("Hapus semua riwayat?")) {
                    clearHistory();
                    setToast("Riwayat dihapus");
                  }
                }}
                className="h-7 px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-3 h-3 mr-1" />
                Hapus Semua
              </Button>
            )}
          </div>

          {historyData.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-border text-center">
              <History className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Belum ada riwayat</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Hasil generate akan tersimpan di sini</p>
            </div>
          ) : (
            <div className="space-y-2">
              {historyData.map((entry, i) => (
                <HistoryCard
                  key={entry.id}
                  entry={entry}
                  onClick={() => handleViewHistory(i)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          message={toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
