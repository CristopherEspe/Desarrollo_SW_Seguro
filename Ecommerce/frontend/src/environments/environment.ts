export const environment = {
    api: {
      urls: {
        serviceUsers: 'http://localhost:8080/user-service',
        serviceProducts: 'http://localhost:8080/product-service',
        serviceOrders: 'http://localhost:8080/order-service',
        serviceInventory: 'http://localhost:8080/inventory-service',
        serviceCourses: 'http://localhost:8000/courses-service',
      }
    },
    keycloak: {
      config: {
        url: 'http://localhost:8090/auth',
        realm: 'SpringBootKeycloak',
        clientId: 'EcovidaClient',
        // clientSecret: 'Z0AMkqPVXiUNkgUgn9AE1wmiey08Zfwg',
      }
    }
  };
  