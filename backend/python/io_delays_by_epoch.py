import re
import numpy as np
import json

TECU2meters = (40.308193 / (1575.42e6 ** 2)) * 1e16

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

                if LAT > pos_lat and LAT < lat_north:
                    lat_north = LAT
                elif LAT < pos_lat and LAT > lat_south:
                    lat_south = LAT

                current_lon = LON1
                while current_lon <= LON2 + 1e-9:
                    if current_lon < pos_long:
                        if (pos_long - current_lon) < (pos_long - lon_west):
                            lon_west = current_lon
                    else:
                        if (current_lon - pos_long) < (lon_east - pos_long):
                            lon_east = current_lon
                    current_lon = round(current_lon + DLON, 6)

    return (lat_north, lat_south, lon_west, lon_east)

def io_delay(lat: float, long: float, delays: list, points: tuple) -> float:
    phi_pp = lat
    lambda_pp = long
    tau_v = delays
    lambda_1, lambda_2, phi_1, phi_2 = points
    x_pp = (lambda_pp - lambda_1) / (lambda_2 - lambda_1)
    y_pp = (phi_pp - phi_1) / (phi_2 - phi_1)
    W = [
        x_pp * y_pp,
        (1 - x_pp) * y_pp,
        (1 - x_pp) * (1 - y_pp),
        x_pp * (1 - y_pp)
    ]
    tau_vpp = 0
    for k in range(4):
        tau_vpp += W[k] * tau_v[k] / 10.0
    return tau_vpp * TECU2meters

def find_TEC_delays(filename: str, latitude: float, longitude: float) -> dict:
    TEC_delays = {}
    epoch = 0
    line_number = 0
    with open(filename, 'r') as file:
        lines = file.readlines()
        for line in lines:
            if 'EPOCH OF CURRENT MAP' in line:
                epoch = tuple(map(int, re.findall(r'\d+', line.strip())))
            elif 'START OF RMS MAP' in line:
                break
            elif 'LAT/LON1/LON2/DLON/H' in line:
                matches = re.findall(r'-?\d+\.\d+', line.strip())
                LAT, LON1, LON2, DLON, H = map(float, matches)
                if LAT == latitude:
                    data_lines = ''.join(lines[line_number+1 : line_number+6])
                    delays = list(map(int, re.findall(r'\d+', data_lines)))
                    index = int(np.fabs(longitude - LON1) / DLON)
                    # Преобразуем кортеж в строку для ключа
                    TEC_delays[str(epoch)] = delays[index]
            line_number += 1
    return TEC_delays

def io_delays_by_epoch(filename, LAT, LONG) -> dict:
    lat_north, lat_south, lon_west, lon_east = find_cords(filename, float(LAT), float(LONG))

    delays_on_NW = find_TEC_delays(filename, lat_north, lon_west)
    delays_on_NE = find_TEC_delays(filename, lat_north, lon_east)
    delays_on_SW = find_TEC_delays(filename, lat_south, lon_west)
    delays_on_SE = find_TEC_delays(filename, lat_south, lon_east)

    io_delays = {}

    for epoch_str in delays_on_NW.keys():
        # Преобразуем строку обратно в кортеж для доступа к другим словарям
        epoch_tuple = eval(epoch_str)
        delays = [
            delays_on_NE[epoch_str],
            delays_on_NW[epoch_str],
            delays_on_SW[epoch_str],
            delays_on_SE[epoch_str]
        ]
        # Используем строку как ключ
        io_delays[epoch_str] = io_delay(
            float(LAT),
            float(LONG),
            delays,
            (lon_west, lon_east, lat_south, lat_north)
        )
    return io_delays

if __name__ == "__main__":
    import sys
    filepath = sys.argv[1] if len(sys.argv) > 1 else "brdc0010.18n"
    lat = sys.argv[2] if len(sys.argv) > 2 else 0.0
    lon = sys.argv[3] if len(sys.argv) > 3 else 0.0
    result = io_delays_by_epoch(filepath, float(lat), float(lon))
    print(json.dumps(result, indent=2))
