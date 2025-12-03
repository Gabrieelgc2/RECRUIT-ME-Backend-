import bcryptjs from 'bcryptjs';
import { prisma } from '../config/prisma';
import { generateToken } from '../utils/jwt';

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  // Verificar se email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Hash da senha
  const hashedPassword = await bcryptjs.hash(password, 10);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'student'
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  // Gerar token
  const token = generateToken(user.id);

  return {
    user,
    token
  };
}

export async function loginUser(
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const passwordValid = await bcryptjs.compare(password, user.password);

  if (!passwordValid) {
    throw new Error('Senha incorreta');
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bio: true,
      avatar: true,
      role: true,
      profileComplete: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
  }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bio: true,
      avatar: true,
      role: true,
      profileComplete: true
    }
  });

  return user;
}
