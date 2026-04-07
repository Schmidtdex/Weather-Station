#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
#include "DHT.h"

#define DHTPIN 2    
#define DHTTYPE DHT11
#define LED_PIN 13

DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP280 bmp; 

void setup() {
  Serial.begin(9600);
  delay(2000);
  dht.begin();

  pinMode(LED_PIN, OUTPUT);
  
 
if (!bmp.begin(0x76, 0x60)) { 
    Serial.println("Sensor BMP280 não encontrado. Verifique as conexões!");
  }
}

void loop() {
  // Leituras dos sensores
  float temp = dht.readTemperature();
  float umid = dht.readHumidity();
  float pressao = bmp.readPressure() / 100.0F; 

  
  if (!isnan(temp) && !isnan(umid)) {
    Serial.print("{");
    Serial.print("\"temperatura\":"); Serial.print(temp);
    Serial.print(",\"umidade\":"); Serial.print(umid);
    Serial.print(",\"pressao\":"); Serial.print(pressao);
    Serial.println("}");
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
  } else {
    Serial.println("Falha na leitura do DHT11");
  }

  delay(5000); 
}