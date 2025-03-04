import { EnrollmentModel } from './enrollment.model';

export interface CourseModel {
    id: number;
    name: string;
    description: string;
    enrollments: EnrollmentModel[];
}
