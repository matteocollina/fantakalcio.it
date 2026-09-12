import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const STATE_FILE = path.join(process.cwd(), "content", ".youtube-sync-state.json");

const CHANNELS = [
  "https://www.youtube.com/@CarmySpecial",
  "https://www.youtube.com/@ilmisterfabry",
  "https://www.youtube.com/@ILPROFETAFANTACALCIO",
  "https://www.youtube.com/@fantalab_official",
  "https://www.youtube.com/@fantacalcio",
  "https://www.youtube.com/@lucadiddi",
  "https://www.youtube.com/@LudovicoRossini",
  "https://www.youtube.com/@fantavirus",
  "https://www.youtube.com/@recosta",
  "https://www.youtube.com/@samuelemandaro",
  "https://www.youtube.com/@LorenzoCantarini"
];

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const YTSCRIBE_API_KEY = process.env.YTSCRIBE;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5.2";
const MAX_VIDEOS_PER_CHANNEL = Number(process.env.YOUTUBE_MAX_VIDEOS_PER_CHANNEL ?? "5");
const LOOKBACK_HOURS = Number(process.env.YOUTUBE_LOOKBACK_HOURS ?? "36");
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const YTSCRIBE_API_URL = "https://ytscribe.ai/api/transcripts";

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY mancante.");
}

if (!YTSCRIBE_API_KEY) {
  throw new Error("YTSCRIBE mancante.");
}

function log(message) {
  console.log(`[youtube-blog] ${message}`);
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function extractTag(xml, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`);
  const match = xml.match(regex);

  return match ? decodeHtml(match[1].trim()) : null;
}

function extractAllEntries(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);
}

function parseRssEntries(xml) {
  return extractAllEntries(xml).map((entry) => {
    const videoId = extractTag(entry, "yt:videoId");
    const title = extractTag(entry, "title");
    const publishedAt = extractTag(entry, "published");
    const author = extractTag(entry, "name");

    if (!videoId || !title || !publishedAt) {
      return null;
    }

    return {
      videoId,
      title,
      publishedAt,
      author: author ?? "YouTube",
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }).filter(Boolean);
}

async function readState() {
  try {
    const raw = await readFile(STATE_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return { processedVideoIds: {} };
  }
}

async function writeState(state) {
  await mkdir(path.dirname(STATE_FILE), { recursive: true });
  await writeFile(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

async function fetchText(url, init) {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Richiesta fallita (${response.status}) ${url}`);
  }

  return response.text();
}

async function readJsonResponse(response, context) {
  const raw = await response.text();

  if (!raw.trim()) {
    throw new Error(`${context}: body vuoto`);
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${context}: JSON non valido (${error.message})`);
  }
}

async function resolveChannel(channelUrl) {
  const html = await fetchText(channelUrl, {
    headers: {
      "user-agent": "fantakalcio-bot/1.0",
    },
  });
  const channelIdMatch =
    html.match(/"externalId":"(UC[^"]+)"/) ?? html.match(/"channelId":"(UC[^"]+)"/);

  if (!channelIdMatch) {
    throw new Error(`Impossibile ricavare il channelId da ${channelUrl}`);
  }

  return {
    channelId: channelIdMatch[1],
  };
}

async function fetchLatestVideos(channelUrl) {
  const { channelId } = await resolveChannel(channelUrl);
  const feedXml = await fetchText(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    {
      headers: {
        "user-agent": "fantakalcio-bot/1.0",
      },
    },
  );

  return parseRssEntries(feedXml).slice(0, MAX_VIDEOS_PER_CHANNEL);
}

async function fetchTranscript(videoId) {
  const response = await fetch(YTSCRIBE_API_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${YTSCRIBE_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      url: `https://youtube.com/watch?v=${videoId}`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`YTScribe ${videoId}: HTTP ${response.status} ${errorText}`);
  }

  let payload;

  try {
    payload = await readJsonResponse(response, `YTScribe ${videoId}`);
  } catch (error) {
    throw new Error(error.message);
  }

  if (payload?.status && payload.status !== "ok") {
    throw new Error(`YTScribe ${videoId}: status inatteso ${payload.status}`);
  }

  const transcript = extractTranscriptFromYtScribePayload(payload?.data);

  if (!transcript) {
    log(`YTScribe ${videoId}: transcript assente nella risposta, salto`);
    return null;
  }

  return transcript;
}

