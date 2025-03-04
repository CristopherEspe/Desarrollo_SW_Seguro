import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { SharedModule } from '@app/shared';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CourseService, EnrollmentService, ToastService, UserService } from '@app/services';
import { CourseModel, UserModel } from '@app/models';
import { DataUtils } from '@app/shared/utils/data.utils';

@Component({
    standalone: true,
    selector: 'enrollment-form',
    templateUrl: './enrollment-form.component.html',
    styleUrls: ['./enrollment-form.component.scss'],
    imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        AutoCompleteModule,
        RouterLink,
        ButtonModule,
    ]
})
export class EnrollmentFormComponent implements OnInit {
    enrollmentForm: FormGroup = new FormGroup({
        course: new FormControl(null, [Validators.required]),
        users: new FormControl([], [Validators.required]),
    });

    courses: CourseModel[] = [];
    users: UserModel[] = [];
    selectedCourse: CourseModel | null = null;

    constructor(
        private router: Router,
        private courseService: CourseService,
        private userService: UserService,
        private toastService: ToastService,
        private enrollmentService: EnrollmentService
    ) {}

    ngOnInit(): void {}

    public async onSubmit() {
        try {
            const selectedUsers = this.enrollmentForm.get('users')?.value;

            await lastValueFrom(this.enrollmentService.enroll({
                courseId: this.selectedCourse!.id,
                userIds: selectedUsers.map((user: UserModel) => user.id),
            }));

            this.toastService.showSuccess('Atención', 'La inscripción se realizó correctamente');
            this.router.navigate(['/enrollments']);
        } catch (error) {
            this.toastService.showError('Error', DataUtils.getHttpServiceError(error, 'Error al inscribir al usuario'));
        }
    }

    public searchCourses(event: any): void {
        this.courseService.search(event.query).subscribe((courses) => {
            this.courses = courses;
        });
    }

    public searchUsers(event: any): void {
        const selectedUsers = this.enrollmentForm.get('users')?.value;

        this.userService.search(event.query).subscribe((users) => {
            this.users = users.filter((user) => !selectedUsers.find((u: UserModel) => u.id === user.id));
        });
    }
}
