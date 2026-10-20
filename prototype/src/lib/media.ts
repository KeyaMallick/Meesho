"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Photo = { src: string; base64: string; mediaType: "image/jpeg" | "image/png" };

/** Resize an uploaded photo in the browser to ≤1024px JPEG so uploads stay small and fast. */
export async function resizeImage(file: File, max = 1024): Promise<Photo> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    return drawToJpeg(img, img.naturalWidth, img.naturalHeight, max);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Turn an on-screen SVG (sample product art) into a JPEG the model can look at. */
export async function svgToPhoto(svg: SVGSVGElement, background: string, size = 640): Promise<Photo> {
  const xml = new XMLSerializer().serializeToString(svg);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  const img = await loadImage(url);
  return drawToJpeg(img, size, size, size, background);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = src;
  });
}

function drawToJpeg(img: HTMLImageElement, w: number, h: number, max: number, background = "#ffffff"): Photo {
  const scale = Math.min(1, max / Math.max(w, h));
  const cw = Math.round(w * scale);
  const ch = Math.round(h * scale);
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, 0, 0, cw, ch);
  const src = canvas.toDataURL("image/jpeg", 0.85);
  return { src, base64: src.split(",")[1], mediaType: "image/jpeg" };
}

/* ---------- Speech recognition (Chrome / Edge) ---------- */

type Rec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getRecognition(): (new () => Rec) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Rec | null>(null);
  const finalRef = useRef("");
  const doneRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setSupported(!!getRecognition()), 0);
    return () => clearTimeout(id);
  }, []);

  const start = useCallback((lang: string) => {
    const R = getRecognition();
    if (!R) return false;
    recRef.current?.abort();
    const rec = new R();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = true;
    finalRef.current = "";
    setInterim("");
    setError(null);
    rec.onresult = (e) => {
      let text = "";
      let fin = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) fin += r[0].transcript;
        else text += r[0].transcript;
      }
      finalRef.current = fin;
      setInterim((fin + " " + text).trim());
    };
    rec.onerror = (e) => {
      if (e.error !== "aborted" && e.error !== "no-speech") setError(e.error);
    };
    rec.onend = () => {
      setListening(false);
      const cb = doneRef.current;
      doneRef.current = null;
      cb?.(finalRef.current.trim() || "");
    };
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  /** Stop listening; `onDone` gets the final transcript (falls back to the last interim text). */
  const stop = useCallback(
    (onDone: (text: string) => void) => {
      const rec = recRef.current;
      if (!rec) return onDone("");
      const lastInterim = interim;
      doneRef.current = (text) => onDone(text || lastInterim);
      rec.stop();
    },
    [interim],
  );

  const cancel = useCallback(() => {
    doneRef.current = null;
    recRef.current?.abort();
    setListening(false);
    setInterim("");
  }, []);

  return { supported, listening, interim, error, start, stop, cancel };
}
