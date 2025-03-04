package ec.edu.espe.msvc.auth;

import ec.edu.espe.msvc.auth.keycloak.ServerProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseAutoConfiguration;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(exclude = LiquibaseAutoConfiguration.class)
@EnableConfigurationProperties(ServerProperties.class)
public class MsvcAuthApplication {
    private static final Logger LOG = LoggerFactory.getLogger(MsvcAuthApplication.class);

    public static void main(String[] args) throws Exception {
        SpringApplication.run(MsvcAuthApplication.class, args);
    }

    @Bean
    ApplicationListener<ApplicationReadyEvent> onApplicationReadyEventListener(
            ServerProperties serverProperties) {
        return (evt) -> {
            Integer port = serverProperties.port();
            String keycloakContextPath = serverProperties.contextPath();
            LOG.info("Embedded Keycloak started: http://localhost:{}{} to use keycloak",
                    port, keycloakContextPath);
        };
    }
}