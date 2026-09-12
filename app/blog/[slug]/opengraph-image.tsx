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
          background: "#0c1830",
          color: "#fafafa",
          padding: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            borderTop: "12px solid #0b8f55",
            padding: "44px",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#101f39",
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
            Ultime notizie
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
                fontWeight: 900,
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
            <div style={{ display: "flex", fontWeight: 900, textTransform: "uppercase" }}>{siteConfig.name}</div>
            <div style={{ display: "flex", gap: "12px" }}>
              {(post?.tags ?? []).slice(0, 2).map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    backgroundColor: "#0b8f55",
                    padding: "10px 18px",
                    color: "#ffffff",
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
