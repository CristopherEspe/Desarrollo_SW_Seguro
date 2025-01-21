from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
from analysis import calculate_entropy, analyze_jpeg_structure, analyze_with_binwalk, analyze_with_pngcheck
import mysql.connector


# curl -X POST -F "file=@C:\Users\Cristopher\Documents\OpenPuff_release\images\Gorila.png" http://localhost:5000/upload

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '12345678',
    'database': 'image_repository'
}

def connect_db():
    return mysql.connector.connect(**DB_CONFIG)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    entropy = calculate_entropy(file_path)
    jpeg_structure = analyze_jpeg_structure(file_path)
    binwalk_analysis = analyze_with_binwalk(file_path)
    png_analysis = analyze_with_pngcheck(file_path)

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

    report = {
        'file': filename,
        'entropy': entropy,
        'jpeg_structure': jpeg_structure,
        'binwalk_analysis': binwalk_analysis,
        'png_analysis': png_analysis,
        'message': 'Image uploaded successfully and pending approval.'
    }
    return jsonify(report)

@app.route('/approve/<int:image_id>', methods=['POST'])
def approve_image(image_id):
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("CALL approve_image(%s, %s)", (image_id, 1))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Image approved successfully'})
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

@app.route('/reject/<int:image_id>', methods=['POST'])
def reject_image(image_id):
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("CALL reject_image(%s)", (image_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Image rejected and deleted successfully'})
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
