import os
from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime

app = Flask(__name__, static_folder='public')

# Simple in-memory database to store leads during server runtime
leads = []

@app.route('/')
def serve_index():
    """Serve the index.html landing page from the public directory."""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/dashboard')
def serve_dashboard():
    """Serve the dashboard.html SPA prototype from the public directory."""
    return send_from_directory(app.static_folder, 'dashboard.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static assets, CSS, and JS files from the public directory."""
    return send_from_directory(app.static_folder, path)

@app.route('/api/lead', methods=['POST'])
def register_lead():
    """API Endpoint to receive conversion leads from the frontend."""
    data = request.get_json() or {}
    source = data.get('source')

    if not source:
        return jsonify({
            'success': False,
            'message': 'El campo "source" es requerido para registrar el lead.'
        }), 400

    new_lead = {
        'id': len(leads) + 1,
        'source': source,
        'timestamp': data.get('timestamp', datetime.utcnow().isoformat() + 'Z'),
        'url': data.get('url', 'N/A'),
        'userAgent': request.headers.get('User-Agent', 'N/A')
    }

    leads.append(new_lead)

    # Log the lead registration in the terminal
    print(f"[Python Server] 🌟 Nuevo lead registrado! ID: {new_lead['id']} | Origen: {source} | Hora: {new_lead['timestamp']}")

    return jsonify({
        'success': True,
        'message': 'Lead registrado exitosamente.',
        'lead': new_lead
    }), 201

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'platform': 'python',
        'totalLeads': len(leads)
    })

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 5000))
    print(f"\n==================================================")
    print(f"🚀 Servidor Python corriendo en http://localhost:{PORT}")
    print(f"📂 Sirviendo archivos estáticos desde la carpeta 'public'")
    print(f"==================================================\n")
    app.run(host='0.0.0.0', port=PORT, debug=True)
