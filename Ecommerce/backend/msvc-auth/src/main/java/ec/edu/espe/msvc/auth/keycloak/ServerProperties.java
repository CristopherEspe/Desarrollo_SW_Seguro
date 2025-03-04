package ec.edu.espe.msvc.auth.keycloak;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "keycloak.server")
public record ServerProperties(
        String contextPath,
        Integer port,
        String username,
        String importFile,
        String password) {}
