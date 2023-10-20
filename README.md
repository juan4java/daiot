# TP DAIOT
El desarrollo del TP esta dentro de cada carpeta.

TIP
Buscar #SETME en todo el directorio del TP (Ctrl + f) para ver donde hay que ajustar claves u otros datos.

# 0-Frontend
IONIC app, se debe iniciar el docker compose.

# 1-Backend
Se incluye el dokerbuild, por lo tanto es posible crear una imagen con el comando "docker build . -t daiot-be" y luego mediante el comando "docker compose up"

# 2-db
Se incluye un docker compose, que brinda una base de datos local y una interfaz web para usarla. Se puede iniciar mediante el comando "docker compose up"
El proyecto de backend se conectara si se ajusta la base de datos a esta instancia.

# 3-Mongo Db
Se empleo un mongo db directamente cloud, por este motivo para iniciar la conexión desde el proyecto en backend, se debe configurar la conexion (si no esta disponible la instancia que arme para el proyecto).

# 4-MQTT
Todo lo referido a mosquitto, se deja replicado (certificados).

# 6-ESP32
Proyecto para ESP32 se debe configurar la red WIFI.