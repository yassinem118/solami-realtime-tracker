"use client";

import React, { useState, useMemo } from "react";

export interface StreamEvent {
  txHash: string;
  dexPool: string;
  eventType: "Swap" | "Liquidity_add" | "Liquidity_remove";
  volume: number;
  status: string;
}

export default function TableWithFilters() {
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

  const [selectedEventType, setSelectedEventType] = useState<string>("ALL");
  const [selectedDex, setSelectedDex] = useState<string>("ALL");

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
  );
}