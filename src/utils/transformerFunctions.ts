import type {
    GitHubUser,
    GitHubRepository,
    GitHubRepositorySearchItem,
    DisplayUser,
    DisplayRepository,
    DisplayRepositorySearch
} from "../types/github.js";

export function transformUsers(users: GitHubUser[]): DisplayUser[] {

    const displayUsers = users.map((user) => ({
        login: user.login,
        id: user.id,
        avatar_url: user.avatar_url,
    }));
    return displayUsers;
}

export function transformRepositories(
    repositories: GitHubRepository[]
): DisplayRepository[] {

    const displayRepositories = repositories.map((repository) => ({
        name: repository.name,
        description: repository.description,
    }));
    return displayRepositories;
}

export function transformRepositorySearchResults(
    repositories: GitHubRepositorySearchItem[]
): DisplayRepositorySearch[] {

    const displayRepositorySearch = repositories.map((repository) => ({
        name: repository.name,
        description: repository.description,
        owner: repository.owner.login,
        starCount: repository.stargazers_count,
        programmingLanguage: repository.language,
        githubUrl: repository.html_url,
    }));
    return displayRepositorySearch;
}