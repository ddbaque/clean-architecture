# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Clean Architecture implementation in TypeScript for a Node.js backend with user authentication. The project demonstrates proper separation of concerns across three main layers: Domain, Infrastructure, and Presentation.

## Development Commands

### Core Commands

- `npm run dev` - Start development server with hot reload using tsx
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server (requires build first)
- `npm run format:prettier` - Format code with Prettier

### Database Setup

- `docker-compose up -d` - Start PostgreSQL database container
- Database runs on port 5432 with initialization script at `data.sql`

### Environment Configuration

- Copy `.env.example` to `.env` and configure:
  - `PORT` - Server port
  - `JWT_KEY` - JWT secret key
  - PostgreSQL connection details

## Architecture Overview

### Clean Architecture Layers

The project strictly follows Clean Architecture principles with dependency inversion:

**Domain Layer** (`/src/domain/`) - Core business logic

- `entities/` - Business entities (User)
- `dtos/` - Data Transfer Objects with validation
- `repositories/` - Repository interfaces (contracts)
- `datasources/` - Data source interfaces (contracts)
- `use-cases/` - Business logic orchestration
- `errors/` - Custom error definitions

**Infrastructure Layer** (`/src/infrastructure/`) - External concerns

- `datasources/postgres/` - PostgreSQL implementations
- `repositories/` - Repository implementations
- `mappers/` - Data transformation between layers

**Presentation Layer** (`/src/presentation/`) - API interface

- `auth/`, `user/` - Controllers and routes by feature
- `middlewares/` - Express middlewares
- `server.ts` - Express server configuration
- `utils/` - Response formatting utilities

### Key Architectural Rules

1. **Dependency Direction**: Infrastructure → Domain ← Presentation
2. **Interface Segregation**: Domain defines contracts, Infrastructure implements them
3. **Dependency Injection**: Use constructors to inject dependencies
4. **No Framework Coupling**: Domain layer is framework-agnostic

### Path Aliases

TypeScript path mapping configured:

- `@/*` maps to `src/*`

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with raw SQL queries
- **Authentication**: JWT tokens with bcryptjs
- **Validation**: Zod schemas
- **Development**: tsx for hot reload

## Key Features Implemented

- User registration and login with JWT authentication
- Password hashing with bcrypt
- Input validation using DTOs with Zod
- Global error handling with custom error types
- Database connection pooling
- Clean separation of business logic from infrastructure

## Testing

Currently no test framework is configured. When implementing tests:

- Test each layer independently
- Mock dependencies at layer boundaries
- Focus on use cases for business logic tests
- Use dependency injection for testability

## Database Schema

User table structure:

- id (primary key)
- email (unique)
- name
- password (hashed)
- image (optional)

## Common Development Patterns

### Creating New Features

1. Define entities in Domain layer
2. Create DTOs for input/output validation
3. Define repository and datasource interfaces
4. Implement use cases for business logic
5. Implement datasources and repositories in Infrastructure
6. Create controllers and routes in Presentation

### Error Handling

- Use `CustomError` class for business logic errors
- Global error handler in server.ts handles all error types
- API responses follow consistent format via `ResponseFactory`

### Data Flow

Request → Controller → Use Case → Repository → DataSource → Database
Database → DataSource → Repository → Use Case → Controller → Response
