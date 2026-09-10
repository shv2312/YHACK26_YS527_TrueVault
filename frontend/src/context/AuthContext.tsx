import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Role } from '../config/institutions';
import { authService } from '../services/api';

interface AuthState {
  institutionName: string | null;
  role: Role | null;
  walletAddress: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('truevault_token');
        if (token) {
          const data = await authService.getCurrentUser();
          setAuthState({
            institutionName: 'TrueVault Integrated',
            role: (data.user.role as Role) || 'ADMIN',
            walletAddress: data.user.username,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };
    checkAuth();
  }, []);

  const login = (institutionName: string, role: Role, walletAddress: string) => {
    setAuthState({
      institutionName,
      role,
      walletAddress,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({
      institutionName: null,
      role: null,
      walletAddress: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  if (authState.isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

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
