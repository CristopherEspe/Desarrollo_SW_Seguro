import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserModel } from '@app/models';
import { SharedModule } from '@app/shared';
import { lastValueFrom, map } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { UserService } from '@app/services';

@Component({
    standalone: true,
    templateUrl: './user-form.component.html',
    imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
    ]
})
export class UserFormComponent implements OnInit {
    public userForm: FormGroup = new FormGroup({
        id: new FormControl(null),
        name: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required]),
    });
    public user: UserModel | null = null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        const user$ = this.activatedRoute.data.pipe(map((data) => data['user']));

        user$.subscribe((user) => {
            if (user) {
                this.user = user;
                this.userForm.patchValue(user);
            }
        });
    }

    public async onSubmit() {
        await lastValueFrom(this.userService[this.user ? 'update' : 'create'](this.userForm.value));
        this.router.navigate(['/users']);
    }
}
