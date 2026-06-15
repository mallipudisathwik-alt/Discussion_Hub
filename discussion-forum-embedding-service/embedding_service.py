from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed():
    text = request.json.get('text')
    if not text:
        return jsonify({'error': 'text field is required'}), 400
    vector = model.encode(text).tolist()
    return jsonify({'embedding': vector})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
