# 🧼 Clean Architecture

## 🎯 Introducción 

Cuando empiezas en el mundo del desarrollo de *software*, lo más común es elegir un lenguaje con el que comenzar. Luego sigues con mini proyectos hasta llegar al punto en que quieres realizar tu primer proyecto serio (ya sea pequeño o mediano). En ese momento, es probable que, entre la gran cantidad de problemas que se te presentan --como qué librerías utilizar--, el problema de qué arquitectura usar para organizar tu código no sea uno de ellos.

A primera vista, el cómo organizar tu código quizás no suene interesante, pero eso está muy lejos de la realidad. Plantear una buena base y arquitectura te facilitará escalar tu aplicación, que en un principio puede ser pequeña, hacia algo de mayor envergadura e importancia.

Lo más común que habrás escuchado sobre arquitectura/diseño de software seguramente sea el término *Clean Architecture*. Pero, ¿qué es realmente esto?

## 🤔 ¿Qué es Clean Architecture?

Básicamente podemos decir que es un enfoque hacia el diseño de nuestras aplicaciones, de como debemos estructurar nuestro código, ficheros, directorios, etc. Esto es fundamental porque evitamos crear código spaguetti. 

Siendo sinceros, cuantos de nosotros no habremos metido todo el código en un solo archivo o incluso separando el código en varios archivos, seguro hemos mezclado responsabilidades a quienes no debían.

El principio de la Clean Architecture es separar todo por capas (Presentación - Dominio - Infraestructura). Estas capas tienen dependencias que solo apuntan hacía dentro, esto quiere decir que la capa de **Infraestructura** no tiene nidea de que hay o que pasa en la capa de **Presentación** o **Dominio**.

```bash
+-----------------------------+
|     Capa de Presentación    |  <--- Controladores, Views
|   (Web, CLI, API, UI)       |
+-------------|---------------+
              ↓
+-----------------------------+
|     Capa de Dominio         |  <--- Entidades, Casos de Uso
| (Lógica/reglas de negocio)  |
+-------------|---------------+
              ↓
+-----------------------------+
|  Capa de Infraestructura    |  <--- DB, Archivos, APIs, Frameworks
| (Implementa interfaces)     |
+-----------------------------+
```
## 📝 Plantilla 

No existe una única forma real y definitiva de aplicar la arquitectura limpia. Encontrarás miles de ejemplos y proyectos con nombres de directorios y archivos diferentes. Sin embargo, con esta plantilla quiero darte un ejemplo más para que logres entender este concepto tan importante en el mundo del desarrollo.

Se trata de un backend sencillo donde podrás ver cada capa y cómo se comunican entre ellas. Podrás ver cómo, con esta arquitectura, no estamos anclados a librerías o bases de datos. Por ejemplo, podremos cambiar de base de datos sin tener que tocar la lógica de negocio, o cambiar Express por otra librería sin modificar el manejo de la base de datos.

Además, gracias a esta abstracción de responsabilidades, podremos realizar testing en cada capa sin depender del resto. Podemos hacer pruebas unitarias de la base de datos sin necesidad de levantar el servidor completo, o testear la lógica de negocio sin tener una conexión a la base de datos.

### 🎬 Capa de Presentación

📁 Ubicación: `/src/presentation/`

**¿Qué hace?**

- Recibe peticiones HTTP 
- Valida datos de entrada
- Llama a los Use Cases
- Devuelve respuestas HTTP
- Maneja middlewares y autenticación

**Árbol de Directorios**

``` bash
presentation/
├── auth/
│   ├── controller.ts        # Controlador API Rest
│   └── routes.ts            # Rutas de auth
├── middlewares/
│   └── auth.middleware.ts   # Middleware de autenticación
├── server.ts                # Configuración del servidor
└── routes.ts                # Rutas principales
```

Aquí usamos Express, pero si el día de mañana queremos pasarnos a Nest Js, solo habría que cambiar esta carpeta, el resto es independiente y agnóstico a esta capa.

**Ejemplo de un Controlador**

``` typescript
export class AuthController {
  constructor(private readonly authRepository: AuthRepository) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.log(error);

    return res.status(500).json({ error: "Internal Server Error" });
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };
};
```
Lo ves, el controlador no tiene nidea de como se registra el usuario, ni tampoco de las validaciones y menos de como se autentica el usuario. Lo único que hace es llamar al `use-case` de **Registrar Usuario** y manejar que responde el servidor dependiendo si hay errores o no.

### 🧠 Capa de Dominio 

📁 Ubicación: `/src/domain/`

**¿Qué hace?**

