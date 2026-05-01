import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiPost } from '@/lib/api';

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiPost<any, { email: string; password: string }>(
        '/users/login',
        { email, password }
      );
      
      const userData: User = {
        _id: response._id,
        id: response._id,
        name: response.name,
        email: response.email,
        phone: response.phone || '',
        role: response.role || 'customer',
      };
      
      setUser(userData);
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    try {
      const response = await apiPost<any, { name: string; email: string; passwordHash: string; phone?: string }>(
        '/users',
        { name, email, passwordHash: password, phone }
      );
      
      const userData: User = {
        _id: response._id,
        id: response._id,
        name: response.name,
        email: response.email,
        phone: response.phone || phone,
        role: response.role || 'customer',
      };
      
      setUser(userData);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    // Clear cart from localStorage when user logs out
    localStorage.removeItem('cart');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
