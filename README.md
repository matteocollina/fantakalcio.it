## Script Deply on Dev.to manually

```bash
GITHUB_BEFORE=<GITHUB_BEFORE> DEVTO_API_KEY=<DEVTO_API_KEY>  node ./scripts/publish-devto.mjs
```

## Generazione automatica delle notizie

La GitHub Action richiede due repository secret:

- `OPENAI_API_KEY`
- `YTSCRIBE`, contenente la chiave API di YTScribe

La chiave può essere configurata dalla root del progetto con GitHub CLI:

```bash
gh secret set YTSCRIBE
```
