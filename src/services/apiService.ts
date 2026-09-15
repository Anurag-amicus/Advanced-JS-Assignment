import { ApiDomain } from "../types/apidomain.js";
import type { GitHubFollower, GitHubRepository, GitHubRepositorySearchResponse, GitHubUser } from "../types/github.js";
import { apiRequest } from "../utils/api.js";

export class ApiService {
    private readonly apiBaseUrl = ApiDomain.GitHub;

    async getUsers(since?: number) {
    const url = since
        ? `${this.apiBaseUrl}/users?per_page=30&since=${since}`
        : `${this.apiBaseUrl}/users?per_page=30`;

        const data = await apiRequest<GitHubUser[]>(url, ApiDomain.GitHub);
        return data;
    }

    async getFollowers(username: string) {
        const data = await apiRequest<GitHubFollower[]>(`${this.apiBaseUrl}/users/${username}/followers?per_page=5`, ApiDomain.GitHub);
        return data;
    }

    async getRepositories(username: string) {
        const data = await apiRequest<GitHubRepository[]>(`${this.apiBaseUrl}/users/${username}/repos?per_page=5`, ApiDomain.GitHub);
        return data;
    }

    async searchRepositories(query: string, page: number) {
    const url =
        `${this.apiBaseUrl}/search/repositories` +
        `?q=${encodeURIComponent(query)}` +
        `&page=${page}` +
        `&per_page=10`;
        const data = await apiRequest<GitHubRepositorySearchResponse>(
            url,
            ApiDomain.GitHub
        );
        return data;
    }
}   