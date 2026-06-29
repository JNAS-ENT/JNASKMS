import { User } from '../../../types';
import { LoginInput, RegisterInput } from '../validation/schema';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  login: async (data: LoginInput): Promise<User> => {
    await sleep(600);
    // Simulate user lookup or authentication success
    return {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      email: data.email,
      fullName: data.email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: new Date().toISOString(),
    };
  },

  register: async (data: RegisterInput): Promise<User> => {
    await sleep(800);
    return {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      email: data.email,
      fullName: data.fullName,
      role: data.role || 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: new Date().toISOString(),
    };
  }
};
