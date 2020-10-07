# Keflix (servidor)
Servidor para la aplicación mencionada en: https://github.com/adri1336/keflix_app_tv
Descarga el último lanzamiento desde: https://github.com/adri1336/keflix_server/releases

Para Raspberry descarga la versión ARMv7, ha sido probado en una Raspberry PI 4 (funciona sin problemas).

## Archivo de configuración (.env)
Debes crear un archivo .env en la carpeta raíz del servidor, debe contener los siguientes parámetros:
| Parámetro | Descripción | Ejemplo |
| ------------- | ------------- | ------------- |
| APP_PORT | Puerto en el que se ejecutará el servidor | 3000 |
| ACCESS_TOKEN_SECRET | Cadena aleatoria para generar los token de acceso | dYGwWAY7kKvDxJf3 |
| ACCESS_TOKEN_EXPIRES_IN | Tiempo de vida del token de acceso | 3d |
| REFRESH_TOKEN_SECRET | Cadena aleatoria para generar los token de refresco | JLPqBeMRdA93cJT3 |
| REFRESH_TOKEN_EXPIRES_IN | Tiempo de vida del token de refresco | 7d |
| MEDIA_PATH | Ruta absoluta donde se guardarán las películas (puede ser un disco duro) | /mnt/media |
| DATABASE_PATH (>=v1.1.0) | Ruta absoluta donde está o se creará la base de datos del servidor | /mnt/media/database.sqlite |
| DEBUG_ENABLED (opcional) | Activa o desactiva la depuración | false |
| DATABASE_LOGGING (opcional) | Activa o desactiva la depuración de la DB | false |
| FORCE_DATABASE_SYNC (opcional) | Fuerza la sincronización de las tablas (borra la DB y la crea de nuevo) | false |

## Como crear el primer usuario administrador
Activa el modo depuración (DEBUG_ENABLED = true) y al arrancar el servidor podrás ingresar el correo y contraseña para crear un usuario administrador desde la consola.