function extractTranscriptFromYtScribePayload(payload) {
  if (!payload) {
    return null;
  }

  if (typeof payload === "string") {
    const normalized = payload.trim();
    return normalized || null;
  }

  if (Array.isArray(payload)) {
    const combined = payload
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (typeof item?.text === "string") {
          return item.text;
        }

        if (typeof item?.content === "string") {
          return item.content;
        }

        return "";
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return combined || null;
  }

  if (typeof payload !== "object") {
    return null;
  }

  const directKeys = ["text", "transcript", "content", "full_text"];

  for (const key of directKeys) {
    if (typeof payload[key] === "string" && payload[key].trim()) {
      return payload[key].trim();
    }
  }

  const nestedKeys = ["segments", "items", "captions", "entries"];

  for (const key of nestedKeys) {
    if (Array.isArray(payload[key])) {
      const combined = extractTranscriptFromYtScribePayload(payload[key]);

      if (combined) {
        return combined;
      }
    }
  }

  return null;
}

async function generateArticleFromTranscript(video, transcript) {
  const prompt = [
    `Canale: ${video.author}`,
    `Titolo video: ${video.title}`,
    `Data pubblicazione video: ${video.publishedAt}`,
    `URL video: ${video.url}`,
    "",
    "Materiale di partenza da rielaborare:",
    transcript.slice(0, 18000),
  ].join("\n");

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: prompt,
      instructions:
        "Scrivi un articolo originale in italiano per un blog frontend, come se fosse stato scritto direttamente dall'autore del blog. Usa il materiale fornito solo come base informativa da rielaborare. Non menzionare mai transcript, video, canale YouTube, intervista, speaker, contenuto originale, traduzione, rielaborazione o il fatto che il testo derivi da una fonte esterna. Non usare formule come 'nel video', 'in questo transcript', 'viene spiegato', 'si dice'. Il risultato deve sembrare un articolo editoriale nativo, sicuro, pulito e coerente, con tono tecnico ma leggibile. Organizza il contenuto in modo chiaro, elimina ripetizioni e refusi del parlato, e valorizza solo i concetti utili per chi legge il blog. Ogni articolo deve chiudersi come un pezzo editoriale finito: con una sintesi, una conclusione o un'implicazione pratica. Non chiudere mai con frasi da assistente o da AI come 'Se vuoi, posso prepararti', 'Posso anche', 'Fammi sapere se vuoi', 'dimmi e ti preparo'. Genera anche 3-6 tag brevi e specifici, in italiano, utili da mostrare nell'articolo. Evita tag generici come 'web', 'programmazione' o 'sviluppo'.",
      text: {
        format: {
          type: "json_schema",
          name: "youtube_blog_post",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              subtitle: { type: "string" },
              description: { type: "string" },
              tags: {
                type: "array",
                items: { type: "string" },
              },
              bodyMarkdown: { type: "string" },
            },
            required: ["title", "subtitle", "description", "tags", "bodyMarkdown"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const json = await readJsonResponse(response, `OpenAI ${video.videoId}`);
  const parsed =
    json.output_parsed ??
    json.output?.[0]?.content?.find((item) => item.parsed)?.parsed ??
    null;

  if (parsed) {
    return parsed;
  }

  if (json.refusal) {
    throw new Error(`OpenAI ${video.videoId}: refusal ${json.refusal}`);
  }

  const outputText =
    json.output_text ??
    json.output?.[0]?.content
      ?.filter((item) => item.type === "output_text" && typeof item.text === "string")
      .map((item) => item.text)
      .join("")
      .trim();

  if (!outputText) {
    throw new Error(`OpenAI ${video.videoId}: risposta senza output_parsed/output_text`);
  }

  try {
    return JSON.parse(outputText);
  } catch (error) {
    throw new Error(
      `OpenAI ${video.videoId}: output testuale non JSON valido (${error.message})`,
    );
  }
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [...new Set(
    tags
      .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
      .filter(Boolean)
      .slice(0, 6),
  )];
}

function buildMarkdown(post, publishedAt) {
  const quote = (value) => JSON.stringify(value);
  const tags = normalizeTags(post.tags);

  return `---
title: ${quote(post.title)}
subtitle: ${quote(post.subtitle)}
description: ${quote(post.description)}
publishedAt: ${publishedAt}
tags: ${JSON.stringify(tags)}
---
${post.bodyMarkdown.trim()}
`;
}

async function existingSlugs() {
  try {
    const files = await readdir(BLOG_DIR);
    return new Set(files.filter((file) => file.endsWith(".md")).map((file) => file.replace(/\.md$/, "")));
  } catch {
    return new Set();
  }
}

function resolveUniqueSlug(baseSlug, usedSlugs, videoId) {
  let candidate = baseSlug || `video-${videoId.toLowerCase()}`;

  if (!usedSlugs.has(candidate)) {
    return candidate;
  }

  candidate = `${candidate}-${videoId.toLowerCase()}`;

  if (!usedSlugs.has(candidate)) {
    return candidate;
  }

  let index = 2;

  while (usedSlugs.has(`${candidate}-${index}`)) {
    index += 1;
  }

  return `${candidate}-${index}`;
}

async function main() {
  await mkdir(BLOG_DIR, { recursive: true });

  const state = await readState();
  const usedSlugs = await existingSlugs();
  let hasErrors = false;
  let createdPosts = 0;
  let failedVideos = 0;
  let failedChannels = 0;
  /**
   * Prende i video pubblicati o creati dopo quella soglia temporale, cioé negli ultimi LOOKBACK_HOURS`.
      Esempio:
      se adesso sono le 19:00
      e LOOKBACK_HOURS = 24
      allora threshold corrisponde a ieri alle 19:00.

      In quel caso il filtro prenderebbe i video da ieri alle 19:00 in poi.
   * 
   */
  const threshold = Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000;
  const allVideos = [];

  for (const channelUrl of CHANNELS) {
    try {
      log(`Controllo canale ${channelUrl}`);
      const videos = await fetchLatestVideos(channelUrl);
      allVideos.push(...videos);
    } catch (error) {
      hasErrors = true;
      failedChannels += 1;
      log(`Errore sul canale ${channelUrl}: ${error.message}`);
    }
  }

  const freshVideos = allVideos
    .filter((video, index, collection) => collection.findIndex((item) => item.videoId === video.videoId) === index)
    .filter((video) => new Date(video.publishedAt).getTime() >= threshold)
    .filter((video) => !state.processedVideoIds[video.videoId]);

  log(`Video nuovi candidati: ${freshVideos.length}`);

  for (const video of freshVideos) {
    try {
      log(`Recupero transcript per ${video.title}`);
      const transcript = await fetchTranscript(video.videoId);

      if (!transcript) {
        log(`Transcript non disponibile per ${video.videoId}, salto`);
        continue;
      }

      log(`Genero articolo per ${video.videoId}`);
      const generated = await generateArticleFromTranscript(video, transcript);
      const baseSlug = slugify(generated.title);
      const slug = resolveUniqueSlug(baseSlug, usedSlugs, video.videoId);
      const publishedAt = video.publishedAt.slice(0, 10);
      const markdown = buildMarkdown(generated, publishedAt);

      await writeFile(path.join(BLOG_DIR, `${slug}.md`), markdown, "utf8");

      usedSlugs.add(slug);
      state.processedVideoIds[video.videoId] = {
        slug,
        title: generated.title,
        sourceTitle: video.title,
        publishedAt,
        createdAt: new Date().toISOString(),
      };

      createdPosts += 1;
      log(`Creato post ${slug}.md`);
    } catch (error) {
      hasErrors = true;
      failedVideos += 1;
      log(`Errore sul video ${video.videoId}: ${error.message}`);
    }
  }

  await writeState(state);

  if (hasErrors) {
    log(
      `Generazione completata con errori non bloccanti. Articoli pubblicati: ${createdPosts}. Canali falliti: ${failedChannels}. Video falliti: ${failedVideos}.`,
    );
    return;
  }

  log(`Generazione completata con successo. Articoli pubblicati: ${createdPosts}.`);
}

try {
  await main();
} catch (error) {
  console.error(`[youtube-blog] ${error.message}`);
  process.exitCode = 1;
}
