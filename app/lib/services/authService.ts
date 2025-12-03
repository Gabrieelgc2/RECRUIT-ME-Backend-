// Variáveis de ambiente para a API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  role: string;
  profileComplete?: number;
}

interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// ============= AUTENTICAÇÃO =============

/**
 * Fazer login no sistema
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer login');
  }

  const data: AuthResponse = await response.json();

  // Salvar token no localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
}

/**
 * Registrar novo usuário
 */
export async function signupUser(data: SignupData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao registrar usuário');
  }

  const result: AuthResponse = await response.json();

  // Salvar token no localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
  }

  return result;
}

/**
 * Fazer logout
 */
export async function logoutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

/**
 * Obter perfil do usuário autenticado
 */
export async function getUserProfile(): Promise<User> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      logoutUser();
      throw new Error('Sessão expirada');
    }
    throw new Error('Erro ao obter perfil');
  }

  const data = await response.json();
  return data.user;
}

/**
 * Atualizar perfil do usuário
 */
export async function updateUserProfile(
  profileData: Partial<User>
): Promise<User> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar perfil');
  }

  const data = await response.json();

  // Atualizar usuário no localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data.user;
}

/**
 * Obter token salvo
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Obter usuário salvo
 */
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Verificar se usuário está autenticado
 */
export function isAuthenticated(): boolean {
  return getStoredToken() !== null;
}
