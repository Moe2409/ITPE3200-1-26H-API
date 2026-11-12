import { LoginDto, RegisterDto } from '../types/auth';
import { User } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL;

export interface AuthResponse {
    token: string;
}

export interface RegisterResponse {
    message?: string;
    [key: string]: unknown;
}

export const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token'); 

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        // 1. Handle ASP.NET Core Validation errors ({ errors: { FieldName: ["msg"] } })
        if (errorData?.errors) {
            const errorMessages = Object.values(errorData.errors)
                .flat()
                .join(', ');
            throw new Error(errorMessages);
        }

        // 2. Handle standard ProblemDetails title or custom message
        throw new Error(errorData?.title || errorData?.message || 'Login failed. Please check your credentials.');
    }

    return response.json();
};

export const register = async (userData: RegisterDto): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        // Handle array of ASP.NET Identity errors: [{ description: "..." }]
        if (Array.isArray(errorData)) {
            const errorMessages = errorData.map((err) => err.description).join(', ');
            throw new Error(errorMessages || 'Registration failed');
        }
        // Handle standard API problem details or generic messages
        throw new Error(errorData?.title || errorData?.message || 'Registration failed');
    }

    return response.json();
};

export const getUserById = async (id: string | number): Promise<User> => {

    const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (errorData?.errors) {
            const errorMessages = Object.values(errorData.errors)
                .flat()
                .join(', ');
            throw new Error(errorMessages);
        }

        throw new Error(errorData?.title || errorData?.message || 'Failed to fetch user data.');
    }

    return response.json();
};
