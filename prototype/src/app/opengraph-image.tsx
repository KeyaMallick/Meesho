import { ImageResponse } from "next/og";

export const alt = "Meesho Dukaan: online in one visit, run entirely from WhatsApp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px 80px",
          background: "#570d48",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700 }}>meesho</div>
        <div style={{ fontSize: 120, fontWeight: 900, color: "#ff9f00", lineHeight: 1, letterSpacing: 4 }}>DUKAAN</div>
        <div style={{ width: 120, height: 10, borderRadius: 6, background: "#f2475b", margin: "36px 0" }} />
        <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.15 }}>Online in one visit.</div>
        <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.15, color: "#ff9f00" }}>Run entirely from WhatsApp.</div>
        <div style={{ fontSize: 26, marginTop: 30, color: "#f1d9ea" }}>
          Prototype · Team 505, IIT Kharagpur · Meesho DICE Challenge 3.0
        </div>
      </div>
    ),
    size,
  );
}
