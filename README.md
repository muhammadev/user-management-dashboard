# User Management Dashboard

A Vue 3 application for managing users, roles, and permissions. This project demonstrates how to build a Single Page Application (SPA) using Vue 3 with the Composition API, Pinia for state management, MSW for API mocking, and Vitest for testing. Form validation is implemented with yup, and error messages are displayed on a per‑field basis without modifying the underlying PrimeVue components.

---

## Table of Contents

- [User Management Dashboard](#user-management-dashboard)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture and Design Decisions](#architecture-and-design-decisions)
    - [Vue 3 \& Composition API](#vue-3--composition-api)
    - [Pinia for State Management](#pinia-for-state-management)
    - [MSW for API Mocking](#msw-for-api-mocking)
    - [Vitest for Testing](#vitest-for-testing)
    - [Vee‑Validate \& Yup for Form Validation](#veevalidate--yup-for-form-validation)
    - [Architectural Approach](#architectural-approach)
  - [Setup and Run Instructions](#setup-and-run-instructions)
  - [Testing and Code Coverage](#testing-and-code-coverage)
    - [Running Tests](#running-tests)
    - [Test Coverage](#test-coverage)
  - [Answers to Architecture Questions](#answers-to-architecture-questions)

---

## Features

- **User Authentication:**
  - Login and logout functionality using a composable (`useAuthService`) that integrates with a Pinia store.
  - JWT token handling using the `jose` library.
- **User CRUD Operations:**
  - Fetch all users, fetch single user, update, and delete a user.
  - Bulk operations: bulk update roles/status and bulk delete users.
- **Session Management:**
  - Session timeout detection using a composable (`useSessionTimeout`) that periodically checks the JWT expiration.
- **Role-Based Access Control (RBAC):**
  - Conditional rendering of UI elements (e.g., edit, delete buttons) based on the logged-in user’s permissions.
  - A dedicated composable (`usePermissionsService`) to verify if a user has a specific permission.
- **Form Validation:**
  - Form-level validation using yup.
  - Field-level error messages are displayed directly below each form field without altering PrimeVue InputText and Select components.
- **Mock API:**
  - MSW is used to simulate API endpoints in both development and test environments.
- **Testing:**
  - Unit tests for Pinia stores, composables, and components using Vitest.
  - Coverage reporting using Vitest’s coverage tools.

---

## Architecture and Design Decisions

### Vue 3 & Composition API

- **Reason:** Modern, modular, and flexible approach to building components.
- **Benefit:** Encourages code reuse by encapsulating logic in composables (e.g., `useAuthService`, `usePermissionsService`, `useSessionTimeout`).

### Pinia for State Management

- **Reason:** Simpler and more type-safe than Vuex.
- **Benefit:** Centralizes global state (such as user authentication data) and integrates seamlessly with Vue 3.

### MSW for API Mocking

- **Reason:** Allows for realistic API simulation during development and tests without a live backend.
- **Benefit:** Improves test reliability by intercepting HTTP requests and returning controlled responses.

### Vitest for Testing

- **Reason:** Fast, modern test runner built for Vite projects.
- **Benefit:** Provides a consistent testing environment with support for code coverage and integration with MSW (via the Node server).

### Vee‑Validate & Yup for Form Validation

- **Reason:** Schema-based validation allows for clear, declarative form validation rules.
- **Benefit:** Errors are handled on a per‑field basis and displayed below the corresponding fields without altering PrimeVue components.

### Architectural Approach

- **Separation of Concerns:**
  - Components remain focused on UI.
  - Business logic (authentication, permission checks, session timeout) is encapsulated in composables.
  - State management is handled in Pinia stores.
- **Testing Strategy:**
  - Stores and composables are unit tested with Vitest.
  - Components are tested using Vue Test Utils.
  - MSW is configured globally (via a separate `setup.ts`) to simulate API endpoints in tests.

---

## Setup and Run Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/muhammadev/user-management-dashboard.git
   cd user-management-dashboard
   ```

2. **Install Dependencies:**

   Make sure you have Node.js (v18 or later) installed, then run:

   ```bash
   npm install
   ```

3. **Development Server:**

   Run the development server (Vite):

   ```bash
   npm run dev
   ```

   The app will typically run on [http://localhost:5173](http://localhost:5173).

4. **Production Build:**

   To build for production:

   ```bash
   npm run build
   ```

5. **Preview the Production Build:**

   After building, you can preview the production build:

   ```bash
   npm run preview
   ```

---

## Testing and Code Coverage

### Running Tests

This project uses Vitest as the test runner, and MSW is configured in a separate `setup.ts` file for Node-based API mocking. To run the tests, use:

```bash
npm run test
```

### Test Coverage

To run tests with coverage reporting:

```bash
npm run test:coverage
```

Coverage reports will be generated in the `/coverage` directory. These reports provide metrics such as line coverage, branch coverage, and function coverage.

---

## Answers to Architecture Questions

1. **How would you optimize API calls in this application for performance?**

   - Optimizing API calls requires a mix of techniques. You can start by applying debouncing or throttling on user actions like searches or filtering, which helps avoid sending unnecessary requests.
   - Also, lazy loading non-critical data and implementing pagination for large datasets are also effective performance boosters.
   - Another essential strategy is to use an interceptor on your Axios instance. This allows you to centralize common optimizations like setting timeouts, handling retries, and logging errors for debugging, ensuring every API call is uniformly optimized without duplicating code across services.

2. **Describe your approach to handling shared logic between components.**

   - Shared logic is handled by encapsulating it into composables and stores (Pinia, Vuex, etc). Composables let you extract and reuse business logic across components which makes your code easier to maintain and reuse.
   - For data that needs to be globally shared, I rely on Pinia stores. Pinia provides a centralized, reactive store that's type-safe and straightforward to maintain.

3. **How would you implement client-side data caching for this dashboard?**

   - Client-side data caching is achieved by combining local state management with browser storage. By storing frequently accessed data like user lists or roles in Pinia stores, the application fetches this data only once per session and reuses it until it's explicitly invalidated. This approach minimizes redundant API calls and significantly reduces loading times. Component tests verify that UI elements respond correctly to state changes and user interactions.

4. **What strategy would you use to scale this application if it needed to support hundreds of different user permission types?**

   - To scale user permissions, I’d implement a role-based access control (RBAC) model paired with a capability-based system. Instead of hard-coding checks for every permission, I would define roles along with their associated capabilities. Then, using a composable or a dedicated service, you can dynamically determine if a user’s role includes the required permissions. This approach simplifies maintenance and makes it easier to expand or adjust permissions as the application grows.

5. **Explain your testing strategy and how you decided what to test.**

   - My testing strategy combines unit tests for individual functions and stores with component tests using Vue Test Utils and Vitest.
   - I prioritize testing areas that are most likely to break (e.g., API integration points, form validations, and state updates) and where bugs would have a high impact on user experience.

6. **How would you handle offline capabilities in this application?**
   - To ensure the application remains operational even when there's no network connection, I'd implement a Progressive Web App (PWA) strategy. This means leveraging service workers to cache static assets and API responses, so that users can continue to interact with the app offline. For data that changes dynamically, I would use browser storage options—like localStorage to temporarily hold user data and any updates, then synchronize these changes with the server once connectivity is restored.

---
