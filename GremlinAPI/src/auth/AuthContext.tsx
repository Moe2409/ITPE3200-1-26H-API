import { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types/quiz';
import { LoginDto } from '../types/auth';
import * as authService from './AuthService';

interface AuthContextType { // Define the shape of the auth context
    user: User | null;
    token: string | null;
    login: (credentials: LoginDto) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => { // Check token validity on mount and when token changes
    if (!token) {
        setIsLoading(false);
        return;
    }
    try {
        const decodedUser: User = jwtDecode(token);
        if (decodedUser.exp * 1000 > Date.now()) { // Check if the token is expired
        setUser(decodedUser);
        } else { // Token is expired, clear it
        console.warn("Token expired");
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        }
    } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    } finally {
        setIsLoading(false);
    }
    }, [token]);

    const login = async (credentials: LoginDto) => { // Login and store token
        const { token } = await authService.login(credentials);
        localStorage.setItem('token', token);
        const decodedUser: User = jwtDecode(token);
        // console.log(token); // Debugging line to check the token only in development, otherwise security breach in production
        setUser(decodedUser);
        setToken(token);
    };

    const logout = () => { // Clear token and user data
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return ( // Provide context to children
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
        {children}
    </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType { // Custom hook to use auth context
    const context = useContext(AuthContext);
    if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}