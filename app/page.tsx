"use client";

import React, { useState, useMemo } from "react";

// Types interface for live stream event payloads
interface StreamEvent {
  txHash: string;
  dexPool: string;
  eventType: "Swap" | "Liquidity_add" | "Liquidity_remove";
  volume: number;
  status: string;
}

export default function SolamiDashboard() {
  // Live State (Replace or pass as props to your table component)
  const [events] = useState<StreamEvent[]>([
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
  ]);

  // UI Dropdown Filter states
  const [selectedEventType, setSelectedEventType] = useState<string>("ALL");
  const [selectedDex, setSelectedDex] = useState<string>("ALL");

  // Dynamic Metrics Calculations
  const totalVolume = useMemo(() => {
    return events.reduce((acc, curr) => acc + curr.volume, 0).toFixed(2);
  }, [events]);

  const totalEventsCount = events.length;

  const activeDexesCount = useMemo(() => {
    const uniqueDexes = new Set(events.map((e) => e.dexPool.split(" ")[0]));
    return uniqueDexes.size;
  }, [events]);

  // Data Filtering Engine
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchType =
        selectedEventType === "ALL" || e.eventType === selectedEventType;
      const matchDex =
        selectedDex === "ALL" ||
        e.dexPool.toLowerCase().includes(selectedDex.toLowerCase());
      return matchType && matchDex;
    });
  }, [events, selectedEventType, selectedDex]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 space-y-6 font-sans">
      
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-sky-400">
          Solami Real-Time Solana Analytics & Market Tracker
        </h1>
        <p className="text-xs text-slate-400">
          Powered by Solami Blur API & Bare-Metal gRPC Infrastructure
        </p>
      </header>

      {/* Wallet Search Bar (Data API) */}
      <div className="bg-[#131b2e] p-4 rounded-xl border border-slate-800 space-y-2">
        <label className="text-xs text-slate-400 font-medium">
          Indexed Account & Balance Query (Solami Data API)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Solana Wallet Address..."
            className="flex-1 bg-[#0b0f19] border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
          />
          <button className="bg-sky-500 hover:bg-sky-600 font-semibold px-5 py-2 rounded-lg text-sm text-black transition">
            Query Solami
          </button>
        </div>
      </div>

      {/* KPI Metric Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-xs text-slate-400 font-medium">Total SOL Volume</p>
          <p className="text-2xl font-extrabold text-sky-400">{totalVolume} SOL</p>
          <span className="text-[10px] text-emerald-400">● Live Stream Calculated</span>
        </div>

        <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-xs text-slate-400 font-medium">Active Stream Health</p>
          <p className="text-xl font-bold text-emerald-400">gRPC Live</p>
          <p className="text-[11px] text-slate-400">
            Latency: <span className="text-sky-300">~14ms</span> (99.9% Uptime)
          </p>
        </div>

        <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-xs text-slate-400 font-medium">Total Events Tracked</p>
          <p className="text-2xl font-extrabold text-white">{totalEventsCount}</p>
          <span className="text-[10px] text-slate-400">In-memory Session Buffer</span>
        </div>

        <div className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-xs text-slate-400 font-medium">Active DEX Pools</p>
          <p className="text-2xl font-extrabold text-indigo-400">{activeDexesCount} DEXs</p>
          <p className="text-[10px] text-slate-400">Raydium • Meteora • Orca</p>
        </div>
      </div>

      {/* Table Section with Links and Filters */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-5 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-md font-semibold text-slate-200">
            Live Mainnet DEX Swaps & Liquidity Events (Solami Blur API)
          </h2>

          <div className="flex gap-3">
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="bg-[#0b0f19] border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="ALL">All Event Types</option>
              <option value="Swap">Swaps Only</option>
              <option value="Liquidity_add">Liquidity Add Only</option>
            </select>

            <select
              value={selectedDex}
              onChange={(e) => setSelectedDex(e.target.value)}
              className="bg-[#0b0f19] border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="ALL">All DEXs</option>
              <option value="Raydium">Raydium</option>
              <option value="Meteora">Meteora</option>
              <option value="Orca">Orca</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b0f19] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">TX HASH</th>
                <th className="py-3 px-4">DEX POOL</th>
                <th className="py-3 px-4">EVENT TYPE</th>
                <th className="py-3 px-4">VOLUME</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvents.map((item, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-mono">
                    <a
                      href={`https://solscan.io/tx/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:underline hover:text-sky-300 inline-flex items-center gap-1 font-medium"
                      title="View Transaction on Solscan Explorer"
                    >
                      {item.txHash.length > 12
                        ? `${item.txHash.slice(0, 4)}...${item.txHash.slice(-4)}`
                        : item.txHash}
                      <span className="text-[10px]">↗</span>
                    </a>
                  </td>

                  <td className="py-3 px-4">{item.dexPool}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.eventType === "Swap"
                          ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {item.eventType}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-100">
                    {item.volume} SOL
                  </td>

                  <td className="py-3 px-4 text-emerald-400 font-medium">
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
 }