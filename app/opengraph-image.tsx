import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} Open Graph image`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0c1830",
          color: "#ffffff",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "60px 68px",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 23,
                fontWeight: 800,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#70e6a9",
              }}
            >
              Notizie · Analisi · Consigli
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
                  fontSize: 92,
                  lineHeight: 1,
                  fontWeight: 900,
                  letterSpacing: "-0.06em",
                  textTransform: "uppercase",
                  maxWidth: "92%",
                }}
              >
                FANTAKALCIO.IT
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  lineHeight: 1.35,
                  color: "#c6cfdd",
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
                fontSize: 22,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#0b8f55",
                }}
              />
              Il fantacalcio, ogni giorno
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, width: "34px", height: "100%", backgroundColor: "#0b8f55" }} />
      </div>
    ),
    size,
  );
}
