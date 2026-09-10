import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Role } from '../config/institutions';

interface AuthState {
  institutionName: string | null;
  role: Role | null;
  walletAddress: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (institutionName: string, role: Role, walletAddress: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    institutionName: null,
    role: null,
    walletAddress: null,
    isAuthenticated: false,
  });

  const login = (institutionName: string, role: Role, walletAddress: string) => {
    setAuthState({
      institutionName,
      role,
      walletAddress,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    setAuthState({
      institutionName: null,
      role: null,
      walletAddress: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
