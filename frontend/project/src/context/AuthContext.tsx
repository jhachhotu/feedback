import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'manager',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'employee',
    managerId: '1',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    role: 'employee',
    managerId: '1',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david@company.com',
    role: 'employee',
    managerId: '1',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('feedbackUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("http://localhost:8000/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Fetch user info
      const userRes = await fetch("http://localhost:8000/auth/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      if (!userRes.ok) return false;
      const user = await userRes.json();
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('feedbackUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};