import sqlite3
from config import DATABASE, SCHEMA

def get_db_connection():
    conn = sqlite3.connect(DATABASE, timeout=10)
    conn.execute('PRAGMA journal_mode=WAL')
    conn.execute('PRAGMA busy_timeout=5000')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    with open(SCHEMA, 'r') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

def inserir_leitura(temperatura, umidade, pressao=None, localizacao='Lab'):
    conn = get_db_connection()
    cur = conn.execute(
        'INSERT INTO leituras (temperatura, umidade, pressao, localizacao) VALUES (?, ?, ?, ?)',
        (temperatura, umidade, pressao, localizacao)
    )
    conn.commit()
    id_new = cur.lastrowid
    conn.close()
    return id_new


def listar_leituras(limite=50, offset=0):
    conn = get_db_connection()
    rows = conn.execute(
        'SELECT * FROM leituras ORDER BY timestamp DESC LIMIT ? OFFSET ?',
        (limite, offset)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def contar_leituras():
    conn = get_db_connection()
    total = conn.execute('SELECT COUNT(*) FROM leituras').fetchone()[0]
    conn.close()
    return total

def buscar_leitura(id):
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM leituras WHERE id = ?', (id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def atualizar_leitura(id, dados):
    conn = get_db_connection()
    conn.execute(
        'UPDATE leituras SET temperatura=?, umidade=?, pressao=?, localizacao=? WHERE id=?',
        (dados['temperatura'], dados['umidade'], dados.get('pressao'), dados.get('localizacao', 'Lab'), id)
    )
    conn.commit()
    conn.close()

def deletar_leitura(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM leituras WHERE id = ?', (id,))
    conn.commit()
    conn.close()

def estatisticas():
    conn = get_db_connection()
    row = conn.execute('''
        SELECT
            ROUND(AVG(temperatura), 2) as temp_media,
            ROUND(MIN(temperatura), 2) as temp_min,
            ROUND(MAX(temperatura), 2) as temp_max,
            ROUND(AVG(umidade), 2)    as umid_media,
            ROUND(MIN(umidade), 2)    as umid_min,
            ROUND(MAX(umidade), 2)    as umid_max
        FROM leituras
    ''').fetchone()
    conn.close()
    return dict(row) if row else {}