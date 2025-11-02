# Frontend Folder Structure

This document describes the scalable folder structure for the frontend application.

## 📁 Directory Structure

```
src/
├── app/                    # Expo Router app directory (pages/screens)
│   ├── _layout.jsx        # Root layout
│   └── index.jsx          # Home page
│
├── components/            # Reusable React components
│   ├── layout/           # Layout components
│   │   ├── BaseLayout.jsx    # Base layout wrapper
│   │   ├── Container.jsx     # Content container
│   │   └── index.js         # Exports
│   ├── navigation/       # Navigation components
│   │   ├── Header.jsx        # Reusable header
│   │   ├── Footer.jsx        # Reusable footer
│   │   └── index.js         # Exports
│   ├── ui/              # UI components (buttons, inputs, etc.)
│   │   ├── Button.jsx        # Button component
│   │   └── index.js         # Exports
│   └── index.js         # Central component exports
│
├── stores/              # Zustand state management
│   ├── authStore.js        # Authentication store
│   ├── appStore.js         # Application state store
│   └── index.js           # Store exports
│
├── hooks/               # Custom React hooks
│   ├── useAuth.js         # Authentication hook
│   └── index.js          # Hook exports
│
├── services/           # API services and external integrations
│   ├── api.js            # API client and methods
│   └── index.js         # Service exports
│
├── utils/              # Utility functions
│   └── index.js         # Utility exports
│
├── constants/          # Application constants
│   └── index.js         # Constants exports
│
├── config/             # Configuration files
│   └── index.js         # Config exports
│
└── global.css          # Global styles
```

## 🏗️ Architecture Overview

### Components

- **Layout Components**: BaseLayout, Container for consistent page structure
- **Navigation Components**: Header, Footer for consistent navigation
- **UI Components**: Reusable UI elements (Button, Input, etc.)

### State Management (Zustand)

- **authStore**: Manages user authentication state
- **appStore**: Manages global application state (theme, loading, errors, notifications)

### Hooks

- Custom hooks for common functionality (useAuth, etc.)

### Services

- API service layer for backend communication
- Centralized API client with authentication

### Utils

- Pure utility functions (date formatting, validation, etc.)

### Constants

- Application-wide constants (API endpoints, routes, etc.)

### Config

- Configuration settings (API URLs, app name, etc.)

## 📝 Usage Examples

### Using Zustand Stores

```javascript
import { useAuthStore } from "../stores";
// or
import { useAuth } from "../hooks";

function MyComponent() {
  const { user, isAuthenticated, login } = useAuth();

  // or direct store access
  const user = useAuthStore((state) => state.user);
}
```

### Using Layout Components

```javascript
import { BaseLayout, Container } from '../components/layout';
import { Header, Footer } from '../components/navigation';

export default function MyPage() {
  return (
    <BaseLayout
      showHeader={true}
      showFooter={true}
      header={<Header logo="App Name" navItems={[...]} />}
      footer={<Footer />}
    >
      <Container>
        {/* Your content */}
      </Container>
    </BaseLayout>
  );
}
```

### Using API Service

```javascript
import { api } from "../services";

// GET request
const data = await api.get("/users");

// POST request
const result = await api.post("/users", { name: "John" });
```

## 🔄 Adding New Features

### Adding a New Store

1. Create file in `src/stores/` (e.g., `userStore.js`)
2. Export from `src/stores/index.js`
3. Use `create` from Zustand

### Adding a New Component

1. Create file in appropriate folder (`layout/`, `navigation/`, `ui/`)
2. Export from folder's `index.js`
3. Export from main `src/components/index.js`

### Adding a New Hook

1. Create file in `src/hooks/`
2. Export from `src/hooks/index.js`

## 🎯 Best Practices

1. **Component Organization**: Group related components in subfolders
2. **Exports**: Always use index.js files for clean imports
3. **Naming**: Use PascalCase for components, camelCase for utilities
4. **Documentation**: Add JSDoc comments to exported functions/components
5. **State Management**: Use Zustand stores for global state, local state for component-specific state
6. **Reusability**: Create reusable components in `components/ui/`
7. **Constants**: Define all magic strings/numbers in `constants/`

## 🚀 Team Guidelines

- All team members should follow this structure
- When in doubt, ask before creating new top-level folders
- Keep components focused and reusable
- Use the provided layout and navigation components for consistency
