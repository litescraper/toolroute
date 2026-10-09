# ToolRoute

## Litescrape search endpoint configuration

Execute litescrape/search with { "query": "your query", "max_results": 5 } and a registered BYOK key.
The adapter returns the provider JSON in AdapterResult.data, reports one consumed unit per successful request, and uses the existing 60-second fetchWithTimeout helper.
Gateway requests require the customer's BYOK key even if a pooled environment key is present; this integration does not authorize provider pooling.
Set LITESCRAPE_API_KEY for direct adapter calls and environment-authenticated health checks. A resolved BYOK key takes precedence over this environment variable.
Set LITESCRAPE_BASE_URL to override the API base URL; unset or empty uses https://api.litescrape.com. Supply an operator-trusted base without /search; trailing slashes are removed and path prefixes are retained.
