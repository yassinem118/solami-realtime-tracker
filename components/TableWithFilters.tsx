"use client";

import React, { useState, useMemo, useCallback } from "react";
import { SolamiEvent } from "../lib/solami";

export interface TableWithFiltersProps {
  initialEvents?: SolamiEvent[];
}

export default function TableWithFilters({ initialEvents }: TableWithFiltersProps) {
  const [events] = useState<SolamiEvent[]>(
    initialEvents || [
      {
        txHash: "5KjP8xLZ9mQ8vX1z234567890abcdef1234567890",
        dexPool: "Raydium CPMM / SOL-USDC",
        eventType: "Swap",
        volume: 3.42,
        status: "Landed (gRPC Firehose)",
        timestamp: Date.now() - 5000,
      },
      {
        txHash: "3MvW1qRK7pL9uY2z345678901abcdef1234567890",
        dexPool: "Meteora DLMM / SOL-BONK",
        eventType: "Liquidity_add",
        volume: 12.5,
        status: "Optimized Execution",
        timestamp: Date.now() - 15000,
      },
      {
        txHash: "2NhX7pTY4kM0tW3z45678902abcdef1234567890",
        dexPool: "Orca Whirlpool / SOL-JUP",
        eventType: "Swap",
        volume: 0.85,
        status: "Landed (gRPC Firehose)",
        timestamp: Date.now() - 25000,
      },
    ]
  );

  const [selectedEventType, setSelectedEventType] = useState<string>("ALL");
  const [selectedDex, setSelectedDex] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Advanced multi-criteria filtering with search query support
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchType = selectedEventType === "ALL" || e.eventType === selectedEventType;
      const matchDex = selectedDex === "ALL" || e.dexPool.toLowerCase().includes(selectedDex.toLowerCase());
      const matchSearch = !searchQuery || e.txHash.toLowerCase().includes(searchQuery.toLowerCase()) || e.dexPool.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchDex && matchSearch;
    });
  }, [events, selectedEventType, selectedDex, searchQuery]);

  const handleEventTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEventType(e.target.value);
  }, []);

  const handleDexChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDex(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="bg-[#131b2e]/95 border border-sky-500/20 rounded-2xl p-6 space-y-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            Live Mainnet DEX Swaps & Liquidity Events
            <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-full">
              {filteredEvents.length} Records
            </span>
          </h3>
          <p className="text-xs text-slate-400">Filtered via Solami Blur & gRPC Stream API Telemetry</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search TX hash or pool..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-[#0b0f19] border border-slate-700/80 text-xs text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 transition placeholder:text-slate-500 w-48 sm:w-56"
          />

          {/* Event Type Filter */}
          <select
            value={selectedEventType}
            onChange={handleEventTypeChange}
            aria-label="Filter events by type"
            className="bg-[#0b0f19] border border-slate-700/80 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 cursor-pointer transition shadow-sm"
          >
            <option value="ALL">All Event Types</option>
            <option value="Swap">Swaps Only</option>
            <option value="Liquidity_add">Liquidity Add Only</option>
            <option value="Liquidity_remove">Liquidity Remove Only</option>
          </select>

          {/* DEX Filter */}
          <select
            value={selectedDex}
            onChange={handleDexChange}
            aria-label="Filter events by DEX pool"
            className="bg-[#0b0f19] border border-slate-700/80 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 cursor-pointer transition shadow-sm"
          >
            <option value="ALL">All DEXs</option>
            <option value="Raydium">Raydium</option>
            <option value="Meteora">Meteora</option>
            <option value="Orca">Orca</option>
          </select>
        </div>
      </div>

      {/* Enterprise Table View */}
      <div className="overflow-x-auto relative z-10 border border-slate-800/80 rounded-xl bg-[#0b0f19]/60">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0b0f19] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-mono">TX HASH</th>
              <th className="py-3.5 px-4">DEX POOL</th>
              <th className="py-3.5 px-4">EVENT TYPE</th>
              <th className="py-3.5 px-4">VOLUME</th>
              <th className="py-3.5 px-4">STREAM STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((item, index) => (
                <tr key={`${item.txHash}-${index}`} className="hover:bg-slate-800/40 transition group">
                  <td className="py-3 px-4 font-mono">
                    <a
                      href={`https://solscan.io/tx/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:underline hover:text-sky-300 inline-flex items-center gap-1 font-medium group-hover:text-sky-300"
                      title="View Transaction on Solscan Explorer"
                    >
                      {item.txHash.length > 14
                        ? `${item.txHash.slice(0, 6)}...${item.txHash.slice(-6)}`
                        : item.txHash}
                      <span className="text-[10px]" aria-hidden="true">↗</span>
                    </a>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-200">{item.dexPool}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${
                        item.eventType === "Swap"
                          ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                          : item.eventType === "Liquidity_add"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {item.eventType}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold font-mono text-emerald-400">
                    +{item.volume} SOL
                  </td>

                  <td className="py-3 px-4 text-sky-400/90 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-500 text-xs">
                  No streaming events matching your filter criteria. Try resetting the search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}