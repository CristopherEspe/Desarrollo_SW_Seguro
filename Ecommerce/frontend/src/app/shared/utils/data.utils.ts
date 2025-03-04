export class DataUtils {
    public static getHttpServiceError(error: any, title: string = 'Ocurrió un error al enviar la solicitud'): string {
        let message = `${title}`;

        if (error.error && error.error.message) {
            message += `:\n\n ${error.error.message}`;
        }

        return message;
    }
}
