import { useId } from "react";
import type { ProductArtSpec } from "@/data/products";

/**
 * Flat product illustrations used until real shop photos are added.
 * Drop a photo at /public/products/<id>.jpg and set `photo` on the product to replace one.
 */
export function ProductArt({
  art,
  photo,
  className = "",
  rounded = "rounded-lg",
}: {
  art: ProductArtSpec;
  photo?: string;
  className?: string;
  rounded?: string;
}) {
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt="" className={`h-full w-full object-cover ${rounded} ${className}`} />;
  }
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${rounded} ${className}`}
      style={{ background: art.bg ?? tint(art.color) }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <Shape art={art} />
      </svg>
    </div>
  );
}

function Shape({ art }: { art: ProductArtSpec }) {
  const uid = useId().replace(/:/g, "");
  const pid = `p${uid}`;
  const { color, accent = "#ffffff" } = art;
  const fill = art.pattern && art.pattern !== "plain" && art.pattern !== "border" ? `url(#${pid})` : color;
  const stroke = shade(color, -0.25);

  const defs = (
    <defs>
      <pattern id={pid} width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill={color} />
        {art.pattern === "print" && (
          <>
            <circle cx="3" cy="3" r="1.4" fill={accent} opacity=".85" />
            <circle cx="8" cy="8" r="1.1" fill={accent} opacity=".6" />
          </>
        )}
        {art.pattern === "check" && (
          <>
            <rect x="0" y="0" width="10" height="2.2" fill={accent} opacity=".45" />
            <rect x="0" y="0" width="2.2" height="10" fill={accent} opacity=".45" />
          </>
        )}
        {art.pattern === "stripe" && <rect x="0" y="0" width="3" height="10" fill={accent} opacity=".5" />}
        {art.pattern === "floral" && (
          <g fill={accent} opacity=".8">
            <circle cx="5" cy="3.2" r="1" />
            <circle cx="3.2" cy="5" r="1" />
            <circle cx="6.8" cy="5" r="1" />
            <circle cx="5" cy="6.8" r="1" />
          </g>
        )}
      </pattern>
    </defs>
  );

  switch (art.shape) {
    case "kurti":
      return (
        <g>
          {defs}
          <path
            d="M39 14 Q50 23 61 14 L75 18 L88 41 L80 45 L71 33 L72 88 Q50 92 28 88 L29 33 L20 45 L12 41 L25 18 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <path d="M44 16 L50 30 L56 16" fill="none" stroke={accent} strokeWidth="1.6" />
          <line x1="50" y1="30" x2="50" y2="44" stroke={accent} strokeWidth="1" strokeDasharray="1.5 2.5" />
          {(art.pattern === "border" || art.trim) && (
            <path d="M28.4 82 Q50 86 71.6 82 L72 88 Q50 92 28 88 Z" fill={art.trim ?? accent} />
          )}
          <path d="M29 70 L26 89 M71 70 L74 89" stroke={stroke} strokeWidth=".8" opacity=".5" />
        </g>
      );
    case "kurta":
      return (
        <g>
          {defs}
          <path
            d="M40 13 L60 13 L75 17 L90 58 L82 61 L71 34 L72 90 L28 90 L29 34 L18 61 L10 58 L25 17 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <rect x="44" y="11" width="12" height="5" rx="1.5" fill={shade(color, -0.12)} />
          <line x1="50" y1="16" x2="50" y2="44" stroke={stroke} strokeWidth="1" />
          {[22, 30, 38].map((y) => (
            <circle key={y} cx="50" cy={y} r="1.3" fill={accent} />
          ))}
        </g>
      );
    case "saree":
      return (
        <g>
          {defs}
          <rect x="12" y="30" width="76" height="46" rx="4" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <rect x="12" y="66" width="76" height="10" rx="2" fill={art.trim ?? accent} />
          <rect x="12" y="66" width="76" height="2" fill={shade(art.trim ?? accent, -0.2)} />
          <path d="M58 30 L88 30 L88 60 Z" fill={shade(color, -0.15)} opacity=".9" />
          <path d="M66 30 L88 30 L88 52 Z" fill={art.trim ?? accent} opacity=".9" />
          <rect x="16" y="24" width="68" height="8" rx="3" fill={shade(color, 0.12)} stroke={stroke} strokeWidth=".8" />
        </g>
      );
    case "frock":
      return (
        <g>
          {defs}
          <path
            d="M40 16 Q50 23 60 16 L67 18 L76 27 L69 33 L64 29 L64 44 L81 84 Q50 93 19 84 L36 44 L36 29 L31 33 L24 27 L33 18 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <rect x="35" y="42" width="30" height="5" rx="2" fill={accent} />
          <path d="M22 80 Q50 89 78 80" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="3 2" />
        </g>
      );
    case "lehenga":
      return (
        <g>
          {defs}
          <path d="M38 14 Q50 20 62 14 L64 30 L36 30 Z" fill={shade(color, -0.1)} stroke={stroke} strokeWidth="1" />
          <path d="M36 34 L64 34 L86 88 Q50 95 14 88 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <path d="M16 82 Q50 90 84 82 L86 88 Q50 95 14 88 Z" fill={art.trim ?? accent} />
          <rect x="35" y="32" width="30" height="4" rx="1.5" fill={art.trim ?? accent} />
        </g>
      );
    case "shirt":
      return (
        <g>
          {defs}
          <path
            d="M38 15 L50 22 L62 15 L78 21 L88 40 L78 45 L72 36 L72 88 L28 88 L28 36 L22 45 L12 40 L22 21 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <path d="M38 15 L50 22 L44 30 Z M62 15 L50 22 L56 30 Z" fill={shade(color, 0.15)} stroke={stroke} strokeWidth=".8" />
          <line x1="50" y1="22" x2="50" y2="88" stroke={stroke} strokeWidth=".9" />
          {[36, 48, 60, 72].map((y) => (
            <circle key={y} cx="50" cy={y} r="1.2" fill="#fff" />
          ))}
        </g>
      );
    case "dupatta":
      return (
        <g>
          {defs}
          <path
            d="M14 26 Q34 16 54 28 T88 30 L86 70 Q66 62 46 72 T12 70 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <path d="M14 26 L12 70" stroke={art.trim ?? accent} strokeWidth="4" />
          <path d="M88 30 L86 70" stroke={art.trim ?? accent} strokeWidth="4" />
          {[30, 38, 46, 54, 62].map((y) => (
            <g key={y}>
              <line x1="10" y1={y} x2="5" y2={y + 2} stroke={art.trim ?? accent} strokeWidth="1.4" />
              <line x1="90" y1={y + 2} x2="95" y2={y + 4} stroke={art.trim ?? accent} strokeWidth="1.4" />
            </g>
          ))}
        </g>
      );
    case "bag":
      return (
        <g>
          {defs}
          <path d="M40 18 Q50 8 60 18" fill="none" stroke={stroke} strokeWidth="3" />
          <rect x="24" y="18" width="52" height="68" rx="12" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <rect x="32" y="50" width="36" height="28" rx="6" fill={shade(color, -0.12)} stroke={stroke} strokeWidth="1" />
          <line x1="32" y1="58" x2="68" y2="58" stroke={accent} strokeWidth="1.4" strokeDasharray="2 1.5" />
          <rect x="30" y="26" width="40" height="5" rx="2.5" fill={accent} opacity=".9" />
        </g>
      );
    case "chappal":
      return (
        <g>
          {defs}
          {[30, 70].map((cx, i) => (
            <g key={cx} transform={`rotate(${i ? 8 : -8} ${cx} 52)`}>
              <ellipse cx={cx} cy="52" rx="15" ry="36" fill={shade(color, 0.1)} stroke={stroke} strokeWidth="1.2" />
              <path
                d={`M${cx - 14} 44 Q${cx} 30 ${cx + 14} 44`}
                fill="none"
                stroke={accent}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx={cx} cy="36" r="3" fill={art.trim ?? accent} />
            </g>
          ))}
        </g>
      );
    case "bangles":
      return (
        <g>
          {defs}
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse
              key={i}
              cx="50"
              cy={36 + i * 7}
              rx="30"
              ry="11"
              fill="none"
              stroke={i % 2 ? accent : color}
              strokeWidth="5"
            />
          ))}
        </g>
      );
    case "thali":
      return (
        <g>
          {defs}
          <circle cx="50" cy="52" r="38" fill={color} stroke={stroke} strokeWidth="1.5" />
          <circle cx="50" cy="52" r="31" fill="none" stroke={shade(color, -0.2)} strokeWidth="1" strokeDasharray="2 2" />
          <path d="M42 50 Q50 40 58 50 Q50 58 42 50 Z" fill="#c0791b" />
          <path d="M50 30 Q54 38 50 42 Q46 38 50 30 Z" fill="#ff9f00" />
          <circle cx="33" cy="62" r="6" fill="#d94040" />
          <circle cx="67" cy="62" r="6" fill="#f2c94c" />
          <circle cx="50" cy="72" r="5" fill="#f2f2f2" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle
              key={a}
              cx={50 + 26 * Math.cos((a * Math.PI) / 180)}
              cy={52 + 26 * Math.sin((a * Math.PI) / 180)}
              r="2"
              fill="#ff7a1a"
            />
          ))}
        </g>
      );
  }
}

/** Lighten or darken a hex colour by a fraction (-1..1). */
export function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => {
    const out = amt < 0 ? v * (1 + amt) : v + (255 - v) * amt;
    return Math.max(0, Math.min(255, Math.round(out)));
  };
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function tint(hex: string) {
  return shade(hex, 0.86);
}
