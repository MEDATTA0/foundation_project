# Frontend Source Code

This directory contains all the source code for the frontend application.

## Quick Start

### Importing Components

```javascript
// Layout components
import { BaseLayout, Container } from "../components/layout";

// Navigation components
import { Header, Footer } from "../components/navigation";

// UI components
import { Button } from "../components/ui";

// Or import all at once
import { BaseLayout, Header, Footer, Button } from "../components";
```

### Using Stores

```javascript
// Using hooks (recommended)
import { useAuth } from "../hooks";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
}

// Direct store access
import { useAuthStore } from "../stores";

function MyComponent() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
}
```

### Making API Calls

```javascript
import { api } from "../services";

// GET
const users = await api.get("/users");

// POST
const newUser = await api.post("/users", { name: "John" });

// PUT
const updated = await api.put("/users/1", { name: "Jane" });

// DELETE
await api.delete("/users/1");
```

## Folder Guidelines

- **components/**: Reusable UI components
  - Create new components in appropriate subfolder (layout, navigation, ui)
  - Always export from index.js files
- **stores/**: Zustand state management
  - Each store should be a separate file
  - Export from stores/index.js
- **hooks/**: Custom React hooks
  - Wrappers around stores or complex logic
  - Export from hooks/index.js
- **services/**: API and external service integrations
  - Use the centralized api client
- **utils/**: Pure utility functions
  - No side effects, easily testable
- **constants/**: Application constants
  - API endpoints, routes, configuration values
- **config/**: Runtime configuration
  - Environment-based settings
