"use client";

import { motion } from "motion/react";
import { ChevronDown, Lock, MapPin, ShieldCheck, Store, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react";
import { useState } from "react";
import {
  DEMAND_RAMP,
  LOCALITIES,
  MIN_STORES,
  PRICE_BANDS,
  RISING,
  STOCKOUTS,
  demandColor,
  demandInk,
  type Locality,
} from "@/data/insights";

export function InsightsDashboard({ step, compact = false }: { step: 1 | 2 | 3; compact?: boolean }) {
  const [hoverName, setHoverName] = useState<string | null>(null);
  const [clicked, setClicked] = useState<string | null>(null);
  const selectedName = clicked ?? (step >= 2 ? "Gole Bazaar" : null);
  const selected = LOCALITIES.find((l) => l.name === selectedName) ?? null;

  return (
    <div className={`flex flex-col bg-[#faf7f9] text-ink ${compact ? "min-h-full" : "h-full"}`}>
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-black/5 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-plum">
            <Store size={15} className="text-orange" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold">Dukaan Insights</p>
            <p className="text-[10px] text-muted">for brands & wholesalers</p>
          </div>
        </div>
        <span className="rounded-md bg-plum-soft px-2 py-1 text-[11px] font-medium text-plum">Saanjh Ethnic · illustrative brand</span>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {["Kharagpur", "Women's ethnic wear", "Last 4 weeks"].map((f) => (
            <span key={f} className="flex items-center gap-1 rounded-md border border-black/10 bg-white px-2 py-1 text-[11px]">
              {f} <ChevronDown size={12} className="text-muted" />
            </span>
          ))}
        </div>
      </header>

      <div className={`grid shrink-0 gap-2 px-4 pt-3 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
        <Kpi label="Dukaan shops reporting" value="1,240" sub="Kharagpur, opt-in" />
        <Kpi label="Buyer searches this week" value="18.4k" sub="+12% vs last week" />
        <Kpi label="Stock-out rate" value="23%" sub="of shops, top 20 items" />
        <Kpi label="Median selling price" value="₹460" sub="kurtis & tunics" />
      </div>

      <div className={`grid gap-3 px-4 py-3 ${compact ? "grid-cols-1" : "min-h-0 flex-1 grid-cols-[1.15fr_1fr_1fr]"}`}>
        <Card title="Demand index by locality" note="Cotton kurtis · this week">
          <HexMap
            selected={selectedName}
            hover={hoverName}
            onHover={setHoverName}
            onSelect={(n) => setClicked((c) => (c === n ? null : n))}
            privacyHighlight={step === 3}
          />
          <Legend />
        </Card>

        <div className="flex min-h-0 flex-col gap-3">
          <Card title={selected ? selected.name : "Pick a locality"} note={selected ? `${selected.stores} Dukaan shops` : "Click a cell on the map"}>
            {selected ? <LocalityDetail l={selected} animate={step === 2 && !clicked} /> : <EmptyDetail />}
          </Card>
          <Card title="Rising this week" note="vs previous week">
            <ul className="flex flex-col gap-1.5">
              {RISING.map((r) => (
                <li key={r.item} className="flex items-center gap-2 text-[11.5px]">
                  {r.change > 0 ? (
                    <TrendingUp size={14} className="shrink-0 text-emerald-600" />
                  ) : (
                    <TrendingDown size={14} className="shrink-0 text-coral" />
                  )}
                  <span className="flex-1 truncate">{r.item}</span>
                  <span className="w-10 text-right font-semibold">
                    {r.change > 0 ? "+" : "−"}
                    {Math.abs(r.change)}%
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <Card title="Stock-outs" note="shops out of stock now">
            <ul className="flex flex-col gap-1.5">
              {STOCKOUTS.map((s) => (
                <li key={s.item} className="text-[11.5px] leading-tight">
                  <p className="font-medium">{s.item}</p>
                  <p className="text-[10.5px] text-muted">
                    {s.stores} · {s.where}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Price band that sells" note="share of kurti sales, ₹">
            <PriceBands />
          </Card>
        </div>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center gap-2 border-t border-black/5 bg-white px-4 py-2">
        <Badge icon={ShieldCheck} pulse={step === 3}>Opt-in only</Badge>
        <Badge icon={Users} pulse={step === 3}>≥{MIN_STORES} stores per cell</Badge>
        <Badge icon={Wallet} pulse={step === 3}>Data dividend paid to shops</Badge>
        <Badge icon={Lock} pulse={step === 3}>DPDP-ready · no shop-level data</Badge>
        <span className="ml-auto text-[10.5px] text-muted">Illustrative data · Plans ₹15 lakh – ₹2 Cr / year</span>
      </footer>
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border border-black/5 bg-white px-3 py-2">
      <p className="text-[10.5px] text-muted">{label}</p>
      <p className="text-[20px] leading-tight font-bold">{value}</p>
      <p className="text-[10px] text-muted">{sub}</p>
    </div>
  );
}

function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="flex min-h-0 flex-col rounded-lg border border-black/5 bg-white p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="truncate text-[12.5px] font-semibold">{title}</h3>
        {note && <span className="shrink-0 text-[10px] text-muted">{note}</span>}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

function Badge({ icon: Icon, children, pulse }: { icon: typeof Lock; children: React.ReactNode; pulse: boolean }) {
  return (
    <motion.span
      animate={pulse ? { scale: [1, 1.06, 1], backgroundColor: ["#e8f7ef", "#c8efd9", "#e8f7ef"] } : { scale: 1 }}
      transition={pulse ? { duration: 1.4, repeat: 2 } : {}}
      className="flex items-center gap-1.5 rounded-full bg-[#e8f7ef] px-2.5 py-1 text-[11px] font-medium text-emerald-800"
    >
      <Icon size={13} /> {children}
    </motion.span>
  );
}

const R = 40;
const HW = Math.sqrt(3) * R;
const VS = 1.5 * R;

function hexPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join("L")}Z`;
}

function center(l: Locality) {
  return { x: 12 + HW / 2 + l.col * HW + (l.row % 2) * (HW / 2), y: 10 + R + l.row * VS };
}

function HexMap({
  selected,
  hover,
  onHover,
  onSelect,
  privacyHighlight,
}: {
  selected: string | null;
  hover: string | null;
  onHover: (n: string | null) => void;
  onSelect: (n: string) => void;
  privacyHighlight: boolean;
}) {
  const W = 12 * 2 + HW * 4.5;
  const H = 20 + R * 2 + VS * 3;
  const hovered = LOCALITIES.find((l) => l.name === hover);
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full max-w-[400px]" role="img" aria-label="Demand index by Kharagpur locality">
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#f1eef0" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#cfc6cc" strokeWidth="2" />
          </pattern>
        </defs>
        {LOCALITIES.map((l, i) => {
          const { x, y } = center(l);
          const hidden = l.stores < MIN_STORES;
          const sel = selected === l.name;
          return (
            <motion.g
              key={l.name}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i, duration: 0.3 }}
              style={{ transformOrigin: `${x}px ${y}px`, cursor: hidden ? "default" : "pointer" }}
              onMouseEnter={() => onHover(l.name)}
              onMouseLeave={() => onHover(null)}
              onClick={() => !hidden && onSelect(l.name)}
            >
              <path
                d={hexPath(x, y, R - 1.5)}
                fill={hidden ? "url(#hatch)" : demandColor(l.demand)}
                stroke={sel ? "#ff9f00" : hidden && privacyHighlight ? "#10b981" : "#ffffff"}
                strokeWidth={sel ? 3.5 : hidden && privacyHighlight ? 2.5 : 2}
              />
              <text x={x} y={y - 4} textAnchor="middle" fontSize="8.5" fill={hidden ? "#6e5a69" : demandInk(l.demand)}>
                {l.name}
              </text>
              <text x={x} y={y + 10} textAnchor="middle" fontSize="12" fontWeight="700" fill={hidden ? "#6e5a69" : demandInk(l.demand)}>
                {hidden ? "<10 shops" : l.demand}
              </text>
            </motion.g>
          );
        })}
      </svg>
      {hovered && (
        <div className="pointer-events-none absolute top-1 right-1 w-44 rounded-md bg-ink px-2.5 py-1.5 text-[10.5px] leading-snug text-white shadow-lg">
          <p className="font-semibold">{hovered.name}</p>
          {hovered.stores < MIN_STORES ? (
            <p>Hidden: only {hovered.stores} shops. We never show a cell with fewer than {MIN_STORES}.</p>
          ) : (
            <>
              <p>
                Demand index <b>{hovered.demand}</b> · {hovered.change >= 0 ? "+" : ""}
                {hovered.change}% wk
              </p>
              <p>
                {hovered.stores} shops · top: {hovered.topItem}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-1 flex items-center justify-center gap-2 text-[10px] text-muted">
      <span>Low</span>
      <div className="flex">
        {DEMAND_RAMP.map((c) => (
          <span key={c} className="h-2.5 w-7 first:rounded-l last:rounded-r" style={{ background: c }} />
        ))}
      </div>
      <span>High</span>
      <span className="ml-2 flex items-center gap-1">
        <span className="h-2.5 w-4 rounded-sm" style={{ background: "repeating-linear-gradient(45deg,#f1eef0 0 3px,#cfc6cc 3px 5px)" }} />
        hidden (&lt;{MIN_STORES} shops)
      </span>
    </div>
  );
}

function LocalityDetail({ l, animate }: { l: Locality; animate: boolean }) {
  return (
    <motion.div
      key={l.name}
      initial={animate ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animate ? 0.3 : 0 }}
      className="flex flex-col gap-1.5 text-[11.5px]"
    >
      <p className="flex items-center gap-1 text-[10.5px] text-muted">
        <MapPin size={11} /> Top item this week
      </p>
      <p className="text-[14px] leading-tight font-semibold">{l.topItem}</p>
      <div className="grid grid-cols-3 gap-1.5">
        <Mini label="Demand" value={`${l.change >= 0 ? "+" : ""}${l.change}%`} />
        <Mini label="Stock-outs" value={`${l.stockouts} of ${l.stores}`} />
        <Mini label="Sells at" value={`₹${l.band[0]}–${l.band[1]}`} />
      </div>
      <p className="rounded-md bg-orange-soft px-2 py-1 text-[10.5px] leading-snug">
        💡 Supply L-size cotton kurtis at ₹420–480 to Gole Bazaar shops before Durga Puja.
      </p>
    </motion.div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#f7f3f6] px-1.5 py-1">
      <p className="text-[9.5px] text-muted">{label}</p>
      <p className="text-[12px] font-bold">{value}</p>
    </div>
  );
}

function EmptyDetail() {
  return <p className="text-[11px] text-muted">Hover or click a locality to see what sells there, what runs out and at what price.</p>;
}

function PriceBands() {
  const [hover, setHover] = useState<number | null>(null);
  const max = 30;
  return (
    <div className="relative flex h-[92px] items-end gap-[3px] pt-4">
      {PRICE_BANDS.map((b, i) => {
        const peak = b.band === "400" || b.band === "450";
        return (
          <div
            key={b.band}
            className="relative flex h-full flex-1 flex-col items-center justify-end"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            {hover === i && (
              <span className="absolute -top-1 z-10 rounded bg-ink px-1.5 py-0.5 text-[9.5px] whitespace-nowrap text-white">
                ₹{b.band}: {b.share}%
              </span>
            )}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(b.share / max) * 100}%` }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="w-full rounded-t-[4px]"
              style={{ background: peak ? "#ff9f00" : "#570d48", opacity: hover === null || hover === i ? 1 : 0.7 }}
            />
            <span className="mt-0.5 text-[9px] text-muted">{b.band}</span>
          </div>
        );
      })}
    </div>
  );
}
