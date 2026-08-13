const fetchedCountElement = document.getElementById("fetched-count");
const remainingCountElement = document.getElementById("remaining-count");

const loadingSkeleton = document.getElementById("loading-skeleton");
const usersContainer = document.getElementById("users-container");
const usersTableBody = document.getElementById("users-table-body");

const errorMessage = document.getElementById("error-message");
const emptyMessage = document.getElementById("empty-message");

const previousPageButton = document.getElementById("previous-page");
const nextPageButton = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

const loginLengthInput = document.getElementById("login-length");
const applyFilterButton = document.getElementById("apply-filter");

const retryButton = document.getElementById("retry-button");

let users = [];
let filteredUsers = [];

const USERS_PER_PAGE = 5;

let currentPage = 1;

async function loadUsers() {
    showLoading();

    try {
        users = await fetchUsers();
        filteredUsers = users;
        currentPage = 1;

        fetchedCountElement.textContent = users.length;
        remainingCountElement.textContent = filteredUsers.length;

        renderUsers(filteredUsers);

    } catch (error) {
        console.error("Error loading users:", error);

        showError();
        
    } finally {
        hideLoading();
    }
}

retryButton.addEventListener("click", loadUsers);

function renderUsers(userList) {
    usersTableBody.innerHTML = "";

    if (userList.length === 0) {
        emptyMessage.classList.remove("hidden");
        usersContainer.classList.add("hidden");
        updatePagination(0);
        return;
    }

    emptyMessage.classList.add("hidden");
    usersContainer.classList.remove("hidden");

    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;

    const usersForCurrentPage = userList.slice(startIndex, endIndex);

    usersForCurrentPage.forEach(user => {
        const row = document.createElement("tr");

        row.className = "user-row";
        row.dataset.username = user.login;

        row.innerHTML = `
            <td data-label="User">
                <img
                    src="${user.avatar}"
                    alt="${user.login}'s avatar"
                    class="user-avatar"
                >
            </td>

            <td data-label="Login">
                <span class="user-login">
                    ${user.login}
                </span>
            </td>

            <td data-label="ID">
                <span class="user-id">
                    ${user.id}
                </span>

                <a
                    href="details.html?username=${encodeURIComponent(user.login)}&id=${user.id}"
                    class="btn btn-primary mobile-details-button"
                >
                    View Details
                </a>
            </td>
        `;

        row.addEventListener("click", event => {
            if (event.target.closest("a")) {
                return;
            }

            window.location.href =
                `details.html?username=${encodeURIComponent(user.login)}&id=${user.id}`;
        });

        usersTableBody.appendChild(row);
    });

    updatePagination(userList.length);
}


function showLoading() {
    loadingSkeleton.classList.remove("hidden");
    usersContainer.classList.add("hidden");
    emptyMessage.classList.add("hidden");
    errorMessage.classList.add("hidden");
    retryButton.disabled = true;
}


function hideLoading() {
    loadingSkeleton.classList.add("hidden");
    retryButton.disabled = false;
}

function showError() {
    errorMessage.classList.remove("hidden");
    usersContainer.classList.add("hidden");
    emptyMessage.classList.add("hidden");
}

function updatePagination(totalUsers) {
    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

    if (totalPages === 0) {
        pageInfo.textContent = "Page 0 of 0";

        previousPageButton.disabled = true;
        nextPageButton.disabled = true;

        return;
    }

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    previousPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

previousPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderUsers(filteredUsers);
    }
});

nextPageButton.addEventListener("click", () => {
    const totalPages = Math.ceil(
        filteredUsers.length / USERS_PER_PAGE
    );

    if (currentPage < totalPages) {
        currentPage++;
        renderUsers(filteredUsers);
    }
});

function applyFilter() {
    const minimumLoginLength = Number(loginLengthInput.value);

    if (minimumLoginLength < 4) {
        loginLengthInput.value = 4;
        return;
    }

    filteredUsers = users.filter(user =>
        user.login.length >= minimumLoginLength
    );

    currentPage = 1;

    remainingCountElement.textContent = filteredUsers.length;

    renderUsers(filteredUsers);
}

applyFilterButton.addEventListener("click", applyFilter);


loadUsers();