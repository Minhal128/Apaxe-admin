import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../lib/api';
import { toast } from 'react-toastify';

// Allowed roles for this panel (Admin = SUPER_MASTER, also allow ADMIN for testing)
const ALLOWED_ROLES = ['ADMIN', 'SUPER_MASTER'];

// Deployed URLs for redirection (only redirect MASTER users)
const ROLE_URLS: Record<string, string> = {
    ADMIN: window.location.origin, // SuperAdmin can use this app too
    SUPER_MASTER: window.location.origin, // Admin stays on this app
    MASTER: 'https://forexmaster.vercel.app',
};

// Types
interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    permissions: {
        canTrade: boolean;
        canCreateUsers: boolean;
        canCreditDebit: boolean;
        canBanScripts: boolean;
        canOverrideMargins: boolean;
        canOverrideLimits: boolean;
        canViewReports: boolean;
        canManageSystem: boolean;
    };
    createdAt: string;
    lastLoginAt?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
    login: (credentials: { email: string; password: string; expectedRole?: string }) => Promise<void>;
    logout: () => void;
}

// Initial state
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('admin_token'),
    isLoading: true,
    isAuthenticated: false,
};

// Action types
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGIN_FAILURE' }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, isLoading: true };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isLoading: false,
                isAuthenticated: true,
            };
        case 'LOGIN_FAILURE':
            return { ...state, user: null, token: null, isLoading: false, isAuthenticated: false };
        case 'LOGOUT':
            return { ...state, user: null, token: null, isLoading: false, isAuthenticated: false };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for token in URL (for cross-app login)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            localStorage.setItem('admin_token', tokenFromUrl);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Initialize auth state on app load
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('admin_token');
            console.log('Initializing auth, token exists:', !!token);

            if (token) {
                try {
                    const response = await authApi.getProfile();
                    console.log('Profile loaded:', response.data.data.user.email);
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: { user: response.data.data.user, token },
                    });
                } catch (error) {
                    console.error('Failed to initialize auth:', error);
                    localStorage.removeItem('admin_token');
                    dispatch({ type: 'LOGIN_FAILURE' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (credentials: { email: string; password: string; expectedRole?: string }) => {
        try {
            dispatch({ type: 'LOGIN_START' });
            console.log('Attempting login for:', credentials.email);

            const response = await authApi.login({ email: credentials.email, password: credentials.password });
            const { user, accessToken } = response.data.data;
            console.log('Login response - User role:', user.role);

            // Check if the user's role matches this app
            if (!ALLOWED_ROLES.includes(user.role)) {
                // Redirect to the correct app with the token
                const targetUrl = ROLE_URLS[user.role];
                if (targetUrl && targetUrl !== window.location.origin) {
                    toast.info(`Redirecting to ${user.role} dashboard...`);
                    window.location.href = `${targetUrl}/signin?token=${accessToken}`;
                    return;
                }
                throw new Error('Access denied. You do not have permission to access this panel.');
            }

            localStorage.setItem('admin_token', accessToken);
            console.log('Token stored successfully');

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token: accessToken },
            });

            toast.success(`Welcome back, ${user.firstName || user.email}!`);
        } catch (error: any) {
            dispatch({ type: 'LOGIN_FAILURE' });

            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            console.error('Login failed:', errorMessage);
            toast.error(errorMessage);

            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('admin_token');
            dispatch({ type: 'LOGOUT' });
            toast.info('You have been logged out');
            // Redirect to the admin app
            window.location.href = 'https://forexadmin.vercel.app';
        }
    };

    const value: AuthContextType = {
        ...state,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
