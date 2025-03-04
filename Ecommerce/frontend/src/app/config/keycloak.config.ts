import { KeycloakService } from 'keycloak-angular';
import { environment } from '@env/environment';
import { AuthService } from '@app/services/auth.service';

export function initializeKeycloak(keycloak: KeycloakService, authService: AuthService) {
    return () =>
      keycloak.init({
        config: {
          ...environment.keycloak.config,
        },
        initOptions: {
            flow: 'standard',
            onLoad: 'login-required',
            scope: 'openid profile email',
            silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
        },
        loadUserProfileAtStartUp: true,
        enableBearerInterceptor: true,
        bearerPrefix: 'Bearer',
        shouldAddToken: (request) => {
            const { url } = request;

            const unauthorizedPaths = ['/public'];
            const isUnauthorizedPath = unauthorizedPaths.some((path) => url.includes(path));

            return !isUnauthorizedPath;
        }
    }).then(async (isAuthenticated) => {
        if (isAuthenticated) {
            console.log('User is authenticated', keycloak.getUsername());
        } else {
            console.log('User is not authenticated');
        }
    });
}
