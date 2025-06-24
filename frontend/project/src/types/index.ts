export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee';
  managerId?: string;
  avatar?: string;
}

export interface Feedback {
  id: string;
  managerId: string;
  employeeId: string;
  strengths: string;
  improvements: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  createdAt: string;
  updatedAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}