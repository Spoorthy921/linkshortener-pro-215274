/**
 * Small fetch wrapper for the URL shortener backend.
 */

const DEFAULT_BASE_URL = "http://localhost:3001";

function getApiBaseUrl() {
  const envUrl = process.env.REACT_APP_API_BASE_URL;
  return (envUrl && envUrl.trim()) ? envUrl.trim().replace(/\/$/, "") : DEFAULT_BASE_URL;
}

async function parseJsonOrThrow(response) {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text || "Request failed" };
  }

  if (!response.ok) {
    const message = data.detail || data.message || `Request failed (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function createLink(longUrl, customSlug) {
  /** Create a short link. */
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      long_url: longUrl,
      custom_slug: customSlug || null,
    }),
  });
  return parseJsonOrThrow(response);
}

// PUBLIC_INTERFACE
export async function listLinks() {
  /** List links (default pagination). */
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/links?limit=200&offset=0`);
  return parseJsonOrThrow(response);
}

// PUBLIC_INTERFACE
export async function updateLink(slug, longUrl) {
  /** Update destination of an existing link. */
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/links/${encodeURIComponent(slug)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ long_url: longUrl }),
  });
  return parseJsonOrThrow(response);
}

// PUBLIC_INTERFACE
export async function deleteLink(slug) {
  /** Delete a link by slug. */
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/links/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
  return parseJsonOrThrow(response);
}

// PUBLIC_INTERFACE
export async function getAnalytics(slug) {
  /** Fetch basic analytics for a link. */
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/links/${encodeURIComponent(slug)}/analytics`);
  return parseJsonOrThrow(response);
}
