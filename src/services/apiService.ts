import type { GitHubFollower, GitHubRepository, GitHubUser } from "../types/github.js";
import { apiRequest } from "../utils/api.js";

export class ApiService {
    private readonly githubApiBaseUrl = "https://api.github.com";

    async getUsers() {
        const data = await apiRequest<GitHubUser[]>(`${this.githubApiBaseUrl}/users`);
        return data;
    }

    async getFollowers(username: string) {
        const data = await apiRequest<GitHubFollower[]>(`${this.githubApiBaseUrl}/users/${username}/followers?per_page=5`);
        return data;
    }

    async getRepositories(username: string) {
        const data = await apiRequest<GitHubRepository[]>(`${this.githubApiBaseUrl}/users/${username}/repos?per_page=5`);
        return data;
    }
}