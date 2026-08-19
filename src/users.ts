import { ApiService } from "./services/apiService.js";
import { DisplayUser, GitHubUser, transformUsers } from "./types/github.js";
import { getElement } from "./utils/dom.js";

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

const loginLengthInput: HTMLInputElement = getElement("login-length");
const applyFilterButton: HTMLButtonElement = getElement("apply-filter");

const retryButton: HTMLButtonElement = getElement("retry-button");

const apiService = new ApiService();

let users: DisplayUser[] = [];
let filteredUsers: DisplayUser[] = [];

const USERS_PER_PAGE = 5;
let currentPage = 1;

async function loadUsers(apiService: ApiService) {
  showLoading();

  try {
    const result = await apiService.getUsers();

    if (result.success) {
      users = transformUsers(result.data);
    } else {
      throw new Error(result.error);
    }
    filteredUsers = users;
    currentPage = 1;
    fetchedCountElement.textContent = String(users.length);
    remainingCountElement.textContent = String(filteredUsers.length);
    renderUsers(filteredUsers);
  } catch (error) {
    console.error("Error loading users:", error);

    showError();
  } finally {
    hideLoading();
  }
}

retryButton.addEventListener("click", (event: MouseEvent) => {
  loadUsers(apiService);
});

function renderUsers(userList: DisplayUser[]) {
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

  usersForCurrentPage.forEach((user) => {
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
      if (event.target instanceof Element && event.target.closest("a")) {
        return;
      }
      window.location.href = `details.html?username=${encodeURIComponent(user.login)}&id=${user.id}`;
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

function updatePagination(totalUsers: number) {
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

previousPageButton.addEventListener("click", (event: MouseEvent) => {
  if (currentPage > 1) {
    currentPage--;
    renderUsers(filteredUsers);
  }
});

nextPageButton.addEventListener("click", (event: MouseEvent) => {
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  if (currentPage < totalPages) {
    currentPage++;
    renderUsers(filteredUsers);
  }
});

function applyFilter() {
  const minimumLoginLength = Number(loginLengthInput.value);

  if (minimumLoginLength < 4) {
    loginLengthInput.value = String(4);
    return;
  }

  filteredUsers = users.filter(
    (user) => user.login.length >= minimumLoginLength,
  );

  currentPage = 1;

  remainingCountElement.textContent = String(filteredUsers.length);

  renderUsers(filteredUsers);
}

applyFilterButton.addEventListener("click", applyFilter);

loadUsers(apiService);
