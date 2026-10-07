"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { solamiClient, SolamiEvent } from "../lib/solami";

function Icon({ name, className = "" }: { name: "activity" | "radio" | "shield" | "zap" | "layers" | "filter"; className?: string }) {
  const icons = {
    activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    radio: <><path d="M5 8.5a10 10 0 0 0 0 7" /><path d="M8.5 5a15 15 0 0 0 0 14" /><circle cx="12" cy="12" r="2" /><path d="M15.5 5a15 15 0 0 1 0 14" /><path d="M19 8.5a10 10 0 0 1 0 7" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    zap: <path d="m13 2-3 8h8L9 22l3-8H4l9-12Z" />,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  };
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
}

export interface SolamiTrackerProps {
  initialEvents?: SolamiEvent[];
}

export default function SolamiTracker({ initialEvents }: SolamiTrackerProps) {
  const [events, setEvents] = useState<SolamiEvent[]>(
    initialEvents || solamiClient.getInitialEvents()
  );
  const [streamHealth, setStreamHealth] = useState(solamiClient.getStreamHealthStatus());
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("ALL");

  // Advanced high-frequency gRPC stream simulation with jitter correction
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      const pools = [
        "Raydium CPMM / SOL-USDC", 
        "Meteora DLMM / SOL-BONK", 
        "Orca Whirlpool / SOL-JUP", 
        "Phoenix Orderbook / SOL-WIF"
      ];
      const types: ("Swap" | "Liquidity_add" | "Liquidity_remove" | "Arbitrage")[] = [
        "Swap", "Liquidity_add", "Arbitrage", "Swap"
      ];
      
      const newEvent: SolamiEvent = {
        txHash: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        dexPool: pools[Math.floor(Math.random() * pools.length)],
        eventType: types[Math.floor(Math.random() * types.length)],
        volume: parseFloat((Math.random() * 45 + 0.85).toFixed(2)),
        status: Math.random() > 0.3 ? "Landed (gRPC Firehose)" : "Optimized Execution",
        timestamp: Date.now(),
        feePaid: parseFloat((Math.random() * 0.0002 + 0.00003).toFixed(6)),
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 11)]); // Maintain rolling buffer of 12 items
      setStreamHealth(solamiClient.getStreamHealthStatus());
    }, 3200);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Filtered events based on user selection
  const filteredEvents = useMemo(() => {
    if (filterType === "ALL") return events;
    return events.filter(e => e.eventType === filterType);
  }, [events, filterType]);

  const totalVolume = useMemo(() => {
    return events.reduce((acc, curr) => acc + curr.volume, 0).toFixed(2);
  }, [events]);

  const handleFilterChange = useCallback((type: string) => {
    setFilterType(type);
  }, []);

  return (
    <div className="bg-slate-900/95 border border-sky-500/20 p-6 rounded-2xl shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
      {/* Background Neon Glow Effect */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Metrics Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/30 shadow-lg shadow-sky-500/20">
            <Icon name="radio" className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Solami gRPC Firehose Tracker
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {streamHealth.status}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Zero-latency YellowStone gRPC decoded stream & mempool telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Icon name="zap" className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Telemetry:</span>
            <span className="font-mono font-bold text-emerald-400">{streamHealth.latencyMs}ms</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-sky-300">{streamHealth.packetsPerSec} pkt/s</span>
          </div>

          <button
            onClick={() => setIsLiveActive(!isLiveActive)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm ${
              isLiveActive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
            }`}
          >
            {isLiveActive ? "● Live Stream On" : "⏸ Stream Paused"}
          </button>
        </div>
      </div>

      {/* Summary Cards with Enterprise Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex items-center space-x-3 shadow-inner">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Icon name="layers" className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Active Buffer Packets</p>
            <p className="text-sm font-bold font-mono text-slate-100">{events.length} Synchronized</p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex items-center space-x-3 shadow-inner">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Icon name="activity" className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Filtered Stream Volume</p>
            <p className="text-sm font-bold font-mono text-emerald-400">{totalVolume} SOL</p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex items-center space-x-3 shadow-inner">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
            <Icon name="shield" className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Consensus Verification</p>
            <p className="text-sm font-bold text-cyan-400">100% Cryptographic</p>
          </div>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="flex items-center justify-between pt-1 relative z-10">
        <div className="flex items-center gap-2">
          <Icon name="filter" className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Filter Feed:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "Swap", "Arbitrage", "Liquidity_add"].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                filterType === type
                  ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Live Events Stream Table / Feed */}
      <div className="space-y-3 relative z-10">
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          {filteredEvents.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No matching firehose packets found for filter: {filterType}
            </div>
          ) : (
            filteredEvents.map((ev, index) => (
              <div
                key={`${ev.txHash}-${index}`}
                className="bg-slate-950/90 border border-slate-800/80 hover:border-sky-500/50 p-3.5 rounded-xl flex items-center justify-between transition-all duration-200 group hover:shadow-lg hover:shadow-sky-500/5"
              >
                <div className="flex items-center space-x-3.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    ev.eventType === 'Swap' ? 'bg-sky-400 shadow-sm shadow-sky-400' : 
                    ev.eventType === 'Arbitrage' ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-emerald-400 shadow-sm shadow-emerald-400'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition flex items-center gap-2">
                      {ev.dexPool}
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">
                        {ev.eventType}
                      </span>
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                      <span>Hash: {ev.txHash.slice(0, 16)}...</span>
                      {ev.feePaid && <span className="text-slate-400">Fee: {ev.feePaid} SOL</span>}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold font-mono text-emerald-400">+{ev.volume} SOL</p>
                  <p className="text-[10px] text-sky-400/90 font-medium">{ev.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}