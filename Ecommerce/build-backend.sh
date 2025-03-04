#!/bin/bash

# Guarda el directorio actual
rootpath=$(pwd)

# Navega a la carpeta 'backend'
cd "$rootpath/backend"

# Establece las rutas de los servicios
auth_service_path="$PWD/msvc-auth"
gateway_service_path="$PWD/msvc-gateway"
eureka_service_path="$PWD/msvc-registry"
users_service_path="$PWD/msvc-users"
courses_service_path="$PWD/msvc-courses"

echo "Building backend services"

echo "Building auth service"
cd "$auth_service_path"
./build.sh

echo "Building gateway service"
cd "$gateway_service_path"
./build.sh

echo "Building eureka service"
cd "$eureka_service_path"
./build.sh

echo "Building users service"
cd "$users_service_path"
./build.sh

echo "Building courses service"
cd "$courses_service_path"
./build.sh

echo "Backend services build completed"

# Regresa al directorio original
cd "$rootpath"
