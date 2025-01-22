import subprocess
import math
import os

PNG_CHECK_PATH = r'C:\Users\Cristopher\pngcheck-2.3.0-win32\pngcheck.exe'

def analyze_jpeg_structure(file_path):
    file_path = os.path.abspath(file_path)
    try:
        result = subprocess.run(['jpeginfo', '-c', file_path], capture_output=True, text=True, timeout=10)
        if "ERROR" in result.stderr or "WARNING" in result.stdout:
            return {'message': 'Anomalies detected', 'details': result.stderr.strip() or result.stdout.strip()}
        return {'message': 'JPEG structure valid', 'details': result.stdout.strip()}
    except Exception as e:
        return {'error': str(e)}

def analyze_with_binwalk(file_path):
    try:
        result = subprocess.run(f'binwalk "{file_path}"', capture_output=True, text=True, shell=True, timeout=10)
        return {'message': 'Binwalk analysis complete', 'details': result.stdout.strip()}
    except Exception as e:
        return {'error': str(e)}

def analyze_with_pngcheck(file_path):
    file_path = os.path.abspath(file_path)
    try:
        result = subprocess.run([PNG_CHECK_PATH, "-v", file_path], capture_output=True, text=True, timeout=10)
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
