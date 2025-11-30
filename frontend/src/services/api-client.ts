const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function request(url: string, options: RequestInit = {}) {
  const response = await fetch(API_BASE_URL + url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Request failed");
  return data;
}
