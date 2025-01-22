# PROYECTO SEGUNDO PARCIAL - Image Analyzer

### Integrantes
- Jhon Munarco
- Shirley Otuna
- Cristopher Zambrano

## Descripción

**Image Analyzer** es una aplicación web que permite a los usuarios subir imágenes, analizarlas y gestionar su aprobación o rechazo por parte de administradores. La aplicación utiliza un frontend desarrollado con Angular y un backend construido con Flask y Express, junto con una base de datos MySQL para almacenar la información relacionada con los usuarios y las imágenes.

## Tecnologías Utilizadas

- **Frontend**:
  - Angular
  - EJS (Embedded JavaScript)
  - HTML/CSS

- **Backend**:
  - Flask (Python)
  - Express (Node.js)
  - Multer (para la subida de archivos)

- **Base de Datos**:
  - MySQL

- **Contenerización**:
  - Docker


## Funcionalidades

- **Subida de Imágenes**: Los usuarios pueden subir imágenes a través del frontend.
- **Análisis de Imágenes**: Se realizan análisis sobre las imágenes subidas, como la entropía y la estructura JPEG.
- **Gestión de Usuarios**: Los administradores pueden iniciar sesión, registrarse y gestionar las imágenes subidas (aprobar o rechazar).
- **Interacción con Base de Datos**: Se realizan operaciones CRUD en la base de datos MySQL.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

- [Node.js](https://nodejs.org/) (incluye npm)
- [Python](https://www.python.org/) (preferiblemente la versión 3.7 o superior)
- [MySQL](https://www.mysql.com/)
- [Docker](https://www.docker.com/) (opcional, para contenerización)

## Instalación y Configuración

### Configuración del Backend (Flask)

1. Navega a la carpeta `Service`:

- cd Service


2. Crea un entorno virtual y actívalo:

- python -m venv .venv

- En Windows:
- ..venv\Scripts\activate

- En macOS/Linux:
- source .venv/bin/activate


3. Instala las dependencias:

- pip install -r requirements.txt



4. Configura la base de datos MySQL:

- Crea una base de datos llamada `image_repository`.
- Crea las tablas necesarias (`admins` e `images`) utilizando el siguiente SQL:

  ```
  CREATE TABLE admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL
  );

  CREATE TABLE images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      filepath VARCHAR(255) NOT NULL,
      status ENUM('pending', 'approved') DEFAULT 'pending'
  );
  ```

5. Ejecuta el servidor Flask:

- python app.py


### Configuración del Frontend (Angular)

1. Navega a la carpeta `Client/image-analyzer-client`:

- cd Client/image-analyzer-client


2. Instala las dependencias de Angular:

- npm install


3. Inicia el servidor de desarrollo Angular:

- ng serve


4. Accede a la aplicación en tu navegador en `http://localhost:4200`.

### Contenerización con Docker (Opcional)

Si deseas ejecutar la aplicación en un contenedor Docker, sigue estos pasos:

1. Navega a la carpeta `Service` donde se encuentra el archivo `dockerfile`.

2. Construye la imagen Docker:

- docker build -t image-analyzer .


3. Ejecuta el contenedor:

- docker run -p 5000:5000 image-analyzer


## Uso

1. Abre tu navegador y ve a `http://localhost:4200` para acceder al frontend.
2. Puedes registrarte como nuevo usuario o iniciar sesión si ya tienes una cuenta.
3. Una vez dentro, puedes subir imágenes para su análisis.
4. Los administradores pueden gestionar las imágenes subidas desde el panel correspondiente.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el proyecto, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.

---


