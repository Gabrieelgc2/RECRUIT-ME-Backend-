import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './routes/authRoutes';
import programRoutes from './routes/programRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import savedProgramRoutes from './routes/savedProgramRoutes';
import { errorHandler } from './middlewares/auth';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middlewares
app.use(express.json());
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RecruitME API',
      version: '1.0.0',
      description: 'API completa para a plataforma RecruitME - Plataforma de Formação em TI',
      contact: {
        name: 'RecruitME Team',
        email: 'suporte@recruitme.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: process.env.PRODUCTION_URL || 'https://api.recruitme.com',
        description: 'Servidor de produção'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticação. Use: Bearer seu_token_aqui'
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticação (login, signup, perfil)'
      },
      {
        name: 'Programs',
        description: 'Endpoints para gerenciar programas de formação'
      },
      {
        name: 'Enrollments',
        description: 'Endpoints para inscrições em programas'
      },
      {
        name: 'SavedPrograms',
        description: 'Endpoints para programas salvos/favoritos'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
    displayOperationId: true,
    defaultModelsExpandDepth: 1,
    docExpansion: 'list'
  }
}));

// API Routes
app.use('/auth', authRoutes);
app.use('/programs', programRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/saved-programs', savedProgramRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'RecruitME API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API RecruitME',
    version: '1.0.0',
    docs: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/docs`,
    endpoints: {
      auth: '/auth',
      programs: '/programs',
      enrollments: '/enrollments',
      savedPrograms: '/saved-programs',
      health: '/health'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
    code: 'NOT_FOUND'
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor RecruitME rodando em http://localhost:${PORT}`);
  console.log(`📚 Swagger docs disponível em http://localhost:${PORT}/docs`);
  console.log(`🔗 CORS habilitado para: ${FRONTEND_URL}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});

export default app;
