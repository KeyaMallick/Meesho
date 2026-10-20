"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, BadgeCheck, Camera, EllipsisVertical, Mic, Paperclip, Phone, Search, Smile, Store, Video } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Msg } from "@/story/types";
import { MessageView, type MsgActions } from "./Messages";

type Props = {
  view?: "list" | "chat";
  messages: Msg[];
  /** Messages at or after this index animate in one by one. */
  animateFrom?: number;
  showTranslation?: boolean;
  /** Typing indicator controlled by the parent (Try page); a string shows a status line. */
  typing?: boolean | string;
  footer?: ReactNode;
  actions?: MsgActions;
  newChatHighlight?: boolean;
};

export function WhatsAppScreen({
  view = "chat",
  messages,
  animateFrom,
  showTranslation = true,
  typing: externalTyping,
  footer,
  actions,
  newChatHighlight,
}: Props) {
  const [shown, setShown] = useState(messages.length);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const from = animateFrom ?? messages.length;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    if (from >= messages.length) {
      at(0, () => {
        setShown(messages.length);
        setTyping(false);
      });
    } else {
      at(0, () => setShown(from));
      let t = 120;
      for (let k = from; k < messages.length; k++) {
        const m = messages[k];
        const bot = m.t !== "date" && m.from === "bot";
        if (bot) {
          at(t, () => setTyping(true));
          t += 750;
        } else {
          t += m.t === "date" ? 60 : 280;
        }
        at(t, () => {
          setTyping(false);
          setShown(k + 1);
        });
        t += 380;
      }
    }
    return () => timers.forEach(clearTimeout);
  }, [messages, animateFrom]);

  const isTyping = typing || !!externalTyping;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }));
    return () => cancelAnimationFrame(id);
  }, [shown, isTyping, messages]);

  if (view === "list") return <ChatList highlight={newChatHighlight} />;

  return (
    <div className="flex h-full flex-col bg-wa-bg">
      <ChatHeader />
      <div ref={scrollRef} className="wa-wallpaper hide-scrollbar flex-1 overflow-y-auto py-2">
        <div className="mx-auto mb-2 w-[88%] rounded-md bg-[#fff5c4] px-2 py-1 text-center text-[10.5px] leading-snug text-[#54656f]">
          🔒 Illustrative chat · Meesho Dukaan prototype
        </div>
        <div className="flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {messages.slice(0, shown).map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <MessageView m={m} ctx={{ showTranslation, actions }} />
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && <TypingBubble status={typeof externalTyping === "string" ? externalTyping : undefined} />}
        </div>
      </div>
      {footer ?? <StaticFooter />}
    </div>
  );
}

function ChatHeader() {
  return (
    <div className="flex shrink-0 items-center gap-2 bg-wa-header px-2 py-2 text-white">
      <ArrowLeft size={19} />
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-plum">
        <Store size={16} className="text-orange" />
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="flex items-center gap-1 text-[14px] font-semibold">
          Meesho Dukaan <BadgeCheck size={14} className="fill-wa-green text-wa-header" />
        </p>
        <p className="text-[10.5px] text-white/80">business account · online</p>
      </div>
      <Video size={18} />
      <Phone size={16} />
      <EllipsisVertical size={18} />
    </div>
  );
}

function TypingBubble({ status }: { status?: string }) {
  return (
    <div className="flex px-2.5">
      <div className="flex items-center gap-2 rounded-lg rounded-tl-none bg-white px-3 py-2 shadow-sm">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#8696a0]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </span>
        {status && <span className="text-[11.5px] text-wa-meta">{status}</span>}
      </div>
    </div>
  );
}

function StaticFooter() {
  return (
    <div className="flex shrink-0 items-center gap-1.5 bg-wa-bg px-1.5 py-1.5">
      <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-2 text-[#8696a0]">
        <Smile size={18} />
        <span className="flex-1 text-[13px]">Message</span>
        <Paperclip size={17} />
        <Camera size={17} />
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wa-header text-white">
        <Mic size={18} />
      </div>
    </div>
  );
}

const CHATS = [
  { name: "Meesho Dukaan", msg: "नमस्ते रमेश जी! आपकी दुकान अब ऑनलाइन है", time: "11:36", unread: 2, dukaan: true },
  { name: "Suresh Wholesale (Kolkata)", msg: "Naya maal Monday ko aayega bhai", time: "10:52", unread: 1 },
  { name: "Gole Bazaar Vyapari Sangh", msg: "Bijli 2 baje tak nahi rahegi", time: "10:15" },
  { name: "Ghar 🏠", msg: "Photo", time: "9:41" },
  { name: "Bittu (beta)", msg: "Papa school fees ka kya hua?", time: "Yesterday" },
  { name: "Customer Mausi ji", msg: "Wo peeli saree aayi kya?", time: "Yesterday" },
  { name: "Ravi Tailor", msg: "Blouse kal tak ready", time: "Sat" },
];

function ChatList({ highlight }: { highlight?: boolean }) {
  const chats = highlight ? CHATS : CHATS.slice(1);
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between px-3 pt-2 pb-1">
        <span className="text-[20px] font-semibold text-wa-header">WhatsApp</span>
        <div className="flex gap-3 text-[#54656f]">
          <Camera size={18} />
          <EllipsisVertical size={18} />
        </div>
      </div>
      <div className="mx-3 my-1.5 flex items-center gap-2 rounded-full bg-[#f0f2f5] px-3 py-1.5 text-[12.5px] text-[#8696a0]">
        <Search size={15} /> Ask Meta AI or Search
      </div>
      <div className="flex gap-1.5 px-3 pb-1">
        {["All", "Unread", "Groups"].map((c, i) => (
          <span
            key={c}
            className={`rounded-full px-2.5 py-0.5 text-[11.5px] ${i === 0 ? "bg-[#d9fdd3] text-[#0a6b4f]" : "bg-[#f0f2f5] text-[#54656f]"}`}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {chats.map((c) => (
          <motion.div
            key={c.name}
            layout
            initial={c.dukaan ? { opacity: 0, backgroundColor: "#fff1d6" } : false}
            animate={{ opacity: 1, backgroundColor: c.dukaan ? "#fff8e8" : "#ffffff" }}
            className="flex items-center gap-2.5 px-3 py-2"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${c.dukaan ? "bg-plum" : "bg-[#dfe5e7]"}`}
            >
              {c.dukaan ? (
                <Store size={18} className="text-orange" />
              ) : (
                <span className="text-[14px] font-semibold text-[#54656f]">{c.name[0]}</span>
              )}
            </div>
            <div className="min-w-0 flex-1 border-b border-black/5 pb-2">
              <div className="flex justify-between">
                <span className="flex items-center gap-1 truncate text-[13.5px] font-medium text-wa-text">
                  {c.name}
                  {c.dukaan && <BadgeCheck size={13} className="fill-wa-green text-white" />}
                </span>
                <span className={`text-[10.5px] ${c.unread ? "text-wa-green" : "text-wa-meta"}`}>{c.time}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="truncate text-[12px] text-wa-meta">{c.msg}</span>
                {c.unread && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-wa-green px-1 text-[10px] font-semibold text-white">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
