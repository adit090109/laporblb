"use client";

import { Clock, User, ChevronRight } from "lucide-react";
import type { HistoryEntry } from "@/lib/types";

interface HistoryCardProps {
  entry: HistoryEntry;
  onClick: () => void;
}

export function HistoryCard({ entry, onClick }: HistoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-success/30 transition-all duration-200 group relative overflow-hidden"
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-success/50 group-hover:bg-success transition-colors" />

      <div className="pl-3 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {/* Timestamp */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-mono text-muted-foreground">{entry.timestamp}</span>
          </div>

          {/* Name */}
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-sm truncate">{entry.detail.nama}</span>
          </div>

          {/* Details */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{entry.detail.installer || "-"}</span>
            <span className="text-border">•</span>
            <span>WO: {entry.detail.wo || "-"}</span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-success transition-colors flex-shrink-0" />
      </div>
    </button>
  );
}
