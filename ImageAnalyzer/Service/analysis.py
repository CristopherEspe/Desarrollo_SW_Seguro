import subprocess
import os

# Ruta a pngcheck (ajustar según tu sistema)
PNG_CHECK_PATH = r'C:\Users\pngcheck-2.3.0-win32\pngcheck.exe'

def analyze_jpeg_structure(file_path):
    """
    Analiza la estructura de un archivo JPEG utilizando jpeginfo.
    """
    file_path = os.path.abspath(file_path)
    try:
        result = subprocess.run(['jpeginfo', '-c', file_path], capture_output=True, text=True, timeout=10)
        if "ERROR" in result.stderr or "WARNING" in result.stdout:
            return {'tool': 'jpeginfo', 'message': 'Anomalies detected', 'details': result.stderr.strip() or result.stdout.strip()}
        return {'tool': 'jpeginfo', 'message': 'JPEG structure valid', 'details': result.stdout.strip()}
    except Exception as e:
        return {'tool': 'jpeginfo', 'error': str(e)}

def analyze_with_binwalk(file_path):
    """
    Realiza un análisis con binwalk para identificar posibles datos embebidos.
    """
    try:
        result = subprocess.run(f'binwalk "{file_path}"', capture_output=True, text=True, shell=True, timeout=10)
        return {'tool': 'binwalk', 'message': 'Binwalk analysis complete', 'details': result.stdout.strip()}
    except Exception as e:
        return {'tool': 'binwalk', 'error': str(e)}

def analyze_with_pngcheck(file_path):
    """
    Analiza un archivo PNG utilizando pngcheck para detectar datos embebidos.
    """
    file_path = os.path.abspath(file_path)
    try:
        # Verificar si el archivo existe antes de continuar
        if not os.path.isfile(file_path):
            return {'tool': 'pngcheck', 'error': 'File not found'}

        result = subprocess.run([PNG_CHECK_PATH, "-v", file_path], capture_output=True, text=True, timeout=10)
        output = result.stdout

        # Identificar bloques y sus tamaños
        bloques = [line for line in output.split("\n") if "chunk IDAT" in line]
        tamanos = [int(line.split("length")[1].split(",")[0]) for line in bloques if "length" in line]

        # Detectar datos embebidos si hay chunks con tamaño máximo
        datos_embebidos = any(size == 65536 for size in tamanos)

        return {
            'tool': 'pngcheck',
            'message': 'Possible embedded data detected.' if datos_embebidos else 'No anomalies found.',
            'details': {
                'num_chunks': len(bloques),
                'chunk_sizes': tamanos
            }
        }
    except Exception as e:
        return {'tool': 'pngcheck', 'error': str(e)}
