import { CourseModel } from './course.model';
import { EnrollmentStatus } from './enrollment-status.model';
import { UserDto } from './user.dto';

export interface EnrollmentModel {
    id: number;
    course: CourseModel;
    user: UserDto;
    status: EnrollmentStatus;
    enrolledAt: Date;
}

export interface EnrollmentCreateModel {
    courseId: number;
    userIds: number[];
}
