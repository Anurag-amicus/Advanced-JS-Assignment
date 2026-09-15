export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name?: string | null;
  public_repos?: number;
}

export interface GitHubRepository {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
}

export interface GitHubFollower {
  login: string;
  id: number;
  avatar_url: string;
}

export interface GitHubRepositorySearchItem {
    name: string;
    description: string | null;
    owner: {
        login: string;
    };
    stargazers_count: number;
    language: string | null;
    html_url: string;
}

export interface GitHubRepositorySearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubRepositorySearchItem[];
}

export interface DisplayRepositorySearch {
    name: string;
    description: string | null;
    owner: string;
    starCount: number;
    programmingLanguage: string | null;
    githubUrl: string;
}

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type DisplayUser = Pick<GitHubUser, "login" | "id" | "avatar_url">;

export type DisplayRepository = Pick<GitHubRepository, "name" | "description">;


