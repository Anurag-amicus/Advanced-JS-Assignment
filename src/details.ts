import { ApiService } from "./services/apiService.js";
import { transformRepositories, type DisplayRepository, type GitHubFollower, type GitHubRepository } from "./types/github.js";
import { getElement } from "./utils/dom.js";
const params = new URLSearchParams(window.location.search);

const username = params.get("username");
const id = params.get("id");

const errorMessage = getElement<HTMLElement>("error-message");
const detailsSkeleton = getElement<HTMLElement>("details-skeleton");
const userDetails = getElement<HTMLElement>("user-details");

const userAvatar = getElement<HTMLImageElement>("user-avatar");
const userName = getElement<HTMLElement>("user-name");
const userId = getElement<HTMLElement>("user-id");

const followersList = getElement<HTMLUListElement>("followers-list");
const repositoriesList = getElement<HTMLUListElement>("repositories-list");

const apiService = new ApiService();

let followerData: GitHubFollower[] = [];
let repositoryData: GitHubRepository[] = [];

let followerError: string | undefined;
let repositoryError: string | undefined;

async function loadUserDetails(apiService: ApiService, username: string | null, id: string | null) {
  showLoading();

  try {
    if (!username || !id) {
      throw new Error("Username and ID were not provided.");
    }

    const [followers, repositories] = await Promise.allSettled([
      apiService.getFollowers(username),
      apiService.getRepositories(username),
    ]);

   if (followers.status === "fulfilled") {
    if (followers.value.success) {
        followerData = followers.value.data;
    } else {
        followerError = followers.value.error;
    }
    } else {
    followerError = "Failed to load followers.";
}


    if (repositories.status === "fulfilled") {
    if (repositories.value.success) {
        repositoryData = repositories.value.data;
    } else {
        repositoryError = repositories.value.error;
    }
    } else {
    repositoryError = "Failed to load repositories.";
    }

    renderUserProfile(username, id);
    renderFollowers(followerData,followerError);
    const displayRepositories = transformRepositories(repositoryData);
    renderRepositories(displayRepositories, repositoryError);

    showDetails();
  } catch (error) {
    console.error("Error loading user's details  :", error);

    showError();
  } finally {
    hideLoading();
  }
}

function renderUserProfile(username: string, id: string) {
    userName.textContent = username;
    userId.textContent = id;

    userAvatar.src = `https://avatars.githubusercontent.com/u/${id}?v=4`;
    userAvatar.alt = `${username}'s avatar`;
}

function renderFollowers(followers: GitHubFollower[] , error?: string) {
    followersList.innerHTML = "";
    if (error) {
    followersList.innerHTML = `
        <li class="empty-list-item">
            ${error}
        </li>
    `;
    return;
    }
    if (followers.length === 0) {
        followersList.innerHTML = `
            <li class="empty-list-item">
                No followers found.
            </li>
        `;

        return;
    }

    followers.forEach(follower => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <div class="detail-user">
                <img
                    src="${follower.avatar_url}"
                    alt="${follower.login}'s avatar"
                    class="detail-user-avatar"
                >

                <div>
                    <strong>${follower.login}</strong>
                    <span>ID: ${follower.id}</span>
                </div>
            </div>
        `;

        followersList.appendChild(listItem);
    });
}

function renderRepositories(repositories: DisplayRepository[],error?: string) {
    repositoriesList.innerHTML = "";
    if (error) {
        repositoriesList.innerHTML = `
            <li class="empty-list-item">
                ${error}
            </li>
        `;
        return;
    }
    if (repositories.length === 0) {
        repositoriesList.innerHTML = `
            <li class="empty-list-item">
                No repositories found.
            </li>
        `;

        return;
    }

    repositories.forEach(repository => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <strong>${repository.name}</strong>

            ${
                repository.description
                    ? `<p>${repository.description}</p>`
                    : `<p>No description available.</p>`
            }
        `;

        repositoriesList.appendChild(listItem);
    });
}

function showLoading() {
    detailsSkeleton.classList.remove("hidden");
    userDetails.classList.add("hidden");
    errorMessage.classList.add("hidden");
}


function hideLoading() {
    detailsSkeleton.classList.add("hidden");
}


function showDetails() {
    userDetails.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}


function showError() {
    errorMessage.classList.remove("hidden");
    userDetails.classList.add("hidden");
}

loadUserDetails(apiService, username, id);