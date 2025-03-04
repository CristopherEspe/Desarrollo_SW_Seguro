import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CourseModel, UserModel } from '@app/models';
import { CourseService, UserService } from '@app/services';
import { Observable } from 'rxjs';

export const routes: Routes = [
    {
        path: '',
        title: 'Cursos',
        loadComponent: async () => (await import('./courses-page.component')).CoursesPageComponent,
    },
    {
        path: 'add',
        title: 'Agregar curso',
        loadComponent: async () => (await import('./components/course-form/course-form.component')).CourseFormComponent,
    },
    {
        path: 'edit/:id',
        title: 'Editar curso',
        loadComponent: async () => (await import('./components/course-form/course-form.component')).CourseFormComponent,
        resolve: {
            course: (route: any, state: any): Observable<CourseModel> => {
                const id = route.paramMap.get('id');
                return inject(CourseService).getById(id);
            }
        }
    }
]
