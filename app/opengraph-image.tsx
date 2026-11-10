import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EliavaTech | Building What's Next.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#060912",
          color: "#EEF1F8",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          backgroundImage:
            "radial-gradient(circle at 82% 20%, rgba(124, 108, 255, 0.30) 0%, transparent 55%), radial-gradient(circle at 18% 85%, rgba(242, 184, 75, 0.15) 0%, transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                padding: "12px",
                borderRadius: "12px",
                backgroundColor: "#0D1322",
                border: "1px solid #222C47",
              }}
            >
              <div style={{ width: "32px", height: "7px", borderRadius: "2px", backgroundColor: "#F2B84B" }} />
              <div style={{ width: "22px", height: "7px", borderRadius: "2px", backgroundColor: "#EEF1F8" }} />
              <div style={{ width: "32px", height: "7px", borderRadius: "2px", backgroundColor: "#EEF1F8" }} />
            </div>
            <div style={{ display: "flex", fontSize: "30px" }}>
              <span style={{ fontWeight: 700, color: "#EEF1F8" }}>Eliava</span>
              <span style={{ fontWeight: 300, color: "#9AA6C3" }}>Tech</span>
            </div>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(124, 108, 255, 0.14)",
              border: "1px solid rgba(124, 108, 255, 0.4)",
              color: "#9A8DFF",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Digital solutions for growing businesses
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "960px" }}>
          <div style={{ fontSize: "64px", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Building What&apos;s Next.
          </div>
          <div style={{ fontSize: "26px", lineHeight: 1.45, color: "#9AA6C3" }}>
            Websites, software and AI automation that help growing businesses operate smarter.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #222C47",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#9AA6C3",
          }}
        >
          <span>Websites. Automation. Software. Support.</span>
          <span style={{ color: "#F2B84B", fontWeight: 600 }}>eliavatech.com</span>
        </div>
      </div>
    ),
    size
  );
}
