import { useState } from 'react';
import { useEnterpriseStore } from '../../../store';
import { authApi } from '../api';
import { LoginInput, RegisterInput } from '../validation/schema';

export function useAuth() {
  const { currentUser, setCurrentUser, navigateTo } = useEnterpriseStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authApi.login(data);
      setCurrentUser(user);
      navigateTo('dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authApi.register(data);
      setCurrentUser(user);
      navigateTo('dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigateTo('login');
  };

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    error,
    login,
    register,
    logout
  };
}
