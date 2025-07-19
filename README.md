# 🧼 Clean Architecture - Node.js Backend

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-black?style=flat-square&logo=JSON%20web%20tokens)](https://jwt.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=flat-square&logo=socket.io&badgeColor=010101)](https://socket.io/)
[![Jest](https://img.shields.io/badge/Jest-323330?style=flat-square&logo=Jest&logoColor=white)](https://jestjs.io/)

Una implementación completa de **Clean Architecture** en TypeScript para Node.js, demostrando la separación correcta de responsabilidades en tres capas principales: **Dominio**, **Infraestructura** y **Presentación**.

## 📋 Tabla de Contenidos

- [🎯 Introducción](#-introducción)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [💾 Configuración de Base de Datos](#-configuración-de-base-de-datos)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Comandos Disponibles](#-comandos-disponibles)
- [🧪 Testing](#-testing)
- [🔐 Autenticación y Seguridad](#-autenticación-y-seguridad)
- [🌐 WebSockets](#-websockets)
- [📡 API Endpoints](#-api-endpoints)
- [🔄 Flujo de Datos](#-flujo-de-datos)
- [📋 Reglas de la Arquitectura](#-reglas-de-la-arquitectura)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📖 Ejemplos de Uso](#-ejemplos-de-uso)
- [🤝 Contribución](#-contribución)

---

## 🎯 Introducción

Cuando empiezas en el mundo del desarrollo de _software_, lo más común es elegir un lenguaje con el que comenzar. Luego sigues con mini proyectos hasta llegar al punto en que quieres realizar tu primer proyecto serio (ya sea pequeño o mediano). En ese momento, es probable que, entre la gran cantidad de problemas que se te presentan --como qué librerías utilizar--, el problema de qué arquitectura usar para organizar tu código no sea uno de ellos.

A primera vista, el cómo organizar tu código quizás no suene interesante, pero eso está muy lejos de la realidad. Plantear una buena base y arquitectura te facilitará escalar tu aplicación, que en un principio puede ser pequeña, hacia algo de mayor envergadura e importancia.

### ¿Por qué Clean Architecture?

- ✅ **Mantenibilidad**: Código fácil de mantener y evolucionar
- ✅ **Testabilidad**: Cada capa puede ser testeada independientemente
- ✅ **Escalabilidad**: Fácil agregar nuevas funcionalidades
- ✅ **Independencia de Frameworks**: No estás atado a Express, PostgreSQL, etc.
- ✅ **Separación de Responsabilidades**: Cada capa tiene un propósito específico

---

## 🏗️ Arquitectura del Proyecto

### Principios Fundamentales

El principio de la Clean Architecture es separar todo por capas (Presentación - Dominio - Infraestructura). Estas capas tienen dependencias que solo apuntan hacia dentro:

```bash
┌─────────────────────────────────┐
│    CAPA DE PRESENTACIÓN         │  ← Controllers, Routes, Middlewares
│  (Express, Socket.io, REST API) │
└─────────────┬───────────────────┘
              ↓ (depende de)
┌─────────────────────────────────┐
│      CAPA DE DOMINIO            │  ← Entities, Use Cases, Interfaces
│   (Lógica de Negocio Pura)     │
└─────────────┬───────────────────┘
              ↓ (implementa)
┌─────────────────────────────────┐
│   CAPA DE INFRAESTRUCTURA       │  ← Database, External APIs, Mappers
│  (PostgreSQL, JWT, Bcrypt)      │
└─────────────────────────────────┘
```

### Flujo de Dependencias

- **Infraestructura** → **Dominio** ← **Presentación**
- Las capas externas conocen las internas, pero no al revés
- El dominio define contratos (interfaces) que la infraestructura implementa

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [pnpm](https://pnpm.io/) (recomendado) o npm
- [Docker](https://docker.com/) (para PostgreSQL)
- [Git](https://git-scm.com/)

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd Clean_Architecture

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
```

### Variables de Entorno

Edita el archivo `.env` con tu configuración:

```env
# Server Configuration
PORT=3000

# Database Configuration
POSTGRES_URL=postgresql://user:password@localhost:5432/clean_architecture
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=clean_architecture

# JWT Configuration
JWT_KEY=your-super-secret-jwt-key

# Other Configuration
NODE_ENV=development
```

---

## 💾 Configuración de Base de Datos

### Usando Docker (Recomendado)

```bash
# Levantar PostgreSQL con Docker Compose
docker-compose up -d

# Verificar que la base de datos esté corriendo
docker-compose ps
```

### Esquema de Base de Datos

El proyecto incluye un script SQL inicial (`data.sql`):

```sql
-- Tabla de usuarios
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📂 Estructura del Proyecto

```bash
src/
├── app.ts                          # Punto de entrada de la aplicación
├── config/                         # Configuraciones globales
│   ├── bcrypt.ts                   # Configuración de encriptación
│   ├── envs.ts                     # Variables de entorno
│   ├── jwt.ts                      # Configuración JWT
│   └── validators.ts               # Validadores globales
├── data/                           # Conexión a base de datos
│   └── postgres/
│       └── postgres-database.ts    # Pool de conexiones PostgreSQL
├── domain/                         # 🧠 CAPA DE DOMINIO
│   ├── entities/                   # Entidades de negocio
│   │   └── user.entity.ts
│   ├── dtos/                       # Data Transfer Objects
│   │   ├── auth/
│   │   │   ├── login-user.dto.ts
│   │   │   └── register-user.dto.ts
│   │   └── user/
│   │       ├── get-user.dto.ts
│   │       └── get-all-user-response.dto.ts
│   ├── repositories/               # Interfaces de repositorios
│   │   ├── auth.repository.ts
│   │   └── user.repository.ts
│   ├── datasources/               # Interfaces de fuentes de datos
│   │   ├── auth.datasource.ts
│   │   └── user.datasource.ts
│   ├── use-cases/                 # Casos de uso (lógica de negocio)
│   │   ├── auth/
│   │   │   ├── login-user.use-case.ts
│   │   │   └── register-user.use-case.ts
│   │   └── user/
│   │       ├── get-user-by-id.use-case.ts
│   │       └── get-all-user.use-case.ts
│   ├── errors/                    # Errores personalizados
│   │   ├── custom.error.ts
│   │   ├── api.error.ts
│   │   └── api-codes.error.ts
│   ├── types/                     # Tipos TypeScript
│   │   └── api-response.ts
│   └── validations/               # Validaciones con Zod
│       └── zod/
│           └── user/
│               └── user.validations.ts
├── infrastructure/                # 🚧 CAPA DE INFRAESTRUCTURA
│   ├── datasources/              # Implementaciones de fuentes de datos
│   │   └── postgres/
│   │       ├── auth.datasource.impl.ts
│   │       └── user.datasource.impl.ts
│   ├── repositories/             # Implementaciones de repositorios
│   │   ├── auth.repository.impl.ts
│   │   └── user.repository.impl.ts
│   └── mappers/                  # Mappers entre capas
│       └── user.mapper.ts
└── presentation/                 # 🎭 CAPA DE PRESENTACIÓN
    ├── auth/                     # Módulo de autenticación
    │   ├── controller.ts
    │   └── routes.ts
    ├── user/                     # Módulo de usuarios
    │   ├── controller.ts
    │   └── routes.ts
    ├── middlewares/              # Middlewares de Express
    │   ├── auth.middleware.ts
    │   └── error-handler.middleware.ts
    ├── socket/                   # WebSocket implementation
    │   ├── events/
    │   │   ├── connection-handler.ts
    │   │   ├── message-handler.ts
    │   │   └── room-handler.ts
    │   ├── socket-manager.ts
    │   └── types/
    │       └── message.types.ts
    ├── utils/                    # Utilidades de presentación
    │   └── response-factory.ts
    ├── server.ts                 # Configuración del servidor Express
    └── routes.ts                 # Rutas principales

tests/                            # 🧪 TESTS
├── setup.ts                      # Configuración de Jest
├── domain/                       # Tests del dominio
│   ├── dtos/
│   │   └── auth/
│   │       └── register-user.dto.test.ts
│   └── use-cases/
│       └── auth/
│           └── login-user.use-case.test.ts
└── infrastructure/               # Tests de infraestructura
    └── datasources/
        └── postgres/
            └── auth.datasource.impl.test.ts
```

---

## 🔧 Comandos Disponibles

### Desarrollo

```bash
# Iniciar en modo desarrollo con hot reload
pnpm dev

# Verificar tipos TypeScript
pnpm type-check

# Linting y formateo
pnpm lint              # ESLint con auto-fix
pnpm format:prettier   # Formatear con Prettier
```

### Producción

```bash
# Compilar TypeScript a JavaScript
pnpm build

# Iniciar servidor de producción
pnpm start
```

### Testing

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Generar reporte de cobertura
pnpm test:coverage
```

### Base de Datos

```bash
# Levantar PostgreSQL con Docker
docker-compose up -d

# Parar PostgreSQL
docker-compose down

# Ver logs de la base de datos
docker-compose logs postgres
```

---

## 🧪 Testing

El proyecto incluye una suite completa de tests organizados por capas:

### Estructura de Tests

```bash
tests/
├── setup.ts                                    # Configuración global de Jest
├── domain/                                     # Tests de lógica de negocio
│   ├── dtos/                                   # Validación de DTOs
│   │   └── auth/
│   │       └── register-user.dto.test.ts
│   └── use-cases/                              # Tests de casos de uso
│       └── auth/
│           └── login-user.use-case.test.ts
└── infrastructure/                             # Tests de infraestructura
    └── datasources/
        └── postgres/
            └── auth.datasource.impl.test.ts
```

### Tipos de Tests

**Tests de Dominio:**
- ✅ Validación de DTOs con Zod
- ✅ Lógica de casos de uso
- ✅ Comportamiento de entidades
- ✅ Manejo de errores custom

**Tests de Infraestructura:**
- ✅ Datasources con mocks de base de datos
- ✅ Repositorios y mappers
- ✅ Integración con servicios externos

**Tests de Presentación:**
- ✅ Controllers y rutas
- ✅ Middlewares de autenticación
- ✅ Validación de requests/responses

### Configuración de Jest

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/app.ts',
  ],
};
```

---

## 🔐 Autenticación y Seguridad

### Sistema de Autenticación

El proyecto implementa autenticación basada en JWT:

```typescript
// Login flow
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "Password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### Características de Seguridad

- 🔐 **Hashing de Passwords**: bcryptjs para encriptar contraseñas
- 🎫 **JWT Tokens**: Autenticación stateless con expiración
- 🛡️ **Middleware de Auth**: Validación automática de tokens
- ✅ **Validación de Datos**: Zod para validación estricta de entrada
- 🚫 **Error Handling**: Manejo seguro de errores sin exposición de datos

### Middleware de Autenticación

```typescript
// Protección de rutas
app.use('/api/users', AuthMiddleware.validateJWT, userRoutes);
```

---

## 🌐 WebSockets

El proyecto incluye implementación completa de WebSockets usando Socket.IO:

### Características

- 🔗 **Gestión de Conexiones**: Manejo automático de conexiones/desconexiones
- 🏠 **Sistema de Salas**: Usuarios pueden unirse a salas específicas
- 💬 **Mensajería en Tiempo Real**: Chat y comunicación bidireccional
- 📊 **Admin UI**: Interfaz de administración para Socket.IO

### Eventos Disponibles

```typescript
// Cliente se conecta
socket.on('connection', (socket) => { ... });

// Unirse a una sala
socket.emit('join-room', { room: 'general' });

// Enviar mensaje
socket.emit('send-message', { room: 'general', message: 'Hello!' });

// Recibir mensaje
socket.on('new-message', (data) => { ... });
```

### Testing WebSockets

Incluye archivo HTML para testing manual:
- 📄 `socket-test.html` - Interfaz simple para probar WebSockets

---

## 📡 API Endpoints

### Autenticación

```bash
# Registro de usuario
POST /api/auth/register
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}

# Login de usuario
POST /api/auth/login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Usuarios (Requiere Autenticación)

```bash
# Obtener todos los usuarios
GET /api/users
Authorization: Bearer <jwt-token>

# Obtener usuario por ID
GET /api/users/:id
Authorization: Bearer <jwt-token>
```

### Respuestas API

Todas las respuestas siguen un formato consistente:

```typescript
// Éxito
{
  "data": { ... },
  "message": "Success message"
}

// Error
{
  "error": "Error message",
  "statusCode": 400
}
```

---

## 🔄 Flujo de Datos

### Ejemplo: Registro de Usuario

```mermaid
sequenceDiagram
    participant C as Client
    participant PC as AuthController
    participant UC as RegisterUserUseCase
    participant R as AuthRepository
    participant DS as AuthDataSource
    participant DB as PostgreSQL

    C->>PC: POST /api/auth/register
    PC->>PC: Validate DTO
    PC->>UC: execute(registerDto)
    UC->>R: register(registerDto)
    R->>DS: register(registerDto)
    DS->>DB: INSERT INTO "user"
    DB-->>DS: User data
    DS-->>R: User entity
    R-->>UC: User entity
    UC->>UC: Generate JWT
    UC-->>PC: { token, user }
    PC-->>C: 201 Created
```

### Separación de Responsabilidades

1. **Controller**: Valida entrada y maneja HTTP
2. **Use Case**: Orquesta lógica de negocio
3. **Repository**: Abstrae acceso a datos
4. **DataSource**: Implementa persistencia específica
5. **Mapper**: Convierte entre formatos de datos

---

## 📋 Reglas de la Arquitectura

### ✅ Reglas de Oro

1. **Dependencias hacia adentro**: Las capas internas NO conocen las externas
2. **Importaciones direccionales**: Solo se importa hacia adentro
3. **Interfaces en Domain**: Los contratos se definen en la capa de dominio
4. **Implementaciones en Infrastructure**: Las implementaciones van en infraestructura
5. **Lógica de negocio pura**: Solo en la capa de dominio

### ❌ Qué NO hacer

- ❌ Importar Express en el dominio
- ❌ Poner lógica de negocio en controllers
- ❌ Acceder directamente a la BD desde use cases
- ❌ Mezclar validación de entrada con lógica de negocio
- ❌ Crear dependencias circulares entre capas

### ✅ Beneficios de estas Reglas

- 🔧 **Fácil testing**: Cada capa se puede testear independientemente
- 🔄 **Intercambiabilidad**: Cambiar BD o framework sin afectar lógica
- 📈 **Escalabilidad**: Agregar features sin romper código existente
- 🛠️ **Mantenimiento**: Código organizado y predecible

---

## 🛠️ Tecnologías Utilizadas

### Core

- **[TypeScript](https://typescriptlang.org/)** - Tipado estático para JavaScript
- **[Node.js](https://nodejs.org/)** - Runtime de JavaScript
- **[Express.js](https://expressjs.com/)** - Framework web minimalista

### Base de Datos

- **[PostgreSQL](https://postgresql.org/)** - Base de datos relacional
- **[pg](https://node-postgres.com/)** - Cliente PostgreSQL para Node.js
- **[Docker](https://docker.com/)** - Containerización

### Autenticación y Seguridad

- **[JWT](https://jwt.io/)** - JSON Web Tokens
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Hashing de passwords
- **[Zod](https://zod.dev/)** - Validación de esquemas TypeScript

### WebSockets

- **[Socket.IO](https://socket.io/)** - WebSockets en tiempo real
- **[@socket.io/admin-ui](https://socket.io/docs/v4/admin-ui/)** - Interfaz de administración

### Development & Testing

- **[Jest](https://jestjs.io/)** - Framework de testing
- **[ts-jest](https://kulshekhar.github.io/ts-jest/)** - Jest para TypeScript
- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Formateo de código
- **[tsx](https://github.com/esbuild-kit/tsx)** - TypeScript execution

### Utilities

- **[env-var](https://github.com/evanshortiss/env-var)** - Validación de variables de entorno
- **[morgan](https://github.com/expressjs/morgan)** - HTTP request logger
- **[dotenv](https://github.com/motdotla/dotenv)** - Variables de entorno

---

## 📖 Ejemplos de Uso

### Crear un Nuevo Use Case

```typescript
// 1. Definir DTO en domain/dtos/
export class CreatePostDto {
  private constructor(
    public title: string,
    public content: string,
    public authorId: number
  ) {}

  static create(object: Record<string, any>): [string?, CreatePostDto?] {
    // Validación con Zod
    const result = PostValidations.createPost().safeParse(object);
    if (!result.success) return [result.error.message];
    
    return [undefined, new CreatePostDto(
      result.data.title,
      result.data.content,
      result.data.authorId
    )];
  }
}

// 2. Crear Use Case en domain/use-cases/
export class CreatePost {
  constructor(private postRepository: PostRepository) {}

  async execute(dto: CreatePostDto): Promise<Post> {
    // Lógica de negocio aquí
    const post = await this.postRepository.create(dto);
    return post;
  }
}

// 3. Implementar Repository en infrastructure/
export class PostRepositoryImpl implements PostRepository {
  constructor(private dataSource: PostDataSource) {}

  async create(dto: CreatePostDto): Promise<Post> {
    return this.dataSource.create(dto);
  }
}
```

### Agregar Nueva Validación

```typescript
// domain/validations/zod/post/post.validations.ts
export class PostValidations {
  static createPost() {
    return z.object({
      title: z.string().min(1).max(255),
      content: z.string().min(10),
      authorId: z.number().positive()
    });
  }
}
```

### Testing de Use Case

```typescript
describe('CreatePost Use Case', () => {
  let createPost: CreatePost;
  let mockPostRepository: jest.Mocked<PostRepository>;

  beforeEach(() => {
    mockPostRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };
    createPost = new CreatePost(mockPostRepository);
  });

  it('should create post successfully', async () => {
    // Arrange
    const [, dto] = CreatePostDto.create({
      title: 'Test Post',
      content: 'This is a test post',
      authorId: 1
    });
    
    const mockPost = new Post(1, 'Test Post', 'This is a test post', 1);
    mockPostRepository.create.mockResolvedValue(mockPost);

    // Act
    const result = await createPost.execute(dto!);

    // Assert
    expect(mockPostRepository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockPost);
  });
});
```

---

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. **Commit** tus cambios (`git commit -m 'Add amazing feature'`)
4. **Push** a la rama (`git push origin feature/amazing-feature`)
5. **Abre** un Pull Request

### Estándares de Código

- Usar **TypeScript** estricto
- Seguir principios de **Clean Architecture**
- Escribir **tests** para nuevo código
- Mantener **cobertura** de tests > 80%
- Usar **ESLint** y **Prettier**
- Documentar APIs y funciones complejas

### Estructura de Commits

```bash
feat: add new user management feature
fix: resolve JWT token validation issue
docs: update API documentation
test: add tests for auth use cases
refactor: improve error handling in datasources
```

---

## 🏆 Clean Architecture Benefits

Esta implementación te permite:

- ✅ **Cambiar frameworks** sin afectar lógica de negocio
- ✅ **Cambiar base de datos** sin tocar use cases
- ✅ **Testing independiente** de cada capa
- ✅ **Escalabilidad** mediante separación de responsabilidades
- ✅ **Mantenimiento** fácil y predecible
- ✅ **Reutilización** de código entre proyectos

### Casos de Uso Reales

- 🔄 **Migrar de PostgreSQL a MongoDB**: Solo cambiar DataSources
- 🔄 **Cambiar de Express a Fastify**: Solo cambiar capa de Presentación
- 🔄 **Agregar GraphQL**: Nueva capa de presentación, mismo dominio
- 🔄 **Testing sin BD**: Mockear DataSources, testear Use Cases
- 🔄 **Microservicios**: Extraer Use Cases a servicios independientes

---

**¡Feliz coding! 🚀**

*Este README te guía a través de una implementación real y práctica de Clean Architecture en Node.js con TypeScript.*