import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentModel } from '@app/models/enrollment.model';
import { CourseService, EnrollmentService, ToastService } from '@app/services';
import { SharedModule } from '@app/shared';
import { lastValueFrom } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { EnrollmentStatusNamePipe } from '@app/shared/pipes/enrollment-status.pipe';
import { DataUtils } from '@app/shared/utils/data.utils';
import { AuthService } from '@app/services/auth.service';

interface EnrollmentsTableRow {
    enrollment: EnrollmentModel;
    actions: MenuItem[];
}

@Component({
    standalone: true,
    templateUrl: './enrollments-page.component.html',
    imports: [
        SharedModule,
        ButtonModule,
        TableModule,
        ConfirmDialogModule,
        MenuModule,
        EnrollmentStatusNamePipe,
    ],
    providers: [
        CourseService,
        EnrollmentService,
    ]
})
export class EnrollmentsPageComponent implements OnInit {
    enrollments: EnrollmentModel[] = [];
    enrollmentsRows: EnrollmentsTableRow[] = [];

    constructor(
        private router: Router,
        private enrollmentService: EnrollmentService,
        private toastService: ToastService,
        private confirmationService: ConfirmationService,
        public authService: AuthService,
    ) {}

    async ngOnInit() {
        await this.loadEnrollments();
    }

    public goToEnrollmentForm() {
        this.router.navigate(['/enrollments/add']);
    }

    private async loadEnrollments() {
        this.enrollments = await lastValueFrom(this.enrollmentService.getEnrollments());
        this.enrollmentsRows = this.enrollments.map(enrollment => ({
            enrollment,
            actions: [
                {
                    label: 'Cancelar matrícula',
                    icon: 'pi pi-trash',
                    command: () => this.cancelEnrollment(enrollment),
                }
            ],
        }));
    }

    private async cancelEnrollment(enrollment: EnrollmentModel) {
        this.confirmationService.confirm({
            message: 'Está seguro que desea cancelar la matrícula?',
            header: 'Confirmación',
            icon: 'pi pi-info-circle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            acceptButtonStyleClass:"p-button-text p-button-danger",
            accept: async () => {
                try {
                    await lastValueFrom(this.enrollmentService.cancelEnrollment(enrollment));
                    await this.loadEnrollments();
                    this.toastService.showSuccess('Atención', 'La matrícula ha sido cancelada');
                } catch (error) {
                    console.log(error);
                    this.toastService.showError('Error', DataUtils.getHttpServiceError(error, 'Error al cancelar la matrícula'));
                }
            }
        });
    }
}
