const GITHUB_API_URL = "https://api.github.com/users";

async function fetchUsers() {
    const response = await fetch(`${GITHUB_API_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const users = await response.json();

    return users.map(user => ({
        login: user.login,
        id: user.id,
        avatar: user.avatar_url
    }));
}


async function fetchFollowers(username) {
    const response = await fetch(
        `${GITHUB_API_URL}/${encodeURIComponent(username)}/followers?per_page=5`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch followers: ${response.status}`
        );
    }

    const followers = await response.json();

    return followers.slice(0, 5).map(user => ({
        login: user.login,
        id: user.id,
        avatar: user.avatar_url
    }));
}


async function fetchRepositories(username) {
    const response = await fetch(
        `${GITHUB_API_URL}/${encodeURIComponent(username)}/repos?per_page=5`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch repositories: ${response.status}`
        );
    }

    const repositories = await response.json();

    return repositories.slice(0, 5).map(repository => ({
        name: repository.name,
        id: repository.id,
        description: repository.description
    }));
}

