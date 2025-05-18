import re
import json
import numpy as np

def find_cords(filename: str, pos_lat: float, pos_long: float) -> tuple:
    lat_north = 90.0
    lon_west = -180.0
    lat_south = -lat_north
    lon_east = lon_west
    
    with open(filename, 'r') as file:
        for line in file:
            if 'LAT/LON1/LON2/DLON/H' in line:
                matches = re.findall(r'-?\d+\.\d+', line.strip())
                LAT, LON1, LON2, DLON, H = map(float, matches)

                # Обработка широт
                if LAT > pos_lat and LAT < lat_north:
                    lat_north = LAT
                elif LAT < pos_lat and LAT > lat_south:
                    lat_south = LAT

                # Итерация по долготам с дробным шагом
                current_lon = LON1
                while current_lon <= LON2 + 1e-9:  # Учет погрешности float
                    # Поиск ближайших западной и восточной точек
                    if current_lon < pos_long:
                        if (pos_long - current_lon) < (pos_long - lon_west):
                            lon_west = current_lon
                    else:
                        if (current_lon - pos_long) < (lon_east - pos_long):
                            lon_east = current_lon
                    
                    current_lon = round(current_lon + DLON, 6)  # Округление до 6 знаков

    return (lat_north, lat_south, lon_west, lon_east)



if __name__ == "__main__":
    import sys
    filepath = sys.argv[1] if len(sys.argv) > 1 else "brdc0010.18n"
    pos_lat = float(sys.argv[2]) if len(sys.argv) > 2 else 0.
    pos_long = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
    result = find_cords(filepath, pos_lat, pos_long)
    print(json.dumps(result, indent=2))