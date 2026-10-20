"use client";

import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

/** Counter standee from the Starter Pack. Rendered without a phone frame. */
export function CounterQR({ animateIn }: { animateIn: boolean }) {
  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 30, rotate: -4 } : false}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ type: "spring", damping: 18 }}
      className="flex flex-col items-center"
    >
      <div className="w-[250px] rounded-2xl bg-plum p-4 text-center text-white shadow-[0_24px_40px_-16px_rgba(42,20,38,.6)]">
        <p className="text-[13px] font-bold lowercase">meesho</p>
        <p className="-mt-1 text-[30px] leading-none font-black tracking-wide text-orange">DUKAAN</p>
        <p className="mt-2 text-[13px] font-semibold">Ramesh Garments</p>
        <div className="mx-auto mt-3 w-fit rounded-xl bg-white p-2.5">
          <QRCodeSVG value="https://meesho.com/" size={140} fgColor="#2a1426" level="M" />
        </div>
        <p className="mt-3 font-hindi text-[17px] font-semibold text-[#ffb3bd]">स्कैन करें, घर बैठे मँगाएँ</p>
        <p className="text-[11px] text-white/80">Scan to order from us online</p>
        <div className="mt-2 flex justify-center gap-1.5 text-[10px]">
          <span className="rounded-full border border-white/40 px-2 py-0.5">Same price</span>
          <span className="rounded-full border border-white/40 px-2 py-0.5">2-day delivery</span>
        </div>
      </div>
      <div className="-mt-1 h-4 w-[200px] rounded-b-lg bg-gradient-to-b from-[#d9d1d6] to-[#b5acb2]" />
      <div className="h-2 w-[280px] rounded-full bg-black/10 blur-[2px]" />
    </motion.div>
  );
}

const WEEKS = [
  { w: "Sep 15", v: 140 },
  { w: "Sep 22", v: 150 },
  { w: "Sep 29", v: 165 },
  { w: "Oct 6", v: 180 },
  { w: "Oct 13", v: 200 },
  { w: "Oct 20", v: 280 },
];

/** Buyer searches near Kharagpur for "cotton kurti under ₹500", one series. */
export function TrendScreen() {
  const [hover, setHover] = useState<number | null>(null);
  const W = 260;
  const H = 170;
  const pad = { l: 30, r: 6, t: 14, b: 22 };
  const max = 300;
  const bw = (W - pad.l - pad.r) / WEEKS.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="shrink-0 bg-[#0e7c8a] px-3 py-2.5 text-white">
        <p className="text-[10.5px] font-semibold tracking-wide text-[#bff3f9]">DUKAAN AI · DEMAND</p>
        <p className="text-[14px] leading-tight font-semibold">What Kharagpur is searching</p>
      </div>
      <div className="flex-1 p-3">
        <p className="text-[12.5px] font-semibold text-ink">“Cotton kurti under ₹500”</p>
        <p className="text-[10.5px] text-muted">Weekly buyer searches within 10 km</p>
        <div className="relative mt-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Weekly searches rising from 140 to 280">
            {[0, 100, 200, 300].map((g) => (
              <g key={g}>
                <line x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} stroke="#ece6ea" strokeWidth="1" />
                <text x={pad.l - 5} y={y(g) + 3} textAnchor="end" fontSize="8.5" fill="#6e5a69">
                  {g}
                </text>
              </g>
            ))}
            {WEEKS.map((d, i) => {
              const x = pad.l + i * bw + 3;
              const w = bw - 6;
              const top = y(d.v);
              const last = i === WEEKS.length - 1;
              return (
                <g key={d.w} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  <rect x={pad.l + i * bw} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
                  <motion.path
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    style={{ transformOrigin: `0px ${y(0)}px` }}
                    d={`M${x} ${y(0)} V${top + 4} Q${x} ${top} ${x + 4} ${top} H${x + w - 4} Q${x + w} ${top} ${x + w} ${top + 4} V${y(0)} Z`}
                    fill={last ? "#ff9f00" : hover === i ? "#8a3a7b" : "#570d48"}
                    opacity={hover === null || hover === i || last ? 1 : 0.85}
                  />
                  <text x={x + w / 2} y={H - 8} textAnchor="middle" fontSize="8" fill="#6e5a69">
                    {d.w}
                  </text>
                  {last && (
                    <text x={x + w / 2} y={top - 4} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#2a1426">
                      +40%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          {hover !== null && (
            <div
              className="pointer-events-none absolute -top-1 rounded-md bg-ink px-2 py-1 text-[10.5px] text-white shadow"
              style={{ left: `${((pad.l + hover * bw) / W) * 100}%` }}
            >
              Week of {WEEKS[hover].w}: <b>{WEEKS[hover].v}</b> searches
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[#f7f3f6] p-2">
            <p className="text-[10px] text-muted">Shops stocking it nearby</p>
            <p className="text-[18px] leading-tight font-bold text-ink">7</p>
            <p className="text-[10px] text-muted">3 out of L size</p>
          </div>
          <div className="rounded-lg bg-[#f7f3f6] p-2">
            <p className="text-[10px] text-muted">Ramesh&apos;s stock</p>
            <p className="text-[18px] leading-tight font-bold text-ink">4 left</p>
            <p className="text-[10px] text-coral">Reorder this week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
