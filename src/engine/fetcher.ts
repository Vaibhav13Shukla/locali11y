import { FETCH_TIMEOUT_MS } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";

function isSafeExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
      return false;
    }
    if (hostname === "0.0.0.0") {
      return false;
    }
    if (/^(10\.|172\.(1[6-9]|2\d|3[01])|192\.168\.)/.test(hostname)) {
      return false;
    }
    if (hostname.endsWith(".local") || hostname.endsWith(".internal")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function fetchHtml(url: string): Promise<string> {
  if (!isSafeExternalUrl(url)) {
    throw new Error("URL points to internal network resource");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Locali11y-Auditor/1.0 (accessibility checker)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "*",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new Error(`Not an HTML page: ${contentType}`);
    }

    return await response.text();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Timeout fetching ${url} after ${FETCH_TIMEOUT_MS}ms`);
    }
    logger.error(`Failed to fetch ${url}`, error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
