## Script Deply on Dev.to manually

```bash
GITHUB_BEFORE=<GITHUB_BEFORE> DEVTO_API_KEY=<DEVTO_API_KEY>  node ./scripts/publish-devto.mjs
```

## Generazione automatica delle notizie

La GitHub Action richiede due repository secret:

- `OPENAI_API_KEY`
- `YOUTUBE_COOKIES_B64`, contenente in Base64 un file di cookie YouTube nel formato Netscape

Per creare il secondo secret su macOS, esportare esclusivamente i cookie di `youtube.com` seguendo le [istruzioni di yt-dlp](https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies), quindi eseguire:

```bash
base64 < youtube-cookies.txt | gh secret set YOUTUBE_COOKIES_B64
```

È preferibile usare un account YouTube dedicato. Il file locale dei cookie va eliminato dopo aver impostato il secret e non deve essere committato.
