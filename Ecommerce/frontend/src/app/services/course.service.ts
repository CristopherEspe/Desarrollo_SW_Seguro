import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseModel } from '@app/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    public constructor(private client: HttpClient) {}

    public getAll(): Observable<CourseModel[]> {
        return this.client.get<CourseModel[]>(`${environment.api.urls.serviceCourses}/courses`);
    }

    public getById(id: string): Observable<CourseModel> {
        return this.client.get<CourseModel>(`${environment.api.urls.serviceCourses}/courses/${id}`);
    }

    public create(course: CourseModel): Observable<CourseModel> {
        return this.client.post<CourseModel>(`${environment.api.urls.serviceCourses}/courses`, course);
    }

    public update(course: CourseModel): Observable<CourseModel> {
        return this.client.put<CourseModel>(`${environment.api.urls.serviceCourses}/courses`, course);
    }

    public delete(id: number): Observable<void> {
        return this.client.delete<void>(`${environment.api.urls.serviceCourses}/courses/${id}`);
    }

    public search(query: string): Observable<CourseModel[]> {
        return this.client.get<CourseModel[]>(`${environment.api.urls.serviceCourses}/courses/search`, {
            params: {
                query,
            },
        });
    }
}
