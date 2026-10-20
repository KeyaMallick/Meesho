"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, BadgeCheck, Check, Heart, MapPin, Search, ShoppingCart, Store, Truck } from "lucide-react";
import { ProductArt } from "@/components/art/ProductArt";
import { HERO, SHOP_ITEMS, type Product } from "@/data/products";
import type { Screen, World } from "@/story/types";

type BuyerScreen = Extract<Screen, { kind: "buyer" }>;

export function BuyerApp({ screen, world, animateIn }: { screen: BuyerScreen; world: World; animateIn: boolean }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={screen.view === "ordered" ? "product" : screen.view}
          className="flex h-full flex-col"
          initial={animateIn ? { opacity: 0, x: 24 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {screen.view === "store" && <Storefront world={world} highlight={screen.highlight} animateIn={animateIn} />}
          {screen.view === "nearby" && <Nearby />}
          {(screen.view === "product" || screen.view === "ordered") && (
            <ProductPage product={HERO} ordered={screen.view === "ordered"} animateIn={animateIn} stock={world.heroStock} />
          )}
          {screen.view === "tracking" && <Tracking />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MktHeader({ back, title }: { back?: boolean; title?: string }) {
  return (
    <div className="shrink-0 bg-white px-3 pt-1.5 pb-2 shadow-[0_1px_0_rgba(0,0,0,.06)]">
      <div className="flex items-center gap-2">
        {back && <ArrowLeft size={18} className="text-ink" />}
        {title ? (
          <span className="flex-1 truncate text-[14px] font-semibold text-ink">{title}</span>
        ) : (
          <span className="flex-1 text-[19px] font-extrabold lowercase tracking-tight text-mkt">meesho</span>
        )}
        <Heart size={18} className="text-ink" />
        <ShoppingCart size={18} className="text-ink" />
      </div>
      {!back && (
        <div className="mt-1.5 flex items-center gap-2 rounded-md border border-black/10 px-2.5 py-1.5 text-[12px] text-muted">
          <Search size={14} /> Search kurtis, sarees, shops…
        </div>
      )}
    </div>
  );
}

function Storefront({ world, highlight, animateIn }: { world: World; highlight?: string; animateIn: boolean }) {
  const items: Product[] = SHOP_ITEMS.slice(0, world.listed);
  if (world.heroLive) items.unshift(HERO);
  return (
    <>
      <MktHeader back title="Ramesh Garments" />
      <div className="hide-scrollbar flex-1 overflow-y-auto">
        <div className="bg-gradient-to-br from-plum to-[#8a1f72] px-3 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <Store size={20} className="text-plum" />
            </div>
            <div className="leading-tight">
              <p className="flex items-center gap-1 text-[14px] font-semibold">
                Ramesh Garments <BadgeCheck size={14} className="text-orange" />
              </p>
              <p className="flex items-center gap-1 text-[10.5px] text-white/80">
                <MapPin size={10} /> Gole Bazaar, Kharagpur · Local shop
              </p>
            </div>
          </div>
          <div className="mt-2 flex gap-1.5 text-[10px]">
            <span className="rounded-full bg-orange px-2 py-0.5 font-semibold text-plum">New local shop</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5">2-day delivery</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5">{items.length} items</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-3">
            <p className="mb-2 text-center text-[11.5px] text-muted">Shop not live yet</p>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-md bg-[#f1ecf0]" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 p-2">
            <AnimatePresence initial={false}>
              {items.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={animateIn ? { opacity: 0, scale: 0.85 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: animateIn && p.id !== HERO.id ? Math.min(i, 8) * 0.06 : animateIn ? 0.9 : 0 }}
                  className={`overflow-hidden rounded-md border ${
                    highlight === p.id ? "border-orange ring-2 ring-orange/60" : "border-black/5"
                  }`}
                >
                  <div className="relative h-28">
                    <ProductArt art={p.art} photo={p.photo} rounded="rounded-none" />
                    {p.id === HERO.id && (
                      <span className="absolute top-1 left-1 rounded bg-coral px-1.5 py-0.5 text-[9px] font-bold text-white">NEW</span>
                    )}
                    {p.id === HERO.id && world.heroStock <= 4 && (
                      <motion.span
                        key={world.heroStock}
                        initial={animateIn ? { scale: 1.4, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute right-1 bottom-1 rounded bg-white/95 px-1.5 py-0.5 text-[9px] font-bold text-coral"
                      >
                        Only {world.heroStock} left
                      </motion.span>
                    )}
                  </div>
                  <div className="p-1.5">
                    <p className="truncate text-[11px] text-ink">{p.title}</p>
                    <p className="text-[13px] font-bold text-ink">₹{p.price}</p>
                    <p className="text-[9.5px] text-emerald-700">Free delivery</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}

function Nearby() {
  const shops = [
    { name: "Ramesh Garments", area: "Gole Bazaar", km: "3.2", items: 21, tag: "New", hl: true, art: HERO.art },
    { name: "Laxmi Saree Centre", area: "Malancha", km: "4.0", items: 46, tag: "4.3★", art: SHOP_ITEMS[1].art },
    { name: "Bose Footwear", area: "Inda", km: "2.1", items: 33, tag: "4.1★", art: SHOP_ITEMS[14].art },
  ];
  return (
    <>
      <MktHeader />
      <div className="hide-scrollbar flex-1 overflow-y-auto">
        <div className="flex items-center gap-1 px-3 pt-2 text-[11px] text-muted">
          <MapPin size={11} className="text-mkt" /> Delivering to <b className="text-ink">Priya · Hijli, Kharagpur</b>
        </div>
        <div className="flex gap-2 overflow-hidden px-3 py-2">
          {["Kurtis", "Sarees", "Kids", "Men", "Footwear"].map((c) => (
            <span key={c} className="shrink-0 rounded-full bg-mkt-soft px-2.5 py-1 text-[10.5px] font-medium text-mkt">
              {c}
            </span>
          ))}
        </div>
        <div className="px-3">
          <p className="text-[13px] font-semibold text-ink">Shops near you</p>
          <p className="text-[10.5px] text-muted">Local shops · 2-day delivery by Valmo</p>
        </div>
        <div className="flex flex-col gap-2 p-3">
          {shops.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className={`flex items-center gap-2.5 rounded-lg border p-2 ${s.hl ? "border-orange bg-orange-soft/50 ring-2 ring-orange/40" : "border-black/5"}`}
            >
              <div className="h-14 w-14 shrink-0">
                <ProductArt art={s.art} rounded="rounded-md" />
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="flex items-center gap-1 text-[12.5px] font-semibold text-ink">
                  {s.name} {s.hl && <BadgeCheck size={13} className="text-mkt" />}
                </p>
                <p className="text-[10.5px] text-muted">
                  {s.area} · {s.km} km · {s.items} items
                </p>
                <span
                  className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9.5px] font-semibold ${
                    s.hl ? "bg-coral text-white" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {s.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

function ProductPage({
  product,
  ordered,
  animateIn,
  stock,
}: {
  product: Product;
  ordered: boolean;
  animateIn: boolean;
  stock: number;
}) {
  return (
    <div className="relative flex h-full flex-col">
      <MktHeader back title={product.title} />
      <div className="hide-scrollbar flex-1 overflow-y-auto">
        <div className="h-52">
          <ProductArt art={product.art} photo={product.photo} rounded="rounded-none" />
        </div>
        <div className="p-3">
          <p className="text-[13px] text-ink">{product.title}</p>
          <p className="text-[20px] font-bold text-ink">₹{product.price}</p>
          <p className="text-[10.5px] text-emerald-700">Free delivery · same price as any Meesho listing</p>
          <div className="mt-2 flex gap-1.5">
            {product.sizes.map((s, i) => (
              <span
                key={s}
                className={`rounded-full border px-3 py-0.5 text-[11.5px] ${i === 0 ? "border-mkt bg-mkt-soft font-semibold text-mkt" : "border-black/15"}`}
              >
                {s}
              </span>
            ))}
            <span className="self-center text-[10px] text-coral">{stock} left</span>
          </div>
          <div className="mt-2.5 rounded-md bg-[#f7f3f6] p-2 text-[11px] leading-snug">
            <p className="flex items-center gap-1 font-semibold text-ink">
              <Store size={12} /> Sold by Ramesh Garments
            </p>
            <p className="text-muted">Gole Bazaar · 3.2 km from you</p>
            <p className="mt-1 flex items-center gap-1 text-ink">
              <Truck size={12} /> Delivered by Valmo in 2 days
            </p>
          </div>
        </div>
      </div>
      <div className="shrink-0 border-t border-black/5 p-2">
        <div className="rounded-md bg-mkt py-2 text-center text-[13px] font-semibold text-white">Buy now</div>
      </div>
      <AnimatePresence>
        {ordered && (
          <motion.div
            initial={animateIn ? { y: "100%" } : false}
            animate={{ y: 0 }}
            transition={{ delay: animateIn ? 0.5 : 0, type: "spring", damping: 24, stiffness: 220 }}
            className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 shadow-[0_-10px_30px_rgba(0,0,0,.15)]"
          >
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check size={24} strokeWidth={3} />
            </div>
            <p className="text-center text-[15px] font-semibold text-ink">Order placed!</p>
            <p className="text-center text-[11.5px] text-muted">Blue Cotton Kurti · M · ₹450</p>
            <p className="mt-1 text-center text-[11px] text-ink">Arriving Sunday · from Ramesh Garments</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tracking() {
  const steps = [
    { t: "Ordered", s: "Fri 3:58 PM" },
    { t: "Packed by Ramesh Garments", s: "Fri 4:20 PM" },
    { t: "Picked up by Valmo", s: "Sat 11:04 AM" },
    { t: "Delivered", s: "Sun 11:10 AM" },
  ];
  return (
    <>
      <MktHeader back title="Order details" />
      <div className="flex-1 p-3">
        <div className="flex gap-2 rounded-lg border border-black/5 p-2">
          <div className="h-14 w-12 shrink-0">
            <ProductArt art={HERO.art} rounded="rounded" />
          </div>
          <div className="text-[11.5px] leading-snug">
            <p className="font-semibold text-ink">Blue Cotton Kurti · M</p>
            <p className="text-muted">₹450 · Ramesh Garments</p>
          </div>
        </div>
        <ol className="mt-3 ml-2">
          {steps.map((s, i) => (
            <motion.li
              key={s.t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.25 }}
              className="relative flex gap-3 pb-4 last:pb-0"
            >
              {i < steps.length - 1 && <span className="absolute top-5 left-[9px] h-full w-0.5 bg-emerald-400" />}
              <span className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={11} strokeWidth={3} />
              </span>
              <div className="leading-tight">
                <p className="text-[12px] font-semibold text-ink">{s.t}</p>
                <p className="text-[10.5px] text-muted">{s.s}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <div className="mt-3 rounded-md bg-emerald-50 p-2 text-center text-[11px] text-emerald-800">
          Rate your local shop ★★★★★
        </div>
      </div>
    </>
  );
}
