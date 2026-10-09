import type { ToolAdapter } from "../gateway-types";
import { fetchWithTimeout } from "../fetch-with-timeout";

export const serperAdapter: ToolAdapter = {
  slug: "serper",
  name: "Serper",
  description: "Web search through a Serper-compatible API.",
  operations: ["search"],

  async execute(operation, input, byokKey) {
    const apiKey = byokKey || process.env.SERPER_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Set SERPER_API_KEY or provide a BYOK key.", provider: "serper" };
    }
    if (operation !== "search") {
      return { success: false, error: `Unknown operation: ${operation}`, provider: "serper" };
    }
    if (typeof input.query !== "string" || !input.query.trim()) {
      return { success: false, error: "Missing required field: query", provider: "serper" };
    }
    const baseUrl = process.env.SERPER_BASE_URL || "https://google.serper.dev";
    try {
      const response = await fetchWithTimeout(`${baseUrl.replace(/\/+$/, "")}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
        body: JSON.stringify({ q: input.query, num: input.max_results ?? 5 }),
      });
      if (!response.ok) {
        return { success: false, error: `Search failed: HTTP ${response.status}`, provider: "serper" };
      }
      return { success: true, data: await response.json(), provider: "serper", units_consumed: 1 };
    } catch {
      return { success: false, error: "Search request failed", provider: "serper" };
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
