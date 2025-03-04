import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CourseModel } from '@app/models';
import { SharedModule } from '@app/shared';
import { lastValueFrom, map } from 'rxjs';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CourseService } from '@app/services';

@Component({
    standalone: true,
    templateUrl: './course-form.component.html',
    imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
    ]
})
export class CourseFormComponent implements OnInit {
    public courseForm: FormGroup = new FormGroup({
        id: new FormControl(null),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [])
    });
    public course: CourseModel | null = null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private courseService: CourseService
    ) {}

    ngOnInit(): void {
        const course$ = this.activatedRoute.data.pipe(map((data) => data['course']));

        course$.subscribe((course) => {
            if (course) {
                this.course = course;
                this.courseForm.patchValue(course);
            }
        });
    }

    public async onSubmit() {
        if (!this.courseForm.get('description')?.value.trim()) {
            this.courseForm.get('description')?.setValue(null);
        }

        await lastValueFrom(this.courseService[this.course ? 'update' : 'create'](this.courseForm.value));
        this.router.navigate(['/courses']);
    }
}
