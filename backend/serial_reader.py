import json, requests, time, random
from config import PORTA_SERIAL, BAUD_RATE, API_URL

MODO_SIMULACAO = False #teste para antes de eu mudar para o hardware, se quiser testar com os dados plotados mude para True

def simular_leitura():
    return {
        "temperatura": round(random.uniform(18.0, 35.0), 1),
        "umidade":     round(random.uniform(40.0, 90.0), 1),
        "pressao":     round(random.uniform(1008.0, 1020.0), 1),
        "localizacao": "Lab"
    }

def ler_serial_real():
    import serial
    with serial.Serial(PORTA_SERIAL, BAUD_RATE, timeout=2) as ser:
        while True:
            linha = ser.readline().decode('utf-8').strip()
            if linha:
                try:
                    dados = json.loads(linha)
                    r = requests.post(API_URL, json=dados)
                    print(f'Enviado: {dados} → {r.status_code}')
                except json.JSONDecodeError:
                    print(f'Linha inválida: {linha}')
            time.sleep(0.1)

def ler_simulado():
    print('Modo simulação ativo — gerando dados a cada 5s')
    while True:
        dados = simular_leitura()
        try:
            r = requests.post(API_URL, json=dados)
            print(f'Simulado: {dados} → {r.status_code}')
        except requests.exceptions.ConnectionError:
            print(' Flask não está rodando. Inicie o app.py primeiro.')
        time.sleep(5)

if __name__ == '__main__':
    if MODO_SIMULACAO:
        ler_simulado()
    else:
        ler_serial_real()