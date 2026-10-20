import { BatteryFull, SignalHigh, Wifi } from "lucide-react";
import type { ReactNode } from "react";

export function PhoneFrame({
  children,
  time,
  width,
  height,
  dark = false,
}: {
  children: ReactNode;
  time: string;
  width: number;
  height: number;
  /** Status bar on a dark (green WhatsApp / plum) header */
  dark?: boolean;
}) {
  return (
    <div
      className="relative rounded-[42px] bg-[#1d1a1c] p-[10px] shadow-[0_30px_60px_-20px_rgba(42,20,38,.45),0_0_0_1.5px_#3a3438_inset]"
      style={{ width, height }}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[33px] bg-white">
        <StatusBar time={time} dark={dark} />
        <div className="relative min-h-0 flex-1">{children}</div>
        <div className="flex h-4 shrink-0 items-center justify-center bg-white">
          <span className="h-1 w-24 rounded-full bg-black/80" />
        </div>
      </div>
      <span className="absolute top-[18px] left-1/2 h-[18px] w-[76px] -translate-x-1/2 rounded-full bg-black" />
    </div>
  );
}

function StatusBar({ time, dark }: { time: string; dark: boolean }) {
  return (
    <div
      className={`flex h-7 shrink-0 items-center justify-between px-6 pt-1 text-[11.5px] font-semibold ${
        dark ? "bg-wa-header text-white" : "bg-white text-black"
      }`}
    >
      <span>{time}</span>
      <span className="flex items-center gap-1">
        <SignalHigh size={13} />
        <Wifi size={13} />
        <BatteryFull size={15} />
      </span>
    </div>
  );
}

export function LaptopFrame({
  children,
  width,
  height,
  url = "insights.meesho-dukaan.example · illustrative",
}: {
  children: ReactNode;
  width: number;
  height: number;
  url?: string;
}) {
  return (
    <div className="flex flex-col items-center" style={{ width }}>
      <div
        className="w-full rounded-t-[18px] bg-[#1d1a1c] p-3 pb-4 shadow-[0_30px_60px_-24px_rgba(42,20,38,.45)]"
        style={{ height }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-white">
          <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-black/5 bg-[#f4f1f3] px-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 flex-1 rounded bg-white px-2 py-0.5 text-[10.5px] text-muted">
              {url}
            </span>
          </div>
          <div className="min-h-0 flex-1">{children}</div>
        </div>
      </div>
      <div className="h-3 w-[108%] rounded-b-xl bg-gradient-to-b from-[#cfc7cc] to-[#a79fa5]" />
    </div>
  );
}
