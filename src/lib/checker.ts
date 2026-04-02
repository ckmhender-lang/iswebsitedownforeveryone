export interface CheckResult {
  url: string;
  status: "UP" | "DOWN" | "TIMEOUT" | "DEGRADED";
  statusCode?: number;
  responseTime?: number;
  error?: string;
  checkedAt: string;
}

export async function checkWebsite(
  url: string,
  timeoutMs = 30000
): Promise<CheckResult> {
  const start = Date.now();
  const checkedAt = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "iswebsitedownforeveryone.com-Monitor/1.0 (+https://iswebsitedownforeveryone.com/bot)",
      },
      redirect: "follow",
    });

    clearTimeout(timer);
    const responseTime = Date.now() - start;

    const isUp = response.status < 500;

    return {
      url,
      status: isUp ? "UP" : "DOWN",
      statusCode: response.status,
      responseTime,
      checkedAt,
    };
  } catch (err: unknown) {
    const elapsed = Date.now() - start;
    const isTimeout =
      err instanceof Error && err.name === "AbortError";

    return {
      url,
      status: isTimeout ? "TIMEOUT" : "DOWN",
      responseTime: elapsed,
      error: isTimeout
        ? `Timed out after ${timeoutMs}ms`
        : err instanceof Error
        ? err.message
        : "Unknown error",
      checkedAt,
    };
  }
}
