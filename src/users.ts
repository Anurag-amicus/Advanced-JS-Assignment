import { ApiService } from "./services/apiService.js";
import { DisplayUser } from "./types/github.js";
import { getElement } from "./utils/dom.js";
import { transformUsers } from "./utils/transformerFunctions.js";

const fetchedCountElement: HTMLElement = getElement("fetched-count");
const remainingCountElement: HTMLElement = getElement("remaining-count");

const loadingSkeleton: HTMLElement = getElement("loading-skeleton");
const usersContainer: HTMLElement = getElement("users-container");
const usersTableBody: HTMLTableSectionElement = getElement("users-table-body");

const errorMessage: HTMLElement = getElement("error-message");
const emptyMessage: HTMLElement = getElement("empty-message");

const previousPageButton: HTMLButtonElement = getElement("previous-page");
const nextPageButton: HTMLButtonElement = getElement("next-page");
const pageInfo: HTMLElement = getElement("page-info");

const userSearchInput: HTMLInputElement = getElement("user-search");
const sortOrderSelect: HTMLSelectElement = getElement("sort-order");

const retryButton: HTMLButtonElement = getElement("retry-button");

const apiService = new ApiService();
let searchTerm = "";
let sortDirection: "relevance" | "asc" | "desc" = "relevance";

const USERS_PER_PAGE = 30;

let users: DisplayUser[] = [];
let filteredUsers: DisplayUser[] = [];

let currentPage = 1;

/*
 * Stores the cursor required to request each API page.
 *
 * Page 1 → undefined
 * Page 2 → last user ID from page 1
 * Page 3 → last user ID from page 2
 * etc.
 */
const pageCursors: (number | undefined)[] = [undefined];

async function loadUsers(
    apiService: ApiService,
    page: number,
    since?: number,
) {
    showLoading();

    try {
        const result = await apiService.getUsers(since);

        if (!result.success) {
            throw new Error(result.error);
        }

        users = transformUsers(result.data);

        currentPage = page;

        fetchedCountElement.textContent = String(users.length);

        applySearchAndSort();

        /*
         * If GitHub returned 30 users, store the last user's ID.
         * This ID will be used as the "since" value for the next page.
         */
        if (result.data.length === USERS_PER_PAGE) {
            const lastUser = result.data[result.data.length - 1];

            if (lastUser) {
                pageCursors[currentPage] = lastUser.id;
            }
        }

        updatePagination();
    } catch (error) {
        console.error("Error loading users:", error);

        showError();
    } finally {
        hideLoading();
    }
}

retryButton.addEventListener("click", () => {
    loadUsers(apiService, currentPage, pageCursors[currentPage - 1]);
});

function renderUsers(userList: DisplayUser[]) {
    usersTableBody.innerHTML = "";

    if (userList.length === 0) {
        emptyMessage.classList.remove("hidden");
        usersContainer.classList.add("hidden");
        return;
    }

    emptyMessage.classList.add("hidden");
    usersContainer.classList.remove("hidden");

    /*
     * No client-side pagination.
     *
     * The API has already returned one batch of up to 30 users,
     * so we display every user in that batch.
     */
    userList.forEach((user) => {
        const row = document.createElement("tr");

        row.className = "user-row";
        row.dataset.username = user.login;

        row.innerHTML = `
            <td data-label="User">
                <img
                    src="${user.avatar_url}"
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

        row.addEventListener("click", (event: MouseEvent) => {
            if (
                event.target instanceof Element &&
                event.target.closest("a")
            ) {
                return;
            }

            window.location.href =
                `details.html?username=${encodeURIComponent(user.login)}&id=${user.id}`;
        });

        usersTableBody.appendChild(row);
    });
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

function updatePagination() {
    pageInfo.textContent = `Page ${currentPage}`;

    /*
     * Page 1 has no previous page.
     */
    previousPageButton.disabled = currentPage === 1;

    /*
     * pageCursors[currentPage] contains the cursor needed
     * to request the next page.
     *
     * If it doesn't exist, we don't know of another page yet.
     */
    nextPageButton.disabled = pageCursors[currentPage] === undefined;
}

previousPageButton.addEventListener("click", () => {
    if (currentPage === 1) {
        return;
    }

    const previousPage = currentPage - 1;
    const previousSince = pageCursors[previousPage - 1];

    loadUsers(
        apiService,
        previousPage,
        previousSince,
    );
});

nextPageButton.addEventListener("click", () => {
    const nextSince = pageCursors[currentPage];

    if (nextSince === undefined) {
        return;
    }

    const nextPage = currentPage + 1;

    loadUsers(
        apiService,
        nextPage,
        nextSince,
    );
});

function applySearchAndSort() {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const searchedUsers = users.filter((user) =>
        user.login.toLowerCase().includes(normalizedSearch),
    );

    if (sortDirection === "relevance") {
        filteredUsers = searchedUsers;
    } else {
        filteredUsers = [...searchedUsers].sort((a, b) => {
            if (sortDirection === "asc") {
                return a.login.localeCompare(b.login);
            }

            return b.login.localeCompare(a.login);
        });
    }

    remainingCountElement.textContent = String(filteredUsers.length);

    renderUsers(filteredUsers);
}

userSearchInput.addEventListener("input", () => {
    searchTerm = userSearchInput.value;

    applySearchAndSort();
});

sortOrderSelect.addEventListener("change", () => {
    sortDirection = sortOrderSelect.value as
        "relevance" | "asc" | "desc";

    applySearchAndSort();
});

loadUsers(apiService, 1);

