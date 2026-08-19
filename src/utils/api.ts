import type { ApiResult } from "../types/github.js";

export async function apiRequest<T>(url: string): Promise<ApiResult<T>> {
    const response = await fetch(url);

    if (!response.ok) {
        return { success: false, error: `Request failed with status ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
}
