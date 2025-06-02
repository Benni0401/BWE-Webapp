from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import struct
import math

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def read_stl_info(file_path):
    """Sehr grobe Analyse einer Binär-STL: zählt Dreiecke, schätzt Volumen, Gewicht, etc."""
    try:
        with open(file_path, 'rb') as f:
            header = f.read(80)
            num_triangles_bytes = f.read(4)
            if len(num_triangles_bytes) < 4:
                return None
            num_triangles = struct.unpack('<I', num_triangles_bytes)[0]

            # Grobe Schätzung: Wir summieren Volumen von Dreiecken nicht exakt,
            # sondern schätzen anhand der Anzahl der Dreiecke und einer Normgröße.
            # Für eine richtige Volumenberechnung bräuchte man ein komplexeres Verfahren.

            # Hier einfach Dummywerte:
            estimated_volume_cm3 = num_triangles * 0.05  # Annahme: 0.05 cm³ pro Dreieck
            density_g_cm3 = 1.07  # ASA als Standard, kann später angepasst werden
            weight_g = estimated_volume_cm3 * density_g_cm3

            weight_kg = weight_g / 1000.0

            # Druckzeit grob schätzen anhand Dreiecke (nur als Platzhalter)
            estimated_print_hours = max(0.1, num_triangles / 10000)

            return {
                'num_triangles': num_triangles,
                'weight': weight_kg,
                'print_time': estimated_print_hours
            }
    except Exception as e:
        print("Error reading STL:", e)
        return None

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'Keine Datei gefunden'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Keine Datei ausgewählt'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    info = read_stl_info(filepath)
    if info is None:
        return jsonify({'error': 'Dateianalyse fehlgeschlagen'}), 400

    # Optional: Datei löschen nach Analyse
    os.remove(filepath)

    return jsonify(info)

if __name__ == '__main__':
    app.run(debug=True)
