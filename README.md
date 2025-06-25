# SafeDMARC - Secure Email Authentication Platform

A modern React application for managing email security through DMARC, SPF, and DKIM configuration and monitoring with **secure HttpOnly cookie-based authentication**.

## 🔒 Security Architecture

### Authentication System
- **HttpOnly Cookies**: Session management via secure, HttpOnly cookies (no localStorage tokens)
- **CSRF Protection**: Automatic CSRF token handling for Django backend
- **Secure Session Management**: Automatic session refresh and cleanup
- **Role-Based Access Control**: Granular permissions system

### API Security
- **Credentials Included**: All requests include cookies automatically
- **Error Handling**: Comprehensive error handling with automatic logout on 401
- **Network Resilience**: Fallback handling for network issues
- **Request Interceptors**: Automatic CSRF token injection

## 🏗️ Project Architecture

### Core Structure
```
src/
├── lib/
│   ├── constants.js          # Single source of truth for all endpoints/config
│   ├── axios.js              # Secure HTTP client with cookie handling
│   └── api/                  # API service modules
│       ├── auth.js           # Authentication endpoints
│       └── domains.js        # Domain management endpoints
├── hooks/
│   └── useAuth.js            # Authentication state management
├── context/
│   └── AuthContext.jsx       # Global auth context provider
├── components/
│   └── layout/               # Layout components
├── pages/                    # Route components
├── utils/                    # Utility functions
└── ProtectedRoute.jsx        # Route protection with permissions
```

### Business Logic Model
- **Client** (Company) → Multiple **Domains** + **Users**
- **Domain** → **SPF**, **DKIM**, **DMARC** records
- **Tags** → Domain categorization and filtering
- **Role-Based Access**:
  - Super Admin: Full system access
  - Client Admin: Company management
  - User: Limited access based on permissions
  - Read-Only: View-only access

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Backend API running (or use DEV mode)

### Installation
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Configuration
```env
# API Configuration
VITE_API_BASE_URL=/api/v1

# Development Mode (uses mock data when backend unavailable)
VITE_USE_MOCK_DATA=true
VITE_DEV_MODE=true
```

## 🔧 Development vs Production

### Development Mode
- **Mock Data**: Automatic fallback when backend unavailable
- **Pre-filled Forms**: Login form pre-populated for testing
- **Console Logging**: Detailed request/response logging
- **Error Tolerance**: Graceful handling of network issues

### Production Mode
- **Real Backend**: Full API integration
- **Secure Cookies**: HttpOnly session management
- **Error Handling**: User-friendly error messages
- **Performance Optimized**: Minimal logging and optimizations

## 🛡️ Security Features

### Cookie-Based Authentication
```javascript
// Automatic cookie inclusion
withCredentials: true

// CSRF protection
headers: {
  'X-CSRFToken': getCsrfToken(),
  'X-Requested-With': 'XMLHttpRequest'
}
```

### Protected Routes
```javascript
// Permission-based protection
<ProtectedRoute requiredPermission="view_domains">
  <MyDomains />
</ProtectedRoute>

// Admin-only routes
<ProtectedRoute adminOnly>
  <Settings />
</ProtectedRoute>
```

### Automatic Session Management
- **Auto-logout on 401**: Automatic redirect to login
- **Session Refresh**: Transparent session renewal
- **Cookie Cleanup**: Secure logout with cookie clearing
- **Cross-tab Sync**: Session state synchronized across tabs

## 📡 API Integration

### Centralized Configuration
All API endpoints defined in `src/lib/constants.js`:
```javascript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_LOGOUT_REFRESH: `${API_BASE_URL}/auth/auth/`,
    PROFILE: `${API_BASE_URL}/auth/profile/`,
    // ...
  },
  PANEL: {
    DOMAINS: `${API_BASE_URL}/panel/dominios/`,
    DOMAIN_DETAIL: (id) => `${API_BASE_URL}/panel/dominios/${id}/`,
    // ...
  }
};
```

### Secure HTTP Client
```javascript
// Automatic cookie handling
const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);

// Automatic error handling
// 401 → Redirect to login
// 403 → Permission denied
// 500 → Server error message
```

## 🎯 Key Features

### Dashboard
- **Real-time Domain Status**: Live monitoring of domain security
- **Compliance Scoring**: Automated security assessment
- **Quick Actions**: One-click domain management
- **Statistics Overview**: Comprehensive security metrics

### Domain Management
- **CRUD Operations**: Full domain lifecycle management
- **DNS Record Management**: SPF, DKIM, DMARC configuration
- **Bulk Operations**: Mass domain updates
- **Tag-based Organization**: Flexible domain categorization

### User Management (Admin)
- **Role Assignment**: Granular permission control
- **Company Management**: Multi-tenant organization
- **Audit Logging**: Complete action tracking
- **Access Control**: Fine-grained security permissions

### Security Monitoring
- **Real-time DNS Validation**: Live record checking
- **Threat Intelligence**: Security threat analysis
- **Compliance Reporting**: Automated security reports
- **Alert System**: Proactive security notifications

## 🔄 State Management

### Authentication Flow
1. **Login**: POST to `/auth/auth/` with credentials
2. **Session**: HttpOnly cookie automatically set
3. **Requests**: Cookies included automatically
4. **Logout**: POST to `/auth/auth/` + cookie cleanup
5. **Auto-logout**: 401 responses trigger logout

### Error Handling
- **Network Errors**: Graceful degradation in DEV mode
- **Authentication Errors**: Automatic logout and redirect
- **Validation Errors**: User-friendly form feedback
- **Server Errors**: Informative error messages

## 🧪 Testing

### Development Testing
```bash
# Start with mock data
VITE_USE_MOCK_DATA=true npm run dev

# Test with real backend
VITE_USE_MOCK_DATA=false npm run dev
```

### Authentication Testing
- **DEV Mode**: Login form pre-filled for quick testing
- **Mock Users**: Predefined user roles and permissions
- **Session Simulation**: Cookie-based session simulation

## 📦 Build & Deploy

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```env
# Production configuration
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_USE_MOCK_DATA=false
VITE_DEV_MODE=false
```

## 🔍 Troubleshooting

### Common Issues

**Authentication not working:**
- Check backend CORS configuration
- Verify cookie domain settings
- Ensure `withCredentials: true` in requests

**Network errors in development:**
- Set `VITE_USE_MOCK_DATA=true` for offline development
- Check backend server is running
- Verify API_BASE_URL configuration

**Permission denied errors:**
- Check user role and permissions
- Verify protected route configuration
- Review backend permission system

### Debug Mode
Enable detailed logging:
```javascript
// In development, all requests/responses are logged
console.log('🔄 GET /api/v1/auth/profile', response.data);
```

## 🤝 Contributing

1. **Security First**: Always use HttpOnly cookies for authentication
2. **Constants Usage**: Use `constants.js` for all endpoints
3. **Error Handling**: Implement comprehensive error handling
4. **Permission Checks**: Always verify user permissions
5. **Mock Data**: Provide development fallbacks

## 📄 License

This project is proprietary software. All rights reserved.