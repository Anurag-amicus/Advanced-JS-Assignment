const params = new URLSearchParams(window.location.search);

const username = params.get("username");
const id = params.get("id");

const errorMessage = document.getElementById("error-message");

const detailsSkeleton = document.getElementById("details-skeleton");
const userDetails = document.getElementById("user-details");

const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const userId = document.getElementById("user-id");

const followersList = document.getElementById("followers-list");
const repositoriesList = document.getElementById("repositories-list");

async function loadUserDetails() {
    showLoading();

    try {
        if (!username || !id) {
            throw new Error("Username and ID were not provided.");
        }

        const [followers, repositories] = await Promise.all([
            fetchFollowers(username),
            fetchRepositories(username)
        ]);

        renderUserProfile();
        renderFollowers(followers);
        renderRepositories(repositories);

        showDetails();

    } catch (error) {
        console.error("Error loading user's details  :", error);

        showError();

    } finally {
        hideLoading();
    }
}

function renderUserProfile() {
    userName.textContent = username;
    userId.textContent = id;

    userAvatar.src = `https://avatars.githubusercontent.com/u/${id}?v=4`;
    userAvatar.alt = `${username}'s avatar`;
}

function renderFollowers(followers) {
    followersList.innerHTML = "";

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
                    src="${follower.avatar}"
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

function renderRepositories(repositories) {
    repositoriesList.innerHTML = "";

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

loadUserDetails();