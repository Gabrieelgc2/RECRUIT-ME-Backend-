import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.savedProgram.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.program.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários estudantes
  const studentPassword = await bcryptjs.hash('senha123456', 10);
  
  const student1 = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@example.com',
      password: studentPassword,
      phone: '(11) 98765-4321',
      bio: 'Desenvolvedor Full Stack em formação',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'student',
      profileComplete: 70,
      emailVerified: true
    }
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      password: studentPassword,
      phone: '(21) 99876-5432',
      bio: 'Analista de Dados',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'student',
      profileComplete: 50,
      emailVerified: true
    }
  });

  // Criar usuário empresa
  const companyPassword = await bcryptjs.hash('empresa123456', 10);
  
  const companyUser = await prisma.user.create({
    data: {
      name: 'Tech Company',
      email: 'contato@techcompany.com',
      password: companyPassword,
      phone: '(11) 3456-7890',
      role: 'company',
      profileComplete: 100,
      emailVerified: true
    }
  });

  // Criar empresa
  const company = await prisma.company.create({
    data: {
      name: 'Tech Company Brasil',
      email: 'empresa@techcompany.com',
      cnpj: '12.345.678/0001-99',
      logo: 'https://via.placeholder.com/200?text=Tech+Company',
      description: 'Empresa de tecnologia com foco em desenvolvimento de software inovador',
      website: 'https://techcompany.com',
      phone: '(11) 3456-7890',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      userId: companyUser.id
    }
  });

  // Criar programas
  const now = new Date();
  const futureDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 dias no futuro
  const closingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias no futuro

  const program1 = await prisma.program.create({
    data: {
      title: 'Bootcamp Full Stack JavaScript',
      description: 'Bootcamp intensivo de 12 semanas para aprender desenvolvimento Full Stack com JavaScript, React e Node.js. Inclui projeto final e mentoria',
      type: 'bootcamp',
      companyId: company.id,
      deadline: futureDate,
      enrollmentEndDate: closingDate,
      maxParticipants: 50,
      tags: ['frontend', 'backend', 'javascript'],
      status: 'open',
      imageUrl: 'https://via.placeholder.com/400?text=Bootcamp+JavaScript',
      requirements: 'Conhecimento básico de programação, disposto a dedicar 40h/semana',
      benefits: 'Certificado, networking, ajuda na colocação profissional'
    }
  });

  const program2 = await prisma.program.create({
    data: {
      title: 'Estágio em Análise de Dados',
      description: 'Oportunidade de estágio para aprender análise de dados com Python, SQL e Power BI. Trabalho com datasets reais',
      type: 'estágio',
      companyId: company.id,
      deadline: closingDate,
      enrollmentEndDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      maxParticipants: 10,
      tags: ['dados', 'python'],
      status: 'open',
      imageUrl: 'https://via.placeholder.com/400?text=Estágio+Dados',
      requirements: 'Estudante de Engenharia, Matemática ou área relacionada',
      benefits: 'Bolsa-auxílio, experiência prática, possibilidade de efetivação'
    }
  });

  const program3 = await prisma.program.create({
    data: {
      title: 'Workshop DevOps & Cloud',
      description: 'Workshop de um dia sobre práticas DevOps, Docker, Kubernetes e deploy em nuvem',
      type: 'workshop',
      companyId: company.id,
      deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      enrollmentEndDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      maxParticipants: 30,
      tags: ['devops', 'backend'],
      status: 'open',
      imageUrl: 'https://via.placeholder.com/400?text=Workshop+DevOps',
      requirements: 'Conhecimento de Linux e conceitos básicos de containers',
      benefits: 'Certificado de participação, materiais de referência'
    }
  });

  const program4 = await prisma.program.create({
    data: {
      title: 'Curso React Avançado',
      description: 'Curso online de 8 semanas aprofundando em React: hooks, context API, performance e testes',
      type: 'curso',
      companyId: company.id,
      deadline: futureDate,
      enrollmentEndDate: closingDate,
      maxParticipants: 100,
      tags: ['frontend', 'react'],
      status: 'coming-soon',
      imageUrl: 'https://via.placeholder.com/400?text=Curso+React',
      requirements: 'JavaScript e React básico',
      benefits: 'Certificado, acesso vitalício ao material'
    }
  });

  // Criar inscrições
  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      programId: program1.id,
      status: 'enrolled'
    }
  });

  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      programId: program3.id,
      status: 'enrolled'
    }
  });

  await prisma.enrollment.create({
    data: {
      userId: student2.id,
      programId: program2.id,
      status: 'enrolled'
    }
  });

  // Criar programas salvos
  await prisma.savedProgram.create({
    data: {
      userId: student1.id,
      programId: program2.id
    }
  });

  await prisma.savedProgram.create({
    data: {
      userId: student2.id,
      programId: program1.id
    }
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log(`
📊 Dados criados:
  - 2 usuários estudantes
  - 1 usuário empresa
  - 1 empresa
  - 4 programas
  - 3 inscrições
  - 2 programas salvos

🔐 Credenciais de teste:
  Estudante:
    Email: joao@example.com
    Senha: senha123456

  Empresa:
    Email: contato@techcompany.com
    Senha: empresa123456
  `);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
