import { Pipe, PipeTransform } from '@angular/core';
import { EnrollmentStatus } from '@app/models/enrollment-status.model';

@Pipe({
    standalone: true,
    name: 'enrollmentStatusName'
})
export class EnrollmentStatusNamePipe implements PipeTransform {
    transform(value: EnrollmentStatus): string {
        const label = {
            'ENROLLED': 'Matriculado',
            'CANCELED': 'Cancelado',
            'PENDING': 'Pendente',
        }[value + ''];

        return label || '<Desconocido>';
    }
}
