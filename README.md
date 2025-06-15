# SafeDMARC - Email Security Platform

A modern React application for managing email security through DMARC, SPF, and DKIM configuration and monitoring.

## 🏗️ Project Architecture

This project follows a modern React architecture with TypeScript support, organized into logical layers for maintainability and scalability.

```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components (routes)
├── lib/                # Core business logic and API layer
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── utils/              # Pure utility functions
├── types/              # TypeScript type definitions
└── Routes.jsx          # Application routing configuration
```

## 📁 Directory Structure Explained

### `/src/components/`
**Purpose**: Reusable UI components that can be used across multiple pages.

**What's inside**:
- `layout/` - Layout components (Header, Footer, Navigation)
- `sections/` - Page sections (Hero, Services, Pricing, etc.)
- `modals/` - Modal dialogs and overlays

**Why we need it**: Promotes code reusability, maintains consistent UI patterns, and makes the codebase easier to maintain. Components here should be generic enough to be used in multiple contexts.

### `/src/pages/`
**Purpose**: Top-level page components that represent different routes in the application.

**What's inside**:
- `Dashboard.jsx` - Main dashboard page
- `MyDomains.jsx` - Domain management page
- `Settings.jsx` - User and system settings
- `Login.jsx`, `Signup.jsx` - Authentication pages
- `Contact.jsx`, `Pricing.jsx` - Marketing pages

**Why we need it**: Separates page-level logic from reusable components. Each file represents a distinct route/page in the application, making navigation and code organization clear.

### `/src/lib/`
**Purpose**: Core business logic, API communication, and application configuration.

**What's inside**:
- `api/` - API service modules for different entities
  - `auth.ts` - Authentication API calls
  - `domains.ts` - Domain management API
  - `users.ts` - User management API
  - `companies.ts` - Organization/company API
  - `dnsRecords.ts` - DNS record management
- `axios.ts` - HTTP client configuration with interceptors
- `constants.ts` - Application-wide constants and configuration
- `helpers.ts` - Utility functions for validation, formatting, etc.

**Why we need it**: 
- **Separation of concerns**: Business logic is separated from UI components
- **Centralized API management**: All API calls are organized by entity type
- **Type safety**: TypeScript interfaces ensure data consistency
- **Reusability**: API functions can be used across multiple components
- **Error handling**: Centralized error handling and response processing

### `/src/hooks/`
**Purpose**: Custom React hooks that encapsulate stateful logic and side effects.

**What's inside**:
- `useAuth.ts` - Authentication state management
- `useDomains.ts` - Domain data fetching and management
- `useDNSRecords.ts` - DNS record operations

**Why we need it**:
- **State management**: Encapsulates complex state logic that can be reused
- **Side effect management**: Handles API calls, subscriptions, and cleanup
- **Component simplification**: Keeps components focused on rendering
- **Testing**: Hooks can be tested independently from components
- **Reusability**: Same logic can be used across multiple components

### `/src/context/`
**Purpose**: React Context providers for global state management.

**What's inside**:
- `AuthContext.tsx` - Global authentication state
- `NotificationContext.tsx` - Global notification system

**Why we need it**:
- **Global state**: Manages state that needs to be accessed across the entire app
- **Prop drilling avoidance**: Prevents passing props through multiple component levels
- **Centralized logic**: Authentication and notifications are handled in one place
- **Performance**: Context prevents unnecessary re-renders when used properly

### `/src/utils/`
**Purpose**: Pure utility functions that don't depend on React or application state.

**What's inside**:
- `dmarcChecker.js` - DMARC record validation logic
- `emailSecurityScorer.js` - Email security scoring algorithms
- `ScrollToTop.jsx` - Route change scroll behavior

**Why we need it**:
- **Pure functions**: No side effects, easy to test and reason about
- **Reusability**: Can be used anywhere in the application
- **Business logic**: Contains domain-specific algorithms and calculations
- **Framework independence**: Could be moved to other projects easily

### `/src/types/`
**Purpose**: TypeScript type definitions and interfaces.

**What's inside**:
- `index.ts` - All TypeScript interfaces and types used throughout the app

**Why we need it**:
- **Type safety**: Prevents runtime errors by catching type mismatches
- **Documentation**: Types serve as documentation for data structures
- **IDE support**: Better autocomplete and refactoring capabilities
- **API contracts**: Ensures frontend and backend data structures match

## 🔄 Data Flow Architecture

```
User Interaction → Page Component → Custom Hook → API Service → Backend
                                      ↓
                  Context Provider ← Custom Hook ← API Response
                                      ↓
                  Component Re-render ← Context Consumer
```

## 🛠️ Key Architectural Decisions

### 1. **Layered Architecture**
- **Presentation Layer**: React components and pages
- **Business Logic Layer**: Custom hooks and context
- **Data Access Layer**: API services in `/lib/api/`
- **Utility Layer**: Pure functions in `/utils/`

### 2. **API Organization**
Each entity (domains, users, auth) has its own API module with consistent patterns:
- CRUD operations
- Type-safe interfaces
- Error handling
- Input validation

### 3. **State Management Strategy**
- **Local state**: `useState` for component-specific state
- **Server state**: Custom hooks with API calls
- **Global state**: React Context for authentication and notifications
- **URL state**: React Router for navigation state

### 4. **Development vs Production**
The app includes mock data and development modes:
- `IS_DEV` constant determines environment
- Mock data in hooks for development without backend
- Production API calls when backend is available

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file:
```
VITE_API_URL=http://127.0.0.1:8000/api
```

## 🧪 Development Workflow

1. **Adding a new feature**:
   - Create types in `/src/types/`
   - Add API service in `/src/lib/api/`
   - Create custom hook in `/src/hooks/`
   - Build UI components in `/src/components/`
   - Create page component in `/src/pages/`

2. **Adding a new API endpoint**:
   - Define types in `/src/types/`
   - Add endpoint to constants
   - Implement in appropriate API service
   - Create or update custom hook
   - Use in components

## 📦 Key Dependencies

- **React 18**: UI framework with modern features
- **React Router**: Client-side routing
- **Framer Motion**: Animations and transitions
- **Axios**: HTTP client with interceptors
- **Lucide React**: Icon library
- **Chart.js**: Data visualization
- **Tailwind CSS**: Utility-first CSS framework

## 🔒 Security Features

- Input sanitization in all API calls
- XSS protection through input validation
- JWT token management with automatic refresh
- Protected routes with authentication checks
- CSRF protection through proper headers

## 📈 Performance Optimizations

- Code splitting with React.lazy (ready for implementation)
- Memoization with React.memo where appropriate
- Efficient re-rendering with proper dependency arrays
- Image optimization and lazy loading
- Bundle size optimization with tree shaking

This architecture provides a solid foundation for a scalable, maintainable email security platform while keeping the code organized and developer-friendly.