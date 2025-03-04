package ec.edu.espe.msvc.auth.keycloak;

import ec.edu.espe.msvc.auth.keycloak.providers.JsonProviderFactory;
import jakarta.ws.rs.ApplicationPath;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.Config;
import org.keycloak.exportimport.ExportImportConfig;
import org.keycloak.exportimport.ExportImportManager;
import org.keycloak.models.KeycloakSession;
import org.keycloak.services.managers.ApplianceBootstrap;
import org.keycloak.services.resources.KeycloakApplication;
import org.keycloak.services.util.JsonConfigProviderFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.util.NoSuchElementException;

@Slf4j
@ApplicationPath("/")
public class App extends KeycloakApplication {

	static ServerProperties properties;

	@Override
	protected void loadConfig() {
		JsonConfigProviderFactory factory = new JsonProviderFactory();
		Config.init(factory.create().orElseThrow(() -> new NoSuchElementException("No value present")));
	}

	@Override
	protected ExportImportManager bootstrap() {
		final ExportImportManager exportImportManager = super.bootstrap();
        createMasterRealmAdminUser();
		tryImportRealm();
		return exportImportManager;
	}

	protected void tryImportRealm() {
		Resource importResource = new FileSystemResource(properties.importFile());

		if (!importResource.exists()) {
			log.info("Could not find keycloak import file {}", importResource);
			return;
		}

		File file;
		try {
			file = importResource.getFile();
		} catch (IOException e) {
			log.error("Could not read keycloak import file {}", importResource, e);
			return;
		}

		log.info("Starting Keycloak realm configuration import from location: {}", importResource);

		KeycloakSession session = getSessionFactory().create();
		session.getTransactionManager().begin();
		boolean realmExists = session.realms().getRealmByName("SpringBootKeycloak") != null;
		session.getTransactionManager().commit();

		if (!realmExists) {
			ExportImportConfig.setAction("import");
			ExportImportConfig.setProvider("singleFile");
			ExportImportConfig.setFile(file.getAbsolutePath());
			ExportImportManager manager = new ExportImportManager(session);
			manager.runImport();
			log.info("Keycloak realm configuration import finished.");
		} else {
			log.info("Keycloak realm already exists, skipping import.");
		}

		session.close();
	}

	private void createMasterRealmAdminUser() {
		try (KeycloakSession session = getSessionFactory().create()) {
			ApplianceBootstrap applianceBootstrap = new ApplianceBootstrap(session);
			try {
				session.getTransactionManager().begin();
				log.info("Creating keycloak master admin user with username: {} and password: {}", properties.username(), properties.password());
				applianceBootstrap.createMasterRealmUser(properties.username(), properties.password());
				session.getTransactionManager().commit();
			} catch (Exception ex) {
				log.warn("Couldn't create keycloak master admin user: {}", ex.getMessage());
				session.getTransactionManager().rollback();
			}
		}
	}

}
