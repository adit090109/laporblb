"use client";

import { useState, useEffect } from "react";
import { Settings2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ParsedData, FormValues } from "@/lib/types";

interface FormPanelProps {
  selectedData: ParsedData | null;
  onGenerate: (formValues: FormValues, result: string) => void;
}

const INSTALLERS = ["Toyib", "Luqman", "Manto"];

export function FormPanel({ selectedData, onGenerate }: FormPanelProps) {
  const [wo, setWo] = useState("");
  const [brim, setBrim] = useState("");
  const [sn, setSn] = useState("");
  const [modem, setModem] = useState("");
  const [dpMode, setDpMode] = useState<"1" | "2">("1");
  const [dpReal, setDpReal] = useState("");
  const [port, setPort] = useState("");
  const [output, setOutput] = useState("");
  const [redaman, setRedaman] = useState("");
  const [selectedInstallers, setSelectedInstallers] = useState<string[]>([]);

  useEffect(() => {
    if (selectedData) {
      setModem(selectedData.modem !== "-" ? selectedData.modem : "");
      setWo("");
      setBrim("");
      setSn("");
      setDpMode("1");
      setDpReal("");
      setPort("");
      setOutput("");
      setRedaman("");
      setSelectedInstallers([]);
    }
  }, [selectedData]);

  const toggleInstaller = (name: string) => {
    setSelectedInstallers(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleGenerate = () => {
    if (!selectedData) return;

    const portVal = port ? `16/${port}` : "16/-";
    const kodeDpReal = dpMode === "1" ? selectedData.kode_dp : (dpReal || "-");
    const installerList = selectedInstallers.length ? selectedInstallers.join("-") : "-";

    const result = `
DONE ***
${new Date().toLocaleDateString("id-ID")}

NAMA : ${selectedData.nama}
ALAMAT : ${selectedData.alamat}
Tikor Pelanggan : ${selectedData.tikor}

NOMORPIC : ${selectedData.hp}
SALES : ${selectedData.sales}
WO : ${wo || "-"}
BRIM ID : ${brim || "-"}
MODEM SN : ${sn || "-"}

Modem BUY / RENT : ${modem || "-"}
LAYANAN : ${selectedData.layanan}
KODE DP WO : ${selectedData.kode_dp}
KODE DP REAL : ${kodeDpReal}
PORT YANG DIINSTAL : ${portVal}
OUTPUT DP : ${output || "-"}
REDAMAN ONT DISISTEM ONT : ${redaman || "-"}
PANJANG TARIKAN : ${selectedData.panjang}
NAMA INSTALLER : ${installerList}

TERIMAKASIH BRACH BLIMBING
`.trim();

    const formValues: FormValues = {
      wo: wo || "-",
      brim: brim || "-",
      sn: sn || "-",
      modem: modem || "-",
      kode_dp_real: kodeDpReal,
      port: port || "-",
      output: output || "-",
      redaman: redaman || "-",
      installerList
    };

    onGenerate(formValues, result);
  };

  if (!selectedData) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-5 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Settings2 className="w-4 h-4 text-primary" />
        <span>Lengkapi Data</span>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">WO</label>
            <Input
              value={wo}
              onChange={e => setWo(e.target.value)}
              placeholder="Nomor WO"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">BRIM ID</label>
            <Input
              value={brim}
              onChange={e => setBrim(e.target.value)}
              placeholder="BRIM ID"
              className="h-9 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Modem SN</label>
            <Input
              value={sn}
              onChange={e => setSn(e.target.value)}
              placeholder="Serial Number"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Modem Status</label>
            <Input
              value={modem}
              onChange={e => setModem(e.target.value)}
              placeholder="BUY / RENT"
              className="h-9 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Mode Kode DP</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDpMode("1")}
              className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                dpMode === "1"
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              Dari WO
            </button>
            <button
              type="button"
              onClick={() => setDpMode("2")}
              className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                dpMode === "2"
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              Manual
            </button>
          </div>
          {dpMode === "2" && (
            <Input
              value={dpReal}
              onChange={e => setDpReal(e.target.value)}
              placeholder="Kode DP Real"
              className="h-9 text-sm mt-2"
            />
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Port</label>
            <Input
              value={port}
              onChange={e => setPort(e.target.value)}
              placeholder="Port"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Output DP</label>
            <Input
              value={output}
              onChange={e => setOutput(e.target.value)}
              placeholder="Output"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Redaman</label>
            <Input
              value={redaman}
              onChange={e => setRedaman(e.target.value)}
              placeholder="Redaman"
              className="h-9 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Installer</label>
          <div className="grid grid-cols-3 gap-2">
            {INSTALLERS.map(name => (
              <button
                key={name}
                type="button"
                onClick={() => toggleInstaller(name)}
                className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                  selectedInstallers.includes(name)
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        className="w-full h-11 text-sm font-semibold gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Generate Laporan
      </Button>
    </div>
  );
}
