import { type ApiResult } from "../types/github.js";
import { ApiDomain } from "../types/apidomain.js";

async function getErrorMessage(
    response: Response,
    apiDomain: ApiDomain
): Promise<string> {

    if (apiDomain === ApiDomain.GitHub) {
        const errorData = await response.json().catch(() => null);

        return errorData?.message ?? `Request failed with status ${response.status}`;
    }

    return  `Request failed with status ${response.status}`;
}


export async function apiRequest<T>(
    url: string,
    apiDomain: ApiDomain,
    options?: RequestInit
): Promise<ApiResult<T>> {

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            return {
                success: false,
                error: await getErrorMessage(response, apiDomain)
            };
        }

        const data: T = await response.json();

        return {
            success: true,
            data
        };

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error
                ? error.message
                : "Network request failed."
        };
    }
}