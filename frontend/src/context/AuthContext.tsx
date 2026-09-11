import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Role } from '../config/institutions';
import { authService } from '../services/api';

interface AuthState {
  institutionName: string | null;
  role: Role | null;
  walletAddress: string | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (institutionName: string, role: Role, walletAddress: string, isDemoMode?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    institutionName: null,
    role: null,
    walletAddress: null,
    isAuthenticated: false,
    isDemoMode: false,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const isDemo = localStorage.getItem('truevault_demo_mode') === 'true';
        if (isDemo) {
          if (isMounted) {
            setAuthState({
              institutionName: 'TrueVault Demo',
              role: 'ADMIN',
              walletAddress: '0xDemoWallet',
              isAuthenticated: true,
              isDemoMode: true,
              isLoading: false,
            });
          }
          return;
        }
        
        const token = localStorage.getItem('truevault_token');
        if (token) {
          const data = await authService.getCurrentUser();
          if (isMounted) {
            setAuthState({
              institutionName: 'TrueVault Integrated',
              role: (data.user.role as Role) || 'ADMIN',
              walletAddress: data.user.username,
              isAuthenticated: true,
              isDemoMode: false,
              isLoading: false,
            });
          }
        }
      } catch (error) {
        console.warn('Auth check failed:', error);
      } finally {
        if (isMounted) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const login = (institutionName: string, role: Role, walletAddress: string, isDemoMode: boolean = false) => {
    setAuthState({
      institutionName,
      role,
      walletAddress,
      isAuthenticated: true,
      isDemoMode,
      isLoading: false,
    });
  };

  const logout = async () => {
    localStorage.removeItem('truevault_demo_mode');
    await authService.logout();
    setAuthState({
      institutionName: null,
      role: null,
      walletAddress: null,
      isAuthenticated: false,
      isDemoMode: false,
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
