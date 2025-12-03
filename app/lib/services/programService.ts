import { Program } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ============= PROGRAMAS =============

/**
 * Obter todos os programas
 */
export async function getAllPrograms(filters?: {
  type?: string;
  status?: string;
  tags?: string[];
}): Promise<Program[]> {
  let url = `${API_URL}/programs`;

  if (filters) {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.tags?.length) {
      filters.tags.forEach(tag => params.append('tags', tag));
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erro ao obter programas');
  }

  const data = await response.json();
  return data.programs || [];
}

/**
 * Obter programa por ID
 */
export async function getProgramById(id: string): Promise<Program> {
  const response = await fetch(`${API_URL}/programs/${id}`);

  if (!response.ok) {
    throw new Error('Programa não encontrado');
  }

  const data = await response.json();
  return data.program;
}

/**
 * Criar novo programa (apenas para empresas)
 */
export async function createProgram(
  programData: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Program> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/programs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(programData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar programa');
  }

  const data = await response.json();
  return data.program;
}

/**
 * Atualizar programa
 */
export async function updateProgram(
  id: string,
  programData: Partial<Program>
): Promise<Program> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/programs/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(programData),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar programa');
  }

  const data = await response.json();
  return data.program;
}

/**
 * Deletar programa
 */
export async function deleteProgram(id: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/programs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao deletar programa');
  }
}

// ============= INSCRIÇÕES =============

export interface Enrollment {
  id: string;
  userId: string;
  programId: string;
  status: 'enrolled' | 'completed' | 'abandoned' | 'rejected';
  program: Program;
  enrolledAt: string;
}

/**
 * Se inscrever em programa
 */
export async function enrollInProgram(programId: string): Promise<Enrollment> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/enrollments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ programId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao se inscrever');
  }

  const data = await response.json();
  return data.enrollment;
}

/**
 * Obter minhas inscrições
 */
export async function getMyEnrollments(): Promise<Enrollment[]> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/enrollments/my`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao obter inscrições');
  }

  const data = await response.json();
  return data.enrollments || [];
}

/**
 * Cancelar inscrição
 */
export async function cancelEnrollment(enrollmentId: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/enrollments/${enrollmentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao cancelar inscrição');
  }
}

// ============= PROGRAMAS SALVOS =============

export interface SavedProgram {
  id: string;
  userId: string;
  programId: string;
  program: Program;
  savedAt: string;
}

/**
 * Salvar programa
 */
export async function saveProgram(programId: string): Promise<SavedProgram> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/saved-programs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ programId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao salvar programa');
  }

  const data = await response.json();
  return data.savedProgram;
}

/**
 * Obter programas salvos
 */
export async function getMySavedPrograms(): Promise<SavedProgram[]> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/saved-programs/my`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao obter programas salvos');
  }

  const data = await response.json();
  return data.savedPrograms || [];
}

/**
 * Remover programa dos salvos
 */
export async function unsaveProgram(savedProgramId: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/saved-programs/${savedProgramId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao remover programa');
  }
}