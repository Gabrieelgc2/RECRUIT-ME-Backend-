import bcryptjs from 'bcryptjs';
import { prisma } from '../config/prisma.ts';
import { generateToken } from '../utils/jwt.ts';

export async function registerCompany(
  name: string,
  email: string,
  website: string | null,
  cnpj: string,
  password: string,
  userId: string // novo parâmetro obrigatório
) {
  const existing = await prisma.company.findUnique({
    where: {email}
  });

  if (existing) {
    throw new Error('Email já cadastrado');
  }
  const hashedPassword = await bcryptjs.hash(password, 10);

  const company = await prisma.company.create({
    data: {
      name,
      email,
      website,
      cnpj,
      password: hashedPassword,
      user: { connect: { id: userId } } 
    },
    select: {
      id: true,
      name: true,
      email: true,
      website: true,
      cnpj: true
    }
  });

  const token = generateToken(company.id);

  return { company, token };
}

export async function loginCompany(email: string, password: string) {
  const company = await prisma.company.findUnique({ where: { email } });
  if (!company) throw new Error('Email ou senha incorretos');

  const isValid = await bcryptjs.compare(password, company.password);
  if (!isValid) throw new Error('Email ou senha incorretos');

  const token = generateToken(company.id);

  return {
    company: {
      id: company.id,
      name: company.name,
      email: company.email,
      website: company.website,
      cpnj: company.cnpj
    },
    token
  };
}