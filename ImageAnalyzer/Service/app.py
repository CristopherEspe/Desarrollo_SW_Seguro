from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
from analysis import analyze_with_binwalk, analyze_with_pngcheck
import mysql.connector

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '12345678',
    'database': 'image_repository'
}

def connect_db():
    """
    Crea una conexión a la base de datos.
    """
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except mysql.connector.Error as e:
        raise Exception(f"Database connection error: {e}")

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Sube un archivo, lo analiza y guarda los detalles en la base de datos.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Crear directorio de uploads si no existe
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Guardar archivo
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    try:
        file.save(file_path)
    except Exception as e:
        return jsonify({'error': f'Failed to save file: {str(e)}'}), 500

    # Realizar análisis
    binwalk_analysis = analyze_with_binwalk(file_path)
    png_analysis = analyze_with_pngcheck(file_path)

    # Guardar datos en la base de datos
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO images (filename, filepath, status) VALUES (%s, %s, %s)",
            (filename, file_path, 'pending')
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    # Respuesta
    report = {
        'file': filename,
        'binwalk_analysis': binwalk_analysis,
        'png_analysis': png_analysis,
        'message': 'Image uploaded successfully and pending approval.'
    }
    return jsonify(report)

@app.route('/images', methods=['GET'])
def get_images():
    """
    Recupera la lista de imágenes almacenadas en la base de datos.
    """
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM images")
        images = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(images)
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

@app.route('/approve/<int:image_id>', methods=['POST'])
def approve_image(image_id):
    """
    Aprueba una imagen cambiando su estado en la base de datos.
    """
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("CALL approve_image(%s, %s)", (image_id, 1))  # Ajustar según tu procedimiento almacenado
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Image approved successfully'})
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

@app.route('/reject/<int:image_id>', methods=['POST'])
def reject_image(image_id):
    """
    Rechaza una imagen eliminándola de la base de datos y del sistema de archivos.
    """
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)

        # Obtener información de la imagen antes de eliminarla
        cursor.execute("SELECT filepath FROM images WHERE id = %s", (image_id,))
        image = cursor.fetchone()

        if not image:
            return jsonify({'error': 'Image not found'}), 404

        file_path = image['filepath']

        # Llamar al procedimiento almacenado para rechazar la imagen
        cursor.execute("CALL reject_image(%s)", (image_id,))
        conn.commit()

        # Eliminar archivo del sistema
        if os.path.exists(file_path):
            os.remove(file_path)

        cursor.close()
        conn.close()
        return jsonify({'message': 'Image rejected and deleted successfully'})
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
