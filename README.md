# TP-Parte-I---BD2
## Primera parte del TP de la materia BD2 (sql)

El archivo tp-queries.sql contiene las sentencias para las preguntas del ejercicio 1.
El archivo tp-views-queries.sql contiene las sentencias para las preguntas del ejercicio 2.

## Ejecucion de API
Ya con una base de datos postgreSQL corriendo, ejecutar el archivo "ITBA_2023_esquema_facturacion.sql" para generar el Schema y poblar la base de datos.
La api fue desarrollada con node.js, pg y express por lo que se deben instalar el respectivo runtime environment y sus modulos.
Instrucciones de instalacion y ejecución.
1) Clonar el repositorio localmente.
2) Instalar postgreSQL o tener una imagen y contenedor localmente como por ejemplo en docker.
3) Ejecutar el archivo "ITBA_2023_esquema_facturacion.sql" para crear el schema y poblar la BD.
4) Instalar node.js desde su página web.
5) Posicionarse en el directorio "api" y ejecutar el comando "npm install".
6) Utilizar el archivo "config.json" para configurar la base de datos postgreSQL que esté utilizando.
7) Para ejecutar la api, correr desde una terminal el comando "node ."   .

###Queries requeridas:
Las queries correspondientes a este ejercicio están en el archivo "tp-queries.sql"
###Vistas requeridas:
Las vistas correspondientes a etse ejercicio están en el archivo "tp-views-queries.sql"
###Api:
Los endpoints se encuentran index.js. Uno es "/clientes" y otro es "/productos".

