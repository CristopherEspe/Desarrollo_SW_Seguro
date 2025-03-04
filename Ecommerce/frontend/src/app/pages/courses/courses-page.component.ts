import { Component, OnInit } from '@angular/core';
import { CourseModel } from '@app/models';
import { CourseService } from '@app/services';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { SharedModule } from '@app/shared';
import { EnrollmentStatus } from '@app/models/enrollment-status.model';
import { AuthService } from '@app/services/auth.service';

interface CourseTableItem {
    data: CourseModel;
    actions: MenuItem[];
    showPassword?: boolean;
}

@Component({
    standalone: true,
    templateUrl: './courses-page.component.html',
    imports: [
        SharedModule,
        TableModule,
        ButtonModule,
        MenuModule,
    ]
})
export class CoursesPageComponent implements OnInit {
    public rows: CourseTableItem[] = [];

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private courseService: CourseService,
        private router: Router,
        public authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.loadCourses();
    }

    public async loadCourses(): Promise<void> {
        const courses = await lastValueFrom(this.courseService.getAll());

        this.rows = courses.map((course) => ({
            data: {
                ...course,
                totals: {
                    enrolled: course.enrollments.filter((enrollment) => enrollment.status === EnrollmentStatus.ENROLLED).length,
                    canceled: course.enrollments.filter((enrollment) => enrollment.status === EnrollmentStatus.CANCELED).length,
                }
            },
            actions: [
                {
                    label: 'Editar',
                    icon: 'pi pi-pencil',
                    command: () => this.goToCourseForm(course),
                },
                {
                    label: 'Eliminar',
                    icon: 'pi pi-trash',
                    command: () => this.deleteCourse(course),
                },
            ],
            showPassword: false,
        }));
    }

    public goToCourseForm(course?: CourseModel): void {
        if (course) {
            this.router.navigate(['/courses/edit', course.id]);
        } else {
            this.router.navigate(['/courses/add']);
        }
    }

    public async deleteCourse(course: CourseModel) {
        this.confirmationService.confirm({
            message: `Estas seguro que deseas eliminar el curso '${course.name}'?`,
            header: 'Confirmación',
            icon: 'pi pi-info-circle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: async () => {
                await lastValueFrom(this.courseService.delete(course.id));
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Curso Eliminado' });
                await this.loadCourses();
            },
            reject: () => {}
        });
    }
}
