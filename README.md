# clean-architecture
├──  src
│   ├──  app.ts
│   ├──  config
│   │   ├──  bcrypt.ts
│   │   ├──  envs.ts
│   │   ├──  index.ts
│   │   ├──  jwt.ts
│   │   └──  validators.ts
│   ├──  data
│   │   └──  postgres
│   │       ├──  postgres-database.ts
│   │       └──  postgres-databse.d.ts
│   ├──  domain
│   │   ├──  datasources
│   │   │   ├──  auth.datasource.ts
│   │   │   └──  index.ts
│   │   ├──  dtos
│   │   │   ├──  auth
│   │   │   │   ├──  index.ts
│   │   │   │   └──  register-user.dto.ts
│   │   │   └──  index.ts
│   │   ├──  entities
│   │   │   ├──  index.ts
│   │   │   └──  user.entity.ts
│   │   ├──  errors
│   │   │   ├──  custom.error.ts
│   │   │   └──  index.ts
│   │   ├──  index.ts
│   │   ├──  repositories
│   │   │   ├──  auth.repository.ts
│   │   │   └──  index.ts
│   │   └──  use-cases
│   │       ├──  auth
│   │       │   ├──  index.ts
│   │       │   ├──  login-user.use-case.ts
│   │       │   └──  register-user.user-case.ts
│   │       └──  index.ts
│   ├──  infrastructure
│   │   ├──  datasources
│   │   │   ├──  index.ts
│   │   │   └──  postgres
│   │   │       ├──  auth.datasource.impl.ts
│   │   │       └──  index.ts
│   │   ├──  index.ts
│   │   ├──  mappers
│   │   │   ├──  index.ts
│   │   │   └──  user.mapper.ts
│   │   └──  repositories
│   │       ├──  auth.repository.impl.ts
│   │       └──  index.ts
│   └──  presentation
│       ├──  auth
│       │   ├──  controller.ts
│       │   └──  routes.ts
│       ├──  index.ts
│       ├──  middlewares
│       │   ├──  auth.middleware.ts
│       │   └──  index.ts
│       ├──  routes.ts
│       ├──  server.ts
│       └──  types
│           └──  server.d.ts
└──  tsconfig.json
