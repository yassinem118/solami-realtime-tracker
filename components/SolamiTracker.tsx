"use client";

import React, { useState, useMemo } from "react";

export interface StreamEvent {
  txHash: string;
  dexPool: string;
  eventType: "Swap" | "Liquidity_add" | "Liquidity_remove";
  volume: number;
  status: string;
}

export interface SolamiTrackerProps {
  initialEvents?: StreamEvent[];
}

export default function SolamiTracker({ initialEvents }: SolamiTrackerProps) {
  const [events] = useState<StreamEvent[]>(
    initialEvents || [
      {
        txHash: "5KjP8xLZ9mQ8vX1z234567890abcdef1234567890",
        dexPool: "Raydium CPMM / SOL",
        eventType: "Swap",
        volume: 3.42,
        status: "Landed (gRPC)",
      },
      {
        txHash: "3MvW1qRK7pL9uY2z345678901abcdef1234567890",
        dexPool: "Meteora DLMM / SOL",
        eventType: "Liquidity_add",
        volume: 12.5,
        status: "Landed (gRPC)",
      },
      {
        txHash: "2NhX7pTY4kM0tW3z45678902abcdef1234567890",
        dexPool: "Orca Whirlpool / SOL",
        eventType: "Swap",
        volume: 0.85,
        status: "Landed (gRPC)",
      },
    ]
  );

  const totalVolume = useMemo(() => {
    return events.reduce((acc, curr) => acc + curr.volume, 0).toFixed(2);
  }, [events]);

  return (
    <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl space-y-2">
      <h3 className="text-sm font-semibold text-sky-400">Solami Live Tracker Component</h3>
      <p className="text-xs text-slate-300">
        Total Session Volume: <span className="font-bold text-white">{totalVolume} SOL</span>
      </p>
      <p className="text-[11px] text-slate-400">Stream Status: Live via gRPC</p>
    </div>
  );
}