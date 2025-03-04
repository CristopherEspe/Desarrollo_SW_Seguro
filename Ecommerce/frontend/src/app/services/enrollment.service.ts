import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnrollmentCreateModel, EnrollmentModel } from '@app/models/enrollment.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

type EnrollmentsMappedByCourse = Record<number, EnrollmentModel>;

@Injectable({
    providedIn: 'root'
})
export class EnrollmentService {
    constructor(
        private http: HttpClient
    ) {}

    public getEnrollments(): Observable<EnrollmentModel[]> {
        return this.http.get<EnrollmentModel[]>(`${environment.api.urls.serviceCourses}/enrollments`);
    }

    public getEnrollmentsMappedByCourse(): Observable<EnrollmentsMappedByCourse> {
        return this.http.get<EnrollmentsMappedByCourse>(`${environment.api.urls.serviceCourses}/enrollments/course-mapped`);
    }

    public cancelEnrollment(enrollment: EnrollmentModel): Observable<any> {
        return this.http.get(`${environment.api.urls.serviceCourses}/enrollments/cancel/${enrollment.id}`);
    }

    public enroll(enrollment: EnrollmentCreateModel): Observable<any> {
        return this.http.post(`${environment.api.urls.serviceCourses}/enrollments`, enrollment);
    }

    public deleteEnrollmentsByUserId(userId: number): Observable<any> {
        return this.http.delete(`${environment.api.urls.serviceCourses}/enrollments/delete-user-enrollments/${userId}`);
    }
}
