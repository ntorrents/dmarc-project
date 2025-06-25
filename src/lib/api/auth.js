import axiosInstance from '../axios';
import { API_ENDPOINTS, IS_DEV } from '../constants';
import { clearAuthCookies } from '../axios';

// Mock data for development
const MOCK_USER = {
  id: 1,
  username: 'dev@example.com',
  email: 'dev@example.com',
  first_name: 'Dev',
  last_name: 'User',
  role: 'client_admin',
  company: {
    id: 1,
    name: 'Example Corp',
    email: 'contact@example.com'
  },
  permissions: ['view_domains', 'manage_domains', 'view_users', 'manage_users']
};

export const authAPI = {
  /**
   * Login with email and password
   * Uses HttpOnly cookies for session management
   */
  login: async (credentials) => {
    if (IS_DEV) {
      // Mock login for development
      console.log('🔧 DEV MODE: Mock login', credentials);
      return {
        user: MOCK_USER,
        message: 'Login successful'
      };
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN_LOGOUT_REFRESH, {
        email: credentials.email,
        password: credentials.password,
        action: 'login'
      });

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Logout user and clear session
   */
  logout: async () => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock logout');
      clearAuthCookies();
      return { message: 'Logout successful' };
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN_LOGOUT_REFRESH, {
        action: 'logout'
      });

      // Clear cookies on successful logout
      clearAuthCookies();
      
      return response.data;
    } catch (error) {
      // Even if logout fails on server, clear local cookies
      clearAuthCookies();
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock profile');
      return MOCK_USER;
    }

    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock profile update', profileData);
      return { ...MOCK_USER, ...profileData };
    }

    try {
      const response = await axiosInstance.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock registration', userData);
      return {
        user: { ...MOCK_USER, ...userData },
        message: 'Registration successful'
      };
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * Refresh session (if using JWT with refresh tokens)
   */
  refreshSession: async () => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock session refresh');
      return { message: 'Session refreshed' };
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN_LOGOUT_REFRESH, {
        action: 'refresh'
      });
      return response.data;
    } catch (error) {
      console.error('Session refresh failed:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  checkAuth: async () => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock auth check');
      return { authenticated: true, user: MOCK_USER };
    }

    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
      return { authenticated: true, user: response.data };
    } catch (error) {
      return { authenticated: false, user: null };
    }
  }
};