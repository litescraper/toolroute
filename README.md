# ToolRoute

## Serper search endpoint configuration

Execute serper/search with { "query": "your query", "max_results": 5 } and a registered BYOK key.
The adapter returns the provider JSON in AdapterResult.data, reports one consumed unit per successful request, and uses the existing 60-second fetchWithTimeout helper.
Gateway requests require the customer's BYOK key even if a pooled environment key is present; this integration does not authorize provider pooling.
Set SERPER_API_KEY for direct adapter calls and environment-authenticated health checks. A resolved BYOK key takes precedence over this environment variable.
Set SERPER_BASE_URL to override the API base URL; unset or empty uses https://google.serper.dev. Supply an operator-trusted base without /search; trailing slashes are removed and path prefixes are retained.
Support any Serper.dev-compatible endpoint (like litescrape.com, serpbase.dev, serpensapi.org, and others).
