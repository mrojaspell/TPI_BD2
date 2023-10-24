# TPO - BD2
### Integrantes: 
- Máximo Rojas Pelliccia
- Marcos Casiraghi
- Marcos Gronda

## Requisitos:
1) PostgreSQL
2) Node JS 
3) npm

## Setup inicial
1) Correr base de datos postgreSQL.
2) Clonar repositorio.
2) Ejecutar el archivo "ITBA_2023_esquema_facturacion.sql" para generar el Schema y poblar la base de datos.

## Queries y vistas requeridas (Parte 1 - SQL)
- Las queries correspondientes a este ejercicio están en el archivo "tp-queries.sql"
- Las vistas correspondientes a etse ejercicio están en el archivo "tp-views-queries.sql"

## Ejecucion de API
La api fue desarrollada con node.js, pg y express por lo que se deben instalar el respectivo runtime environment y sus modulos.

1) Posicionarse en el directorio "api" y ejecutar el comando "npm install".
2) Utilizar el archivo "config.json" para configurar la base de datos postgreSQL que esté utilizando. [ Ver tabla 1 ]
3) Correr desde una terminal el comando "node ." para inicar la API

## Tabla 1: configuracion de API
| Nombre            | Descripcion                                    | Valor aceptado                  |
|-------------------|------------------------------------------------|---------------------------------|
| port              | El puerto que en donde se levanta el servidor. | Valor numerico entero positivo. |
| postgres.user     | Usuario de postgres de la base local.          | Cadena de caracteres.           |
| postgres.password | Contrasena del usuario postgres.               | Cadena de caracteres.           |
| postgres.host     | IP en donde se encuentra la base de datos.     | Cadena de caracteres.           |
| postgres.port     | Puerto en cual se encuentra la base de datos.  | Cadena de caracteres.           |
| postgres.database | Nombre de base de datos.                       | Cadena de caracteres.           |

## Tabla 2: Endpoints de API
| Path            | Metodo HTTP | Descripcion                                               | 
|-----------------|-------------|-----------------------------------------------------------|
| /clientes       | GET         | Se obtiene una lista de todos los clientes con sus datos. |
| /clientes       | POST        | Se crea un nuevo cliente.                                 | 
| /clientes/{id}  | GET         | Se obtiene un cliente con sus datos, dado su id.          |
| /clientes/{id}  | DELETE      | Se elimina un cliente, dado su id.                        |
| /clientes/{id}  | PUT         | Se reemplazan los datos de un cliente, dado su id.        |
| /productos      | POST        | Se crea un nuevo producto.                                | 
| /productos/{id} | PUT         | Se reemplazan los datos de un producto, dado su id.       |

## Tabla 3: Formatos aceptados para POST y PUT para _clientes_

- Se espera una objeto JSON con los siguientes valores:

| Nombre      | Valor aceptado                                 |
|-------------|------------------------------------------------|
| nro_cliente | Entero positivo.                               |
| nombre      | Cadena de caracteres, con longitud menor a 44. |
| apellido    | Cadena de caracteres, con longitud menor a 44. |
| direccion   | Cadena de caracteres, con longitud menor a 44. |
| activo      | Entero positivo perteneciente a {0,1}          |

## Tabla 4: Formatos aceptados para POST y PUT para _productos_

- Se espera una objeto JSON con los siguientes valores:

| Nombre      | Valor aceptado                                 |
|-------------|------------------------------------------------|
| marca       | Cadena de caracteres, con longitud menor a 44. |
| nombre      | Cadena de caracteres, con longitud menor a 44. |
| descripcion | Cadena de caracteres, con longitud menor a 44. |
| precio      | Punto flotante mayor a 0.                      |
| stock       | Entero positivo.                               |

## Migración de Datos de PSQL a Mongo
En el repositorio se encuentra el archivo migration.mongodb dentro de la carpeta de migration que cuenta con las queries necesarias para popular la base de datos de Mongo.

De todas formas, existe un script que puede realizar una migración real time. 

Estos son los pasos necesarios para realizarlo:

1)  Tener corriendo las imágenes de ambas base de datos
2)  En el archivo config.json de la carpeta de migration, completar los campos que figuran en la tabla 1 con los respectivos de su imagen de psql. Asi mismo, completar los campos "host", "port" y "database" con los de la imagen de mongo.
3)  En una terminal situada en la carpeta migration, correr los siguientes comandos:
```
npm install
node .
```

Este ultimo comando puede llegar a tardar unos segundos pero una vez realizado la base de datos de Mongo va a estar cargada con los mismos datos que se encuentran en el archivo mencionado previamente.



