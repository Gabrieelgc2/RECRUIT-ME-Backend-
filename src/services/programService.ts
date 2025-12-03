import { prisma } from '../config/prisma.ts';

export async function getAllPrograms(filters?: {
  type?: string;
  status?: string;
  tags?: string[];
}) {
  const where: any = {};

  if (filters?.type) {
    where.type = filters.type;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.tags && filters.tags.length > 0) {
    where.tags = {
      hasSome: filters.tags
    };
  }

  const programs = await prisma.program.findMany({
    where,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true
        }
      },
      _count: {
        select: { enrollments: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return programs.map(prog => ({
    ...prog,
    participants: prog._count.enrollments,
    _count: undefined
  }));
}

export async function getProgramById(id: string) {
  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          description: true,
          website: true
        }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  });

  if (!program) {
    throw new Error('Programa não encontrado');
  }

  return {
    ...program,
    participants: program._count.enrollments,
    _count: undefined
  };
}

export async function createProgram(
  companyId: string,
  data: {
    title: string;
    description: string;
    type: string;
    deadline: Date;
    enrollmentEndDate: Date;
    maxParticipants?: number;
    tags: string[];
    status?: string;
    imageUrl?: string;
    requirements?: string;
    benefits?: string;
  }
) {
  const program = await prisma.program.create({
    data: {
      ...data,
      companyId
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true
        }
      }
    }
  });

  return program;
}

export async function updateProgram(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    type: string;
    deadline: Date;
    enrollmentEndDate: Date;
    maxParticipants: number;
    tags: string[];
    status: string;
    imageUrl: string;
    requirements: string;
    benefits: string;
  }>
) {
  const program = await prisma.program.update({
    where: { id },
    data,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true
        }
      }
    }
  });

  return program;
}

export async function deleteProgram(id: string) {
  await prisma.program.delete({
    where: { id }
  });
}

export async function getProgramsByCompany(companyId: string) {
  const programs = await prisma.program.findMany({
    where: { companyId },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true
        }
      },
      _count: {
        select: { enrollments: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return programs.map(prog => ({
    ...prog,
    participants: prog._count.enrollments,
    _count: undefined
  }));
}
