import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

/**
 * Section 9 — Dynamic Open Graph Image Route (`/og?title=...&subtitle=...&tag=...`)
 * Built with `next/og` matching EliavaTech's deep ink (#060912), indigo (#7C6CFF),
 * and gold (#F2B84B) brand tokens and 3-bar stepped E monogram.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title =
    searchParams.get("title") || "EliavaTech | Building What's Next.";
  const subtitle =
    searchParams.get("subtitle") ||
    "Websites, software and AI automation that help growing businesses operate smarter.";
  const tag =
    searchParams.get("tag") || "Digital solutions for growing businesses";

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
            "radial-gradient(circle at 85% 18%, rgba(124, 108, 255, 0.28) 0%, transparent 55%), radial-gradient(circle at 15% 88%, rgba(242, 184, 75, 0.14) 0%, transparent 45%)",
        }}
      >
        {/* Top Row: Monogram + Wordmark + Tag Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
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
              <div
                style={{
                  width: "32px",
                  height: "7px",
                  borderRadius: "2px",
                  backgroundColor: "#F2B84B",
                }}
              />
              <div
                style={{
                  width: "22px",
                  height: "7px",
                  borderRadius: "2px",
                  backgroundColor: "#EEF1F8",
                }}
              />
              <div
                style={{
                  width: "32px",
                  height: "7px",
                  borderRadius: "2px",
                  backgroundColor: "#EEF1F8",
                }}
              />
            </div>

            <div style={{ display: "flex", fontSize: "30px", letterSpacing: "0.02em" }}>
              <span style={{ fontWeight: 700, color: "#EEF1F8" }}>Eliava</span>
              <span style={{ fontWeight: 300, color: "#9AA6C3" }}>Tech</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(124, 108, 255, 0.14)",
              border: "1px solid rgba(124, 108, 255, 0.4)",
              color: "#9A8DFF",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            {tag.slice(0, 48)}
          </div>
        </div>

        {/* Center Title & Subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 52 ? "50px" : "60px",
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: "#EEF1F8",
            }}
          >
            {title.slice(0, 95)}
          </div>
          <div
            style={{
              fontSize: "24px",
              lineHeight: 1.45,
              color: "#9AA6C3",
              maxWidth: "880px",
            }}
          >
            {subtitle.slice(0, 150)}
          </div>
        </div>

        {/* Bottom Trust Strip */}
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
          <span style={{ color: "#F2B84B", fontWeight: 600 }}>
            Building What&apos;s Next.
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
