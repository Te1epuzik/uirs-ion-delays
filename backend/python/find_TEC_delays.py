import re
import numpy as np
import json
import sys
from datetime import datetime

 # find_TEC_delays.py
def find_TEC_delays(filename: str, latitude: float, longitude: float) -> dict:
    TEC_delays = {}
    current_epoch = None
    with open(filename, 'r') as file:
        for line in file:
            if 'EPOCH OF CURRENT MAP' in line:
                # Исправленный парсинг времени эпохи
                epoch_data = list(map(int, re.findall(r'\d+', line)[:6]))
                current_epoch = datetime(*epoch_data).isoformat()
            
            elif 'LAT/LON1/LON2/DLON/H' in line and current_epoch:
                params = list(map(float, re.findall(r'-?\d+\.\d+', line)))
                if len(params) < 5:
                    continue
                
                LAT, LON1, LON2, DLON, _ = params
                
                # Точное сравнение широт
                if abs(LAT - latitude) > 0.5:
                    continue
                
                # Чтение блока данных
                data_block = []
                for _ in range(5):
                    data_line = next(file).strip()
                    data_block.extend(map(int, re.findall(r'-?\d+', data_line)))
                
                # Корректный расчёт индекса
                index = int(round((longitude - LON1) / DLON))
                if 0 <= index < len(data_block):
                    TEC_delays[current_epoch] = data_block[index]
    
    return TEC_delays

# def find_TEC_delays(filename: str, latitude: float, longitude: float) -> dict:
#     TEC_delays = {}
#     current_epoch = None
#     with open(filename, 'r') as file:
#         lines = file.readlines()
#         for i, line in enumerate(lines):
#             if 'EPOCH OF CURRENT MAP' in line:
#                 # Исправленный формат времени как в первом коде
#                 numbers = list(map(int, re.findall(r'\d+', line)[:6]))
#                 current_epoch = tuple(numbers)  # Сохраняем как кортеж
                
#             elif 'LAT/LON1/LON2/DLON/H' in line and current_epoch:
#                 params = list(map(float, re.findall(r'-?\d+\.\d+', line)))
#                 if len(params) < 5: continue
                
#                 LAT, LON1, LON2, DLON, _ = params
                
#                 # Точное сравнение широт с допуском 0.1°
#                 if abs(LAT - latitude) > 0.1: continue
                
#                 # Чтение данных с фиксированным количеством строк
#                 data = []
#                 for j in range(i+1, i+6):
#                     if j >= len(lines): break
#                     data.extend(map(int, re.findall(r'-?\d+', lines[j])))
                
#                 # Расчет индекса с округлением
#                 index = int(round((longitude - LON1) / DLON))
#                 if 0 <= index < len(data):
#                     TEC_delays[current_epoch] = data[index]
    
#     return TEC_delays


if __name__ == "__main__":
    filepath = sys.argv[1] if len(sys.argv) > 1 else "brdc0010.18n"
    lat = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
    lon = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
    result = find_TEC_delays(filepath, lat, lon)
    print(json.dumps(result, indent=2))
