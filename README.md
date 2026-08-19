# AFDP Advanced JS Assignment

Name - Anurag Chandra Technical - AFDP 2026 Path 2

# GitHub Users Explorer - Advanced JS Assignment

A frontend JavaScript application that consumes the GitHub Users API to display, filter, paginate, and explore GitHub users.

## Features

- Fetch GitHub users on page load.
- Display fetched and filtered user counts.
- Filter users by minimum login length.
- Paginate users with 5 users per page.
- Responsive desktop table and mobile card layout.
- View individual user details.
- Fetch first 5 followers and repositories in parallel.
- Loading skeletons and user-friendly error handling.

## Approach

The application was built in separate stages:

1. Fetch users from the GitHub API using `async/await`.
2. Validate the API response and transform the data to only `login`, `id`, and `avatar`.
3. Store the fetched data and use it for filtering and pagination without making additional API requests.
4. Render users dynamically based on the current page and filter.
5. Open a details page for the selected user.
6. Fetch followers and repositories simultaneously using `Promise.all()`.
7. Handle loading, empty, and error states throughout the application.
```text
    OVERALL DATA FLOW

    GitHub API
        ↓
    Fetch & Validate
        ↓
    Transform Data
        ↓
    Fetched Users
        ↓
    Filter
        ↓
    Filtered Users
        ↓
    Pagination
        ↓
    Render UI
        ↓
    User Details
        ↓
    Followers + Repositories
        ↓
    Promise.all()
```


## File Structure

```text
Advanced JS Assignment/
│
├── index.html
├── details.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── api.js
│   ├── users.js
│   └── details.js
│
└── README.md
```

| File           | Purpose                                                       |
| -------------- | ------------------------------------------------------------- |
| `index.html`   | User list, filter, count and pagination UI                    |
| `details.html` | Selected user's details, followers and repositories           |
| `style.css`    | Responsive layout, table/cards, loading skeletons and styling |
| `api.js`       | GitHub API requests and response transformation               |
| `users.js`     | List-page state, filtering, pagination and rendering          |
| `details.js`   | Details-page logic and parallel API requests                  |
| `README.md`    | Project documentation                                         |


## Important Implementation Logic

### API Fetching

`api.js` uses `async/await` and checks `response.ok` before processing the response.

```javascript
const response = await fetch(url);

if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
}
```

### Data Transformation

Only the required fields are retained from the GitHub response:

```javascript
return users.map(user => ({
    login: user.login,
    id: user.id,
    avatar: user.avatar_url
}));
```

### Filtering & Pagination

The original fetched array is preserved. Filtering creates a separate filteredUsers array, which is then paginated using slice().

```mermaid
graph LR
    users --> filteredUsers --> current_page[current page] --> render
```
Five users are displayed per page.

### Parallel Requests

The details page fetches followers and repositories simultaneously:

```javascript
const [followers, repositories] = await Promise.all([
    fetchFollowers(username),
    fetchRepositories(username)
]);
```
### Error & Loading States

The application handles different UI states during API requests:

- **Loading:** A skeleton UI is shown while data is being fetched.
- **Success:** The skeleton is removed and the fetched data is rendered.
- **Error:** API/network failures are caught using `try/catch` and a friendly error message is displayed instead of leaving the page blank.
- **Retry:** The user can retry the request from the error state.
- **Empty:** A separate message is shown when no users match the applied filter.

The loading skeleton is hidden in the `finally` block so it is removed whether the request succeeds or fails.

```javascript
try {
    users = await fetchUsers();
    renderUsers(users);
} catch (error) {
    console.error(error);
    showError();
} finally {
    hideLoading();
}
```
## Design & Responsive Decisions

- Desktop uses a table layout for efficient comparison of users.
- Mobile converts each user into a card to improve readability on smaller screens.
- The desktop table does not include a separate action column; the entire row is clickable.
- Mobile cards include a `View Details` button.
- Loading skeletons are used instead of leaving the page blank during API requests.
- The UI includes separate states for loading, error, empty results, and successful results.

