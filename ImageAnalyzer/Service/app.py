import os
import subprocess
import json
import math
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

def calculate_entropy(file_path):
    try:
        with open(file_path, 'rb') as f:
            data = f.read()
        
        if not data:
            return 0

        freq = {byte: 0 for byte in range(256)}
        for byte in data:
            freq[byte] += 1

        total = len(data)
        entropy = -sum((freq[byte] / total) * math.log2(freq[byte] / total) for byte in range(256) if freq[byte] > 0)
        
        return entropy
    except Exception as e:
        return f"Error calculating entropy: {str(e)}"


def analyze_jpeg_structure(file_path):
    try:
        result = subprocess.run(['jpeginfo', '-c', file_path], capture_output=True, text=True, timeout=10)
        
        if "ERROR" in result.stderr or "WARNING" in result.stdout:
            return {
                'tool': 'jpeginfo',
                'message': 'Anomalies detected in JPEG structure.',
                'details': result.stderr.strip() or result.stdout.strip()
            }
        
        return {
            'tool': 'jpeginfo',
            'message': 'JPEG structure is valid.',
            'details': result.stdout.strip()
        }
    except Exception as e:
        return {
            'tool': 'jpeginfo',
            'error': str(e)
        }


def analyze_with_binwalk(file_path):
    try:
        result = subprocess.run(['binwalk', file_path], capture_output=True, text=True, timeout=10)
        return {
            'tool': 'Binwalk',
            'message': 'Analysis complete.',
            'details': result.stdout.strip()
        }
    except Exception as e:
        return {
            'tool': 'Binwalk',
            'error': str(e)
        }


def custom_analyze_pngcheck(file_path):
    """Analiza el archivo PNG buscando relaciones anómalas en los bloques IDAT."""
    try:
        result = subprocess.run(["pngcheck", "-v", file_path], capture_output=True, text=True)
        output = result.stdout

        bloques = [line for line in output.split("\n") if "chunk IDAT" in line]
        tamanos = [int(line.split("length")[1].split(",")[0]) for line in bloques]

        datos_embebidos = any(size == 65536 for size in tamanos)
        return {
            'tool': 'Custom Analysis',
            'message': 'Possible embedded data detected.' if datos_embebidos else 'No anomalies found.',
            'details': {
                'num_chunks': len(bloques),
                'chunk_sizes': tamanos
            }
        }
    except Exception as e:
        return {'tool': 'Custom Analysis', 'error': str(e)}


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
    custom_analysis_pngcheck = custom_analyze_pngcheck(file_path)


    # Generate a probability score (simple heuristic)
    anomaly_score = 0

    probability = min(100, int(anomaly_score * 100))

    # Report
    report = {
        'file': filename,
        'entropy': entropy,
        'jpeg_structure': jpeg_structure,
        'binwalk_analysis': binwalk_analysis,
        'custom_analysis': custom_analysis_pngcheck,
        'anomaly_probability': f"{probability}%",
        'message': 'Higher probability indicates higher likelihood of embedded data.'
    }

    return jsonify(report)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


# Enbed and extract data with Steghide
# steghide embed -cf ./image1_embed.jpg -ef ./files/CDSEO.xlsx
# steghide extract -sf ./image1_embed.jpg

# Consult the embedded data with endpoints
# curl -X POST -F 'file=@/home/unwatched/Documents/workspace/web/ImgeAnalyzer/images/img_exel.png' http://localhost:5000/upload

# Page to make little test
# https://www.aperisolve.com/