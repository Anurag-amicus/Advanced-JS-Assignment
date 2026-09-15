import { ApiService } from "./services/apiService.js";
import type { DisplayRepositorySearch } from "./types/github.js";
import { getElement } from "./utils/dom.js";
import { transformRepositorySearchResults } from "./utils/transformerFunctions.js";

const searchInput: HTMLInputElement =
    getElement("repository-search");

const searchButton: HTMLButtonElement =
    getElement("repository-search-button");

const repositoriesContainer: HTMLElement =
    getElement("repositories-container");

const repositoriesList: HTMLTableSectionElement =
    getElement("repositories-table-body");

const loadingSkeleton: HTMLElement =
    getElement("loading-skeleton");

const errorMessage: HTMLElement =
    getElement("error-message");

const emptyMessage: HTMLElement =
    getElement("empty-message");

const previousPageButton: HTMLButtonElement =
    getElement("previous-page");

const nextPageButton: HTMLButtonElement =
    getElement("next-page");

const pageInfo: HTMLElement =
    getElement("page-info");

const searchForm: HTMLFormElement =
    getElement("repository-search-form");

const repositoryCount: HTMLElement =
    getElement("repository-count");

const retryButton: HTMLButtonElement =
    getElement("retry-button");

const apiService = new ApiService();

let repositories: DisplayRepositorySearch[] = [];
let currentPage = 1;
let currentSearchTerm = "";

async function loadRepositories(
    page: number = 1
) {

    if (!currentSearchTerm.trim()) {
        resetRepositoryPage();
        return;
    }
    showLoading();

    try {

        const result = await apiService.searchRepositories(
            currentSearchTerm,
            page
        );

        if (!result.success) {
            renderRepositoriesError(result.error);
            return;
        }

        repositories =
            transformRepositorySearchResults(result.data.items);

        repositoryCount.textContent =
            String(result.data.total_count);

    
        if (repositories.length === 0) {
            renderRepositories([]);

            updatePagination();

            return;
        }

        renderRepositories(repositories);

        updatePagination(result.data.total_count);

    } catch (error) {
        console.error("Error loading repositories:", error);

        showError(
            error instanceof Error
                ? error.message
                : "Failed to load repositories."
        );

    } finally {
        hideLoading();
    }
}



function renderRepositories(
    repositoryList: DisplayRepositorySearch[]
) {
    repositoriesList.innerHTML = "";

    if (repositoryList.length === 0) {
        emptyMessage.textContent = "No repositories found.";
        emptyMessage.classList.remove("hidden");
        repositoriesContainer.classList.add("hidden");

        return;
    }

    emptyMessage.classList.add("hidden");
    repositoriesContainer.classList.remove("hidden");

    repositoryList.forEach((repository) => {

        const row = document.createElement("tr");

        row.className = "repository-row";

        row.innerHTML = `
            <td data-label="Repository">
                <strong class="repository-name">
                    ${repository.name}
                </strong>

                <p class="repository-description">
                    ${repository.description ?? "No description available."}
                </p>
            </td>

            <td data-label="Owner">
                ${repository.owner}
            </td>

            <td data-label="Stars">
                ${repository.starCount}
            </td>

            <td data-label="Language">
                ${repository.programmingLanguage ?? "N/A"}
            </td>

            <td data-label="GitHub">
                <a
                    href="${repository.githubUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary"
                >
                    View on GitHub
                </a>
            </td>
        `;

        repositoriesList.appendChild(row);
    });
}


function renderRepositoriesError(error: string) {
    repositoriesList.innerHTML = "";

    repositoriesContainer.classList.add("hidden");
    emptyMessage.classList.add("hidden");
    errorMessage.classList.remove("hidden");

    errorMessage.querySelector("p")!.textContent = error;
}

function updatePagination(totalCount: number = 0) {

    pageInfo.textContent = `Page ${currentPage}`;

    previousPageButton.disabled =
        currentPage === 1;

    const totalPages = Math.ceil(totalCount / 10);

    nextPageButton.disabled =
        currentPage >= totalPages;
}


function showLoading() {
    loadingSkeleton.classList.remove("hidden");

    repositoriesContainer.classList.add("hidden");

    emptyMessage.classList.add("hidden");

    errorMessage.classList.add("hidden");

    retryButton.disabled = true;
}

function hideLoading() {
    loadingSkeleton.classList.add("hidden");

    retryButton.disabled = false;
}


function showError(error: string) {

    errorMessage.classList.remove("hidden");

    repositoriesContainer.classList.add("hidden");

    emptyMessage.classList.add("hidden");

    errorMessage.querySelector("p")!.textContent = error;
}

function resetRepositoryPage() {
    currentSearchTerm = "";
    currentPage = 1;

    repositories = [];

    repositoriesList.innerHTML = "";

    repositoryCount.textContent = "0";

    repositoriesContainer.classList.add("hidden");
    errorMessage.classList.add("hidden");
    emptyMessage.classList.add("hidden");
    loadingSkeleton.classList.add("hidden");

    pageInfo.textContent = "Page 1";

    previousPageButton.disabled = true;
    nextPageButton.disabled = true;
}

searchForm.addEventListener(
    "submit",
    (event: SubmitEvent) => {

        event.preventDefault();

        const searchTerm = searchInput.value.trim();

        if (!searchTerm) {
            resetRepositoryPage();
            return;
        }

        currentSearchTerm = searchTerm;
        currentPage = 1;

        loadRepositories(currentPage);
    }
);


previousPageButton.addEventListener("click", () => {

    if (currentPage === 1) {
        return;
    }

    currentPage--;

    loadRepositories(currentPage);
});


nextPageButton.addEventListener("click", () => {

    currentPage++;

    loadRepositories(currentPage);
});


retryButton.addEventListener("click", () => {

    loadRepositories(currentPage);
});