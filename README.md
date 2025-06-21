# Clean Architecture

## Introducción 

Cuando empiezas en el mundo del desarrollo de *software*, lo más común es elegir un lenguaje con el que comenzar. Luego sigues con mini proyectos hasta llegar al punto en que quieres realizar tu primer proyecto serio (ya sea pequeño o mediano). En ese momento, es probable que, entre la gran cantidad de problemas que se te presentan --como qué librerías utilizar--, el problema de qué arquitectura usar para organizar tu código no sea uno de ellos.

A primera vista, el cómo organizar tu código quizás no suene interesante, pero eso está muy lejos de la realidad. Plantear una buena base y arquitectura te facilitará escalar tu aplicación, que en un principio puede ser pequeña, hacia algo de mayor envergadura e importancia.

Lo más común que habrás escuchado sobre arquitectura/diseño de software seguramente sea el término *Clean Architecture*. Pero, ¿qué es realmente esto?

## ¿ Qué es Clean Architecture?

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


