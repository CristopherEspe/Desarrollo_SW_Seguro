import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { SharedModule } from '@app/shared/shared.module';
import { KeycloakProfile } from 'keycloak-js';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: true,
    imports: [
        SharedModule,
        RouterModule
    ],
})
export class SidebarComponent implements OnInit {
    public routes: any[] = [];
    public isLogged: boolean = false;
    public userProfile: KeycloakProfile | undefined;

    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
        this.isLogged = this.authService.isLoggedIn();
        this.updateRoutes();

        if (this.isLogged) {
            this.authService.userProfile().subscribe((profile) => {
                this.userProfile = profile;
                this.updateRoutes();
            });
        }
    }

    logout() {
        this.authService.logout();
    }

    private updateRoutes(): void {
        const baseRoutes = [
            {
                title: 'Usuarios',
                icon: 'users',
                link: ['/users'],
                active: false,
            },
            {
                title: 'Productos',
                icon: 'book',
                link: ['/products'],
                active: false,
            },
        ];

        if (this.authService.isLoggedIn() && this.authService.hasRole('admin')) {
            this.routes = [
                ...baseRoutes,
                {
                    title: 'Gestión de Productos',
                    icon: 'cogs',
                    link: ['/products/admin'],
                    active: false,
                },
                {
                    title: 'Gestión de Inventario',
                    icon: 'warehouse',
                    link: ['/inventory'],
                    active: false,
                },
                {
                    title: 'Órdenes',
                    icon: 'clipboard',
                    link: ['/orders/admin'],
                    active: false,
                },
            ];
        } else {
            this.routes = baseRoutes;
        }
    }
}