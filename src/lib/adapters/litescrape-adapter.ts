import type { ToolAdapter } from "../gateway-types";
import { fetchWithTimeout } from "../fetch-with-timeout";

export const litescrapeAdapter: ToolAdapter = {
  slug: "litescrape",
  name: "Litescrape",
  description: "Web search through a Serper-compatible API.",
  operations: ["search"],

  async execute(operation, input, byokKey) {
    const apiKey = byokKey || process.env.LITESCRAPE_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Set LITESCRAPE_API_KEY or provide a BYOK key.", provider: "litescrape" };
    }
    if (operation !== "search") {
      return { success: false, error: `Unknown operation: ${operation}`, provider: "litescrape" };
    }
    if (typeof input.query !== "string" || !input.query.trim()) {
      return { success: false, error: "Missing required field: query", provider: "litescrape" };
    }
    const baseUrl = process.env.LITESCRAPE_BASE_URL || "https://api.litescrape.com";
    try {
      const response = await fetchWithTimeout(`${baseUrl.replace(/\/+$/, "")}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
        body: JSON.stringify({ q: input.query, num: input.max_results ?? 5 }),
      });
      if (!response.ok) {
        return { success: false, error: `Search failed: HTTP ${response.status}`, provider: "litescrape" };
      }
      return { success: true, data: await response.json(), provider: "litescrape", units_consumed: 1 };
    } catch {
      return { success: false, error: "Search request failed", provider: "litescrape" };
    }
  },

  async healthCheck() {
    const start = Date.now();
    const result = await this.execute("search", { query: "test", max_results: 1 });
    return { healthy: result.success, latency_ms: Date.now() - start };
  },

  estimateCost() {
    return 0.001;
  },
};
