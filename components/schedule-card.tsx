"use client";

import { User, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import type { ParsedData } from "@/lib/types";

interface ScheduleCardProps {
  data: ParsedData;
  onClick: () => void;
  isSelected?: boolean;
}

export function ScheduleCard({ data, onClick, isSelected }: ScheduleCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
        isSelected
          ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20"
          : "bg-card border-border hover:border-primary/30 hover:bg-card/80"
      }`}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-colors ${
          isSelected ? "bg-primary" : "bg-primary/50 group-hover:bg-primary"
        }`}
      />

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
            WO #{data.index}
          </span>
          {data.kode_dp !== "-" ? (
            data.kode_dp_valid ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success border border-success/20">
                <CheckCircle2 className="w-3 h-3" />
                {data.kode_dp}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-warning/10 text-warning border border-warning/20">
                <AlertTriangle className="w-3 h-3" />
                {data.kode_dp}
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/20">
              <AlertTriangle className="w-3 h-3" />
              No DP Code
            </span>
          )}
        </div>

        {/* Name */}
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="font-medium text-sm truncate">{data.nama}</span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <span className="text-xs text-muted-foreground line-clamp-2">{data.alamat}</span>
        </div>
      </div>
    </button>
  );
}
