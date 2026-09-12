import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} Open Graph image`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const portrait = await readFile(path.join(process.cwd(), "public", "mc.png"), "base64");
  const portraitSrc = `data:image/png;base64,${portrait}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #09090b 0%, #18181b 55%, #27272a 100%)",
          color: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "56px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "72%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 26,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#a1a1aa",
              }}
            >
              Frontend Blog
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 72,
                  lineHeight: 1.04,
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  maxWidth: "92%",
                }}
              >
                {siteConfig.name}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  lineHeight: 1.35,
                  color: "#d4d4d8",
                  maxWidth: "88%",
                }}
              >
                {siteConfig.description}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: 24,
                color: "#d4d4d8",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "12px",
                  height: "12px",
                  borderRadius: "9999px",
                  backgroundColor: "#f4f4f5",
                }}
              />
              Matteo Collina
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28%",
            }}
          >
            <img
              src={portraitSrc}
              alt="Matteo Collina"
              width={220}
              height={220}
              style={{
                borderRadius: "32px",
                border: "2px solid rgba(255,255,255,0.12)",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
