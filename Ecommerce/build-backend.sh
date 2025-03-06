#!/bin/bash

# Obtener la ruta del script
rootpath="$(dirname "$(realpath "$0")")"

cd "$rootpath/backend"

ecovida_inventory_service_path="$PWD/ecovida-inventory-service"
ecovida_order_service_path="$PWD/ecovida-order-service"
ecovida_product_service_path="$PWD/ecovida-product-service"
ecovida_user_service_path="$PWD/ecovida-user-service"
eureka_server_path="$PWD/eureka-server"
gateway_service_path="$PWD/gateway-service"
msvc_auth_path="$PWD/msvc-auth"

chmod +x "$ecovida_inventory_service_path/build.sh"
chmod +x "$ecovida_order_service_path/build.sh"
chmod +x "$ecovida_product_service_path/build.sh"
chmod +x "$ecovida_user_service_path/build.sh"
chmod +x "$eureka_server_path/build.sh"
chmod +x "$gateway_service_path/build.sh"
chmod +x "$msvc_auth_path/build.sh"

echo "Building backend services"

services=(
    "inventory service:$ecovida_inventory_service_path"
    "order service:$ecovida_order_service_path"
    "product service:$ecovida_product_service_path"
    "user service:$ecovida_user_service_path"
    "eureka server:$eureka_server_path"
    "gateway service:$gateway_service_path"
    "auth service:$msvc_auth_path"
)

for service in "${services[@]}"; do
    IFS=":" read -r name path <<< "$service"
    echo "Building $name"
    cd "$path" || exit 1
    ./build.sh || { echo "Error building $name"; exit 1; }
done

echo "Backend services build completed"
cd "$rootpath"