export const environment = {
    api: {
        urls: {
            serviceUsers: '${GATEWAY_ENDPOINT:-http://localhost:8000}/users-service',
            serviceCourses: '${GATEWAY_ENDPOINT:-http://localhost:8000}/courses-service',
        }
    },
    keycloak: {
        config: {
            url: '${KEYCLOAK_URL:-http://localhost:8003/auth}',
            realm: '${KEYCLOAK_REALM:-SpringBootKeycloak}',
            clientId: '${KEYCLOAK_CLIENT_ID:-courses-app}',
        }
    }
};