## Screenshots

### Desktop User List

![Desktop User List](screenshots/desktop-list.png)

### Mobile User List

**Only Mobile View has the `View Details` button**


![Mobile User List](screenshots/mobile-list.png)

### Filtered Users

![Filtered Users](screenshots/filtered-users.png)


### User Details

![User Details](screenshots/user-details.png)

### Loading State

![Loading State](screenshots/loading-skeleton.png)

## Setup & Run

### Prerequisites

- A modern web browser
- VS Code with Live Server (recommended)

### Run Locally

1. Clone the repository.
2. Open the project in VS Code.
3. Start the project using Live Server.
4. Open `index.html` in the browser.

The application uses the GitHub REST API directly, so no backend or environment variables are required.

## Assignment Requirements

| Requirement | Status |
|---|---|
| Fetch GitHub users on page load | ✅ |
| Display fetched user count | ✅ |
| Use `async/await` | ✅ |
| Validate API responses | ✅ |
| Transform API data | ✅ |
| Filter by minimum login length | ✅ |
| Display filtered user count | ✅ |
| Pagination with 5 users per page | ✅ |
| Loading skeleton | ✅ |
| Graceful error handling | ✅ |
| Responsive desktop/mobile layout | ✅ |
| User details page | ✅ |
| Fetch first 5 followers | ✅ |
| Fetch first 5 repositories | ✅ |
| Parallel requests using `Promise.all()` | ✅ |
| Back to users functionality | ✅ |






# Follow up Advanced JavaScript & TypeScript — GitHub Users API

## Overview

This project is a TypeScript migration of the previous **Advanced JS -  GitHub User Explorer** assignment.

The original JavaScript application was migrated to TypeScript while preserving the existing HTML, CSS, UI functionality, GitHub API integration, pagination, filtering, loading states, error handling, and user details functionality.

The application uses the GitHub REST API to:

* Fetch GitHub users.
* Display users with pagination.
* Filter users by minimum login length.
* Display detailed information for a selected user.
* Fetch the user's first 5 followers.
* Fetch the user's first 5 repositories.
* Handle API and application errors gracefully.
* Display loading skeletons while requests are in progress.


# Project Structure

