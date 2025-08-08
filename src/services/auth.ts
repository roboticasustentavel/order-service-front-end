import { api } from './api';

export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authAPI = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { 
      email, 
      password, 
      full_name: fullName 
    });
    return response.data;
  },

  async signOut(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.user;
  }
};