- Define las reglas de negocio
- Contiene entidades y objetos de valor
- Define contratos (interfaces) que deben implementar las capas externas
- Es independiente de frameworks y librerías

**Árbol de Directorios**

```bash
domain/
├── entities/
│   └── user.entity.ts        # Entidad User
├── dtos/
│   └── auth/
│       └── register-user.dto.ts # DTOs de validación
├── repositories/
│   └── auth.repository.ts    # INTERFAZ del repositorio
├── datasources/
│   └── auth.datasource.ts    # INTERFAZ del datasource
├── use-cases/
│   └── auth/
│       ├── register-user.use-case.ts # Lógica de negocio
│       └── login-user.use-case.ts
└── errors/
    └── custom.error.ts       # Errores personalizados
```
Aquí no hay implementaciones, solo definiciones (interfaces). Se definen las entidades de nuestro negocio, por ejemplo los usuarios. No nos anclamos al tipado que nos ofrece una base de datos, porque eso nos ata a una tecnologia y no estariamos respetando los principios de la **Clean Architecture**. 

Los **Dtos** son objetos de transferencia, que nos sirven para pasar datos entre nuestras capas, son clave porque es lo que usaremos para que la Capa de Presentación se comunique con la Capa de Dominio.

Los **Casos de Uso** maneja la lógica de negocio especifica de una necesidad, en este caso sobre la necesidad de registrar un usuario en el sistema. Esto conlleva, desde la creación en base de datos, hasta la creación del JWT Token para su autenticación. Todo esto sin implementar dichar lógica, solo controlandola.

Los **Repositorios** definen como operar los datos, solo orquesta no realiza. No tiene contacto directo con base de datos pero si que orquesta como se manejan los **Data Sources**. 

Los **Data Sources** son quienes se encargan de interactuar con la base de datos. Cumplen un contrato definido en esta capa, por lo tanto podemos tener multiples base de datos que mientras cumplan dicha interfaz nuestra capa de dominio la puede utilizar.

### 🚧 Capa de Infraestructura

📁 Ubicación: /src/infrastructure/

**¿Qué hace?**

- Implementa las interfaces definidas en Domain
- Se conecta con servicios externos (bases de datos, APIs, etc.)
- Contiene mappers para convertir datos
- Maneja detalles técnicos específicos

**Árbol de Directorios**

```bash
infrastructure/
├── datasources/
│   └── postgres/
│       └── auth.datasource.impl.ts # IMPLEMENTACIÓN del datasource
├── repositories/
│   └── auth.repository.impl.ts     # IMPLEMENTACIÓN del repositorio
└── mappers/
    └── user.mapper.ts              # Convierte datos DB ↔ Entidades
```

Esto es lo más fácil, solo hay que saber que aquí es donde se implementan los contratos definidos en la Capa de Dominio.

**Ejemplo de DataSource Implementation**

```typescript
export class AuthDataSourceImpl implements AuthDatasource {
  constructor(
    private hashPassword: HashPasswordFuncion,
    private comparePassword: ComparePasswordFuncion,
  ) { }
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { name, email, password } = registerUserDto;

    try {
      const pool = PostgresDatabase.getPool();

      // Verificar si el correo existe
      const selectUserQuery = `SELECT * FROM "user" WHERE email = $1`;
      const values = [email];
      const res = await pool.query(selectUserQuery, values);

      if (res.rows.length > 0)
        throw CustomError.badRequest("Problem with your credentials");

      // Crear el usuario sabiendo que no hay otro con un email igual
      const createUserQuery =
        'INSERT INTO "user" (email, name, password) VALUES ($1, $2, $3) RETURNING *;';
      const hashedPassword = this.hashPassword(password);
      const createUserValues = [email, name, hashedPassword];
      const resCreatedUser = await pool.query(
        createUserQuery,
        createUserValues,
      );

      console.log(resCreatedUser.rows);

      const createdUser = resCreatedUser.rows[0];


      return Promise.resolve(UserMapper.userEntityFromObject(createdUser));
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer();
    }
  }
}
```

Este datasouce cumple el contrato definido en Dominio, si en un futuro en lugar de usar **PostgreSQL**, queremos usar **MongoDB** solo tendriamos que crear otro datasource que implemente el mismo contrato.

## 📋 Reglas de Oro

1. Las capas internas **NO** conocen las externas
2. Solo se importa hacia adentro (Domain ← Infrastructure ← Presentation)
3. Las interfaces se definen en Domain
4. Las implementaciones van en Infrastructure
5. La lógica de negocio **SOLO** va en Domain

Esta arquitectura te permite tener un código mantenible, testeable y escalable, donde cada capa tiene una responsabilidad clara y está completamente desacoplada de las demás.