```text
Advanced JS Assignment/
│
├── js/
│   └── Previously used JS files
│
│
├── css/
│   └── CSS files
│
├── dist/
│   └── Compiled JavaScript generated from TypeScript
│
├── src/
│   ├── services/
│   │   └── apiService.ts
│   │
│   ├── types/
│   │   └── github.ts
│   │
│   ├── utils/
│   │   ├── api.ts
│   │   └── dom.ts
│   │
│   ├── users.ts
│   └── details.ts
│
├── screenshots/
│   └── Application screenshots
│
├── index.html
├── details.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

### Responsibility of each layer

| File / Folder                | Responsibility                                   |
| ---------------------------- | ------------------------------------------------ |
| `src/types/`                 | Contains TypeScript interfaces and utility types |
| `src/utils/api.ts`           | Generic API request helper                       |
| `src/utils/dom.ts`           | Reusable typed DOM helper                        |
| `src/services/apiService.ts` | GitHub-specific API operations                   |
| `src/users.ts`               | Users page application and UI logic              |
| `src/details.ts`             | User details page application and UI logic       |
| `dist/`                      | Compiled JavaScript generated from TypeScript    |
| `css/`                       | Application styling                              |
| `index.html`                 | GitHub users list page                           |
| `details.html`               | User details page                                |
| `screenshots/`               | Screenshots demonstrating application output     |

---

# JavaScript to TypeScript Migration

The original project was written in JavaScript. The project was migrated to TypeScript while keeping the existing HTML and CSS functionality intact.

The migration included:

* Adding TypeScript interfaces for GitHub API responses.
* Adding explicit types to variables and function parameters.
* Typing DOM elements.
* Typing event handlers.
* Adding application state types.
* Creating a generic API helper.
* Creating a reusable `ApiResult<T>` union type.
* Moving GitHub API logic into an `ApiService` class.
* Using TypeScript utility types.
* Separating API, application, DOM, and utility responsibilities.
* Compiling TypeScript into JavaScript using `tsconfig.json`.

The browser uses the compiled files from the `dist/` directory rather than executing the `.ts` files directly.


        TypeScript source
            ↓
            tsc
            ↓
        Compiled JavaScript
            ↓
        Browser will eventually use this

---

# TypeScript Configuration

The project uses `tsconfig.json` to configure TypeScript compilation.

Important configuration choices include:

* `strict: true` — enables strict type checking.
* `noImplicitAny: true` — prevents variables and parameters from implicitly receiving the `any` type.
* `rootDir` — identifies the TypeScript source directory.
* `outDir` — specifies the directory where compiled JavaScript is generated.
* ES module configuration is used so the compiled JavaScript can use `import` and `export`.

The TypeScript source code is compiled using:

```bash
npx tsc
```

The generated JavaScript is placed inside the `dist/` directory.
        src/
        └── types/
            └── github.ts

                ↓ npx tsc

        dist/
        └── types/
            ├── github.js
            └── github.js.map

---

The HTML pages load the compiled modules:

```html
<script type="module" src="./dist/users.js"></script>
```

and:

```html
<script type="module" src="./dist/details.js"></script>
```

---

# GitHub API Types

The GitHub API response models are defined in:

```text
src/types/github.ts
```

## GitHubUser

```ts
export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name?: string | null;
    public_repos?: number;
}
```

Optional properties are used where the API response may not provide the value.

## GitHubFollower

```ts
export interface GitHubFollower {
    login: string;
    id: number;
    avatar_url: string;
}
```

## GitHubRepository

```ts
export interface GitHubRepository {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
}
```

---

# Generic API Helper

The reusable API helper is located in:

```text
src/utils/api.ts
```

It uses a generic type parameter:

```ts
apiRequest<T>()
```

This allows the same function to work with different API response types.

For example:

```ts
apiRequest<GitHubUser[]>(url);
```

returns:

```ts
Promise<ApiResult<GitHubUser[]>>
```

while:

```ts
apiRequest<GitHubRepository[]>(url);
```

returns:

```ts
Promise<ApiResult<GitHubRepository[]>>
```

The helper also checks:

```ts
response.ok
```

before processing the response.

This prevents unsuccessful HTTP responses from being treated as successful data.

---

# ApiResult Union Type

The project uses a discriminated union to represent API success and failure:

```ts
export type ApiResult<T> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        error: string;
    };
```

The `success` property acts as the discriminator.

For a successful request:

```ts
if (result.success) {
    result.data;
}
```

TypeScript knows that `data` exists.

For a failed request:

```ts
if (!result.success) {
    result.error;
}
```

TypeScript knows that `error` exists.

This provides type-safe handling of API results without relying on `any`.

       apiRequest<T>()
        ↓
       fetch()
        ↓
     HTTP successful?
   ↙                 ↘
 YES                   NO
  ↓                     ↓
data                   error
  ↓                     ↓
{success: true,  OR  {success: false,
          data}                error}

---

# ApiService

GitHub-specific API operations are separated into:

```text
src/services/apiService.ts
```

The `ApiService` provides methods for:

```ts
getUsers()
getFollowers(username)
getRepositories(username)
```

The service uses the generic `apiRequest<T>()` helper.

For example:

```ts
async getUsers() {
    return apiRequest<GitHubUser[]>(
        `${this.githubApiBaseUrl}/users`
    );
}
```

This keeps API communication separate from DOM manipulation and UI rendering.

---

# Dependency Injection

The `ApiService` is passed into application functions rather than being unnecessarily created inside those functions.

Example:

```ts
const apiService = new ApiService();

