import type { Express } from 'express';

export function registerScrapeRoutes(app: Express) {
  const syncStatus: Record<string, { running: boolean; logs: string[]; done: boolean; error: string | null }> = {
    instagram: { running: false, logs: ['Web mode: Ingestion handled via Cloud Sync.'], done: true, error: null },
    flickr: { running: false, logs: ['Web mode: Ingestion handled via Cloud Sync.'], done: true, error: null }
  };

  // API route to trigger sync/ingestion check (safe web-mode stub)
  app.post("/api/scrape/start", async (req, res) => {
    const { source } = req.body || {};
    const key = (typeof source === 'string' && syncStatus[source]) ? source : 'instagram';
    return res.json({
      message: 'Ingestion in web preview is synchronized via Cloudflare R2.',
      status: syncStatus[key]
    });
  });

  // API route to check status
  app.get("/api/scrape/status/:source", (req, res) => {
    const { source } = req.params;
    if (!source || !syncStatus[source]) {
      return res.status(404).json({ error: 'Source not found' });
    }
    res.json(syncStatus[source]);
  });

  // API route to merge data
  app.post("/api/scrape/merge", async (_req, res) => {
    res.json({ success: true, addedCount: 0, message: 'All items synchronized.' });
  });

  // API route to get data
  app.get("/api/scraped-data", async (_req, res) => {
    res.json({ instagram: [], flickr: [] });
  });

  // API route for status streaming
  app.get("/api/scrape", (_req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write(`data: ${JSON.stringify({ log: 'Connected to Web Preview Sync.' })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  });

  // API route for external photo items
  app.get("/api/flickr", async (_req, res) => {
    res.json({ items: [] });
  });
}
