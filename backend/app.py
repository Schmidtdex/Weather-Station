from flask import Flask, request, jsonify
from flask_cors import CORS
from database import (
    init_db, inserir_leitura, listar_leituras,
    buscar_leitura, atualizar_leitura, deletar_leitura,
    estatisticas, contar_leituras
)

app = Flask(__name__)
CORS(app)

init_db()

@app.route('/')
def index():
    leituras = listar_leituras(limite=10)
    return jsonify(leituras)

@app.route('/leituras', methods=['GET'])
def listar():
    page = int(request.args.get('page', 1))
    limite = int(request.args.get('limite', 20))
    offset = (page - 1) * limite
    leituras = listar_leituras(limite=limite, offset=offset)
    total = contar_leituras()
    return jsonify({
        'data': leituras,
        'total': total,
        'page': page,
        'pages': (total + limite - 1) // limite
})

@app.route('/leituras', methods=['POST'])
def criar():
    dados = request.get_json()
    if not dados or 'temperatura' not in dados or 'umidade' not in dados:
        return jsonify({'erro': 'JSON inválido ou campos obrigatórios ausentes'}), 400
    id_new = inserir_leitura(
        dados['temperatura'],
        dados['umidade'],
        dados.get('pressao'),
        dados.get('localizacao', 'Lab')
    )
    return jsonify({'id': id_new, 'status': 'criado'}), 201

@app.route('/leituras/<int:id>', methods=['GET'])
def detalhe(id):
    leitura = buscar_leitura(id)
    if not leitura:
        return jsonify({'erro': 'Não encontrado'}), 404
    return jsonify(leitura)

@app.route('/leituras/<int:id>', methods=['PUT'])
def atualizar(id):
    dados = request.get_json()
    if not dados:
        return jsonify({'erro': 'JSON inválido'}), 400
    if not buscar_leitura(id):
        return jsonify({'erro': 'Não encontrado'}), 404
    atualizar_leitura(id, dados)
    return jsonify({'status': 'atualizado'})

@app.route('/leituras/<int:id>', methods=['DELETE'])
def deletar(id):
    if not buscar_leitura(id):
        return jsonify({'erro': 'Não encontrado'}), 404
    deletar_leitura(id)
    return jsonify({'status': 'deletado'})

@app.route('/api/estatisticas', methods=['GET'])
def stats():
    return jsonify(estatisticas())


if __name__ == '__main__':
    app.run(debug=True, port=5000)