loadUsers(apiService);
```

The function receives the service:

```ts
async function loadUsers(apiService: ApiService) {
    const result = await apiService.getUsers();
}
```

This makes the application logic less tightly coupled to the service implementation and makes the dependency explicit.

---

# DOM Typing

DOM elements are explicitly typed using TypeScript DOM types.

Examples include:

```ts
HTMLElement
HTMLInputElement
HTMLButtonElement
HTMLImageElement
HTMLUListElement
```

A reusable helper is used to retrieve DOM elements with the correct type:

```ts
getElement<HTMLImageElement>("user-avatar");
```

This prevents errors where a generic `HTMLElement` is used for an element that requires properties specific to another DOM type.

For example, an `HTMLInputElement` provides:

```ts
input.value
```

while an `HTMLImageElement` provides:

```ts
image.src
image.alt
```

---

# Application State Types

Application state is explicitly typed.

For example:

```ts
let users: GitHubUser[] = [];
let filteredUsers: GitHubUser[] = [];
```

This ensures that the application cannot accidentally assign unrelated values to the user collections.

Pagination and filter-related values are also explicitly typed.

---

# Utility Types and Data Transformation

The application uses TypeScript utility types to avoid unnecessarily duplicating interfaces.

For example:

```ts
export type DisplayUser = Pick<
    GitHubUser,
    "login" | "id" | "avatar_url"
>;
```

The UI only needs these three properties from the larger `GitHubUser` interface.

Similarly:

```ts
export type DisplayRepository = Pick<
    GitHubRepository,
    "name" | "description"
>;
```

The repository UI does not need every property returned by GitHub.

API data is transformed before being passed to the UI.

Example:

```ts
function transformUsers(
    users: GitHubUser[]
): DisplayUser[] {
    return users.map(user => ({
        login: user.login,
        id: user.id,
        avatar_url: user.avatar_url
    }));
}
```

Repositories are transformed in the same way:

```ts
function transformRepositories(
    repositories: GitHubRepository[]
): DisplayRepository[] {
    return repositories.map(repository => ({
        name: repository.name,
        description: repository.description
    }));
}
```

This keeps the UI models focused only on the data required for display.

---

# User Details and Parallel Requests

The details page fetches followers and repositories independently.

The requests are started in parallel:

```ts
const [followers, repositories] =
    await Promise.allSettled([
        apiService.getFollowers(username),
        apiService.getRepositories(username)
    ]);
