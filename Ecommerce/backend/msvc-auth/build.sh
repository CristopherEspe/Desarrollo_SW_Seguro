#!/bin/bash

# Guarda el directorio actual
rootpath=$(pwd)

# Comentar las líneas correspondientes de maven que están en el script original
# mvn -DskipTests clean package && mkdir -p ./target/release && cp ./target/*.jar ./target/release/application.jar
# mvn -DskipTests clean package

# Ejecutar el comando mvn desde un script mvn.sh
mvn -DskipTests clean package

# Espera 1 segundo
sleep 1

# Crea el directorio de lanzamiento si no existe
mkdir -p "$rootpath/release"

echo "Copying jar file to release folder"

# Copia el archivo JAR a la carpeta de lanzamiento
for f in "$rootpath/target/"*.jar; do
    cp -f "$f" "$rootpath/release/application.jar"
done

echo "Build completed"
