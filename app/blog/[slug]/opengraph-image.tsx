import { ImageResponse } from "next/og";

import { getPostBySlug } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} article preview image`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const revalidate = 3600;

export default async function Image(props: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(circle at top left, #3f3f46 0%, #18181b 45%, #09090b 100%)",
          color: "#fafafa",
          padding: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "32px",
            padding: "44px",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "rgba(24,24,27,0.55)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#a1a1aa",
            }}
          >
            Articolo
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 64,
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                maxWidth: "100%",
              }}
            >
              {post?.title ?? siteConfig.name}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                lineHeight: 1.35,
                color: "#d4d4d8",
                maxWidth: "92%",
              }}
            >
              {post?.description ?? siteConfig.description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 24,
              color: "#e4e4e7",
            }}
          >
            <div style={{ display: "flex" }}>{siteConfig.name}</div>
            <div style={{ display: "flex", gap: "12px" }}>
              {(post?.tags ?? []).slice(0, 2).map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "10px 18px",
                    color: "#d4d4d8",
                    fontSize: 18,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
