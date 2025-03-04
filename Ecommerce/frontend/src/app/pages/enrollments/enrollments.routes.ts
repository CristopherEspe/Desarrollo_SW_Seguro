import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CourseModel, UserModel } from '@app/models';
import { CourseService, UserService } from '@app/services';
import { Observable } from 'rxjs';

export const routes: Routes = [
    {
        path: '',
        title: 'Matriculas',
        loadComponent: async () => (await import('./enrollments-page.component')).EnrollmentsPageComponent,
    },
    {
        path: 'add',
        title: 'Matricular',
        loadComponent: async () => (await import('./components/enrollment-form/enrollment-form.component')).EnrollmentFormComponent,
    }
]
