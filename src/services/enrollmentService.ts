import { prisma } from '../config/prisma';

export async function enrollInProgram(userId: string, programId: string) {
  // Verificar se já está inscrito
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_programId: {
        userId,
        programId
      }
    }
  });

  if (existingEnrollment) {
    throw new Error('Você já está inscrito neste programa');
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      programId,
      status: 'enrolled'
    },
    include: {
      program: {
        select: {
          id: true,
          title: true,
          type: true
        }
      }
    }
  });

  return enrollment;
}

export async function cancelEnrollment(userId: string, enrollmentId: string) {
  const enrollment = await prisma.enrollment.delete({
    where: {
      id: enrollmentId
    }
  });

  return enrollment;
}

export async function getUserEnrollments(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      program: {
        select: {
          id: true,
          title: true,
          type: true,
          deadline: true,
          company: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          }
        }
      }
    },
    orderBy: {
      enrolledAt: 'desc'
    }
  });

  return enrollments;
}

export async function saveProgram(userId: string, programId: string) {
  const existingSave = await prisma.savedProgram.findUnique({
    where: {
      userId_programId: {
        userId,
        programId
      }
    }
  });

  if (existingSave) {
    throw new Error('Programa já foi salvo');
  }

  const savedProgram = await prisma.savedProgram.create({
    data: {
      userId,
      programId
    },
    include: {
      program: {
        select: {
          id: true,
          title: true,
          type: true,
          company: {
            select: {
              name: true,
              logo: true
            }
          }
        }
      }
    }
  });

  return savedProgram;
}

export async function unsaveProgram(userId: string, savedProgramId: string) {
  const savedProgram = await prisma.savedProgram.delete({
    where: {
      id: savedProgramId
    }
  });

  return savedProgram;
}

export async function getUserSavedPrograms(userId: string) {
  const savedPrograms = await prisma.savedProgram.findMany({
    where: { userId },
    include: {
      program: {
        select: {
          id: true,
          title: true,
          type: true,
          deadline: true,
          status: true,
          company: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          }
        }
      }
    },
    orderBy: {
      savedAt: 'desc'
    }
  });

  return savedPrograms;
}