```

The application then checks the status of each request independently.

                    Promise.allSettled
                          │
             ┌────────────┴────────────┐
             ↓                         ↓
        Followers                  Repositories
             │                         │
       check status              check status
             │                         │
       check success             check success
             │                         │
             ↓                         ↓
       process independently     process independently

This means a failure in one request does not unnecessarily hide successfully loaded data from the other request.

For example:

```text
Followers       Failed
Repositories    Successful
```

The repositories can still be displayed while an error message is shown for the followers section.

---

# Why Promise.allSettled() Was Used

`Promise.all()` is appropriate when all operations are required to succeed.

If one promise rejects, `Promise.all()` rejects the entire operation.

The followers and repositories requests are independent, so this behavior is not ideal for the details page.

`Promise.allSettled()` was chosen because it provides the result of every request independently.

This allows the application to handle:

```text
Followers       Successful
Repositories    Successful
```
![image](/screenshots/bothsuccessfull.png)

```text
Followers       Failed
Repositories    Successful
```
![image](/screenshots/Onlyreposuccessfull.png)

```text
Followers       Successful
Repositories    Failed
```
![image](/screenshots/Onlyfollowersuccessfull.png)

and:

```text
Followers       Failed
Repositories    Failed
```
![image](/screenshots/bothfail.png)

without unnecessarily discarding successful results.

---

# Loading and Error Handling

The application maintains loading skeletons for both the users list and details page.

The loading state is displayed before an API request:

```ts
showLoading();
```

and removed in a `finally` block:

```ts
finally {
    hideLoading();
}
```

Using `finally` ensures that loading UI cleanup occurs whether the operation succeeds or fails.

## Error handling

Errors are handled at multiple levels.

### HTTP/API errors

The generic API helper checks:

```ts
response.ok
```

and returns:

```ts
{
    success: false,
    error: "..."
}
```

### Independent details requests

Followers and repositories are handled independently using `Promise.allSettled()`.

A failure in one section does not hide successfully loaded data from the other section.

### Unexpected errors

Unexpected errors are caught using:

```ts
try {
    // application logic
} catch (error) {
    console.error(error);
    showError();
}
```

This prevents failures from being silently ignored.

    showLoading()
        ↓
    validate username/id
        ↓
    Promise.allSettled()
        ↓
    ┌─────────────────┬──────────────────┐
    │ followers       │ repositories     │
    │ success/error   │ success/error    │
    └─────────────────┴──────────────────┘
        ↓
    store data + errors
        ↓
    render profile
        ↓
    render followers + follower error
        ↓
    render repositories + repository error
        ↓
    showDetails()
        ↓
    finally → hideLoading()

---

# Composition Instead of Inheritance

The project uses composition instead of inheritance.

There is no unnecessary inheritance hierarchy such as:

```ts
class UsersPage extends ApiService
```

Instead, individual responsibilities are separated and combined through composition.

The application uses:

```text
Application Logic
       │
       ├── ApiService
       │      │
       │      └── apiRequest<T>()
       │
       └── DOM helpers
```

Responsibilities are separated as follows:

* `ApiService` handles GitHub API operations.
* `apiRequest<T>()` handles generic HTTP requests.
* `dom.ts` handles reusable DOM access.
* `users.ts` handles users-page application logic.
* `details.ts` handles user-details application logic.
* Type definitions are kept in `types/github.ts`.

This makes the code easier to maintain and keeps individual components focused on a single responsibility.

---

# Running the Project

## 1. Install dependencies

If dependencies have not already been installed:

```bash
npm install
```

## 2. Compile TypeScript

From the project root:

```bash
npx tsc
```

This generates the JavaScript files inside:

```text
dist/
```

## 3. Run using a local HTTP server

The application should be served through a local development server rather than opened directly using `file://`.

For example, VS Code Live Server can be used.

Open:

```text
index.html
```

through the local server.

The browser loads the compiled JavaScript from:

```text
dist/users.js
```

and:

```text
dist/details.js
```

using ES modules.

## 4. Recompile after TypeScript changes

Whenever a `.ts` file is modified:

```bash
npx tsc
```

Then refresh the application.

The `.js` files inside `dist/` are generated files and should not be manually edited.

---

# Application Features

## Users Page

The users page provides:

* GitHub user listing.
* Total fetched user count.
* Minimum login-length filtering.
* Pagination.
* Five users per page.
* Loading skeleton.
* Empty-state handling.
* Error handling.
* Navigation to user details.

## User Details Page

The details page provides:

* Selected user information.
* User avatar.
* User ID.
* First 5 followers.
* First 5 repositories.
* Independent follower/repository error handling.
* Loading skeleton.
* Empty-state handling.

---

# Testing

The application was tested after migration to TypeScript.

The following scenarios were verified:

* Users load successfully.
* Pagination works.
* Login-length filtering works.
* User details load correctly.
* Followers load correctly.
* Repositories load correctly.
* Loading skeleton appears while requests are in progress.
* Missing URL parameters trigger the appropriate error handling.
* Followers can fail without hiding successfully loaded repositories.
* Repositories can fail without hiding successfully loaded followers.
* The application loads the compiled JavaScript from `dist/`.
* ES module imports work correctly in the browser.

---

