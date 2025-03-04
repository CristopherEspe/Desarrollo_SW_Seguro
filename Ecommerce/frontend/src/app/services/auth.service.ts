import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { from, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private keycloakService: KeycloakService) {}

    public isLoggedIn(): boolean {
        return this.keycloakService ? this.keycloakService.isLoggedIn() : false;
    }

    public isAdmin(): boolean {
        return this.keycloakService.getUserRoles().includes('admin');
    }

    public logout() {
        this.keycloakService.logout();
    }

    public userProfile(): Observable<KeycloakProfile> {
        return from(this.keycloakService.loadUserProfile());
    }

    public hasRole(role: string): boolean {
        return this.keycloakService.getUserRoles().includes(role);
    }
}
