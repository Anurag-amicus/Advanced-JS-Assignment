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

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type DisplayUser = Pick<GitHubUser, "login" | "id" | "avatar_url">;

export function transformUsers(users: GitHubUser[]): DisplayUser[] {
  return users.map((user) => ({
    login: user.login,
    id: user.id,
    avatar_url: user.avatar_url,
  }));
}

export type DisplayRepository = Pick<GitHubRepository, "name" | "description">;

export function transformRepositories(repositories: GitHubRepository[]): DisplayRepository[] {
  return repositories.map((repository) => ({
    name: repository.name,
    description: repository.description,
  }));
}
