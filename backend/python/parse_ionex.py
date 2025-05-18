import re
import json
from datetime import datetime

def parse_ionex_file(filepath, target_lat, target_lon):
    TEC_data = {}
    with open(filepath, 'r') as file:
        lines = file.readlines()

    epoch = None
    for i, line in enumerate(lines):
        if 'EPOCH OF CURRENT MAP' in line:
            numbers = list(map(int, re.findall(r'\d+', line)))
            if len(numbers) >= 4:
                epoch = tuple(numbers[:4])
        elif 'LAT/LON1/LON2/DLON/H' in line:
            match = re.findall(r'-?\d+\.\d+', line)
            if len(match) >= 5:
                lat, lon1, lon2, dlon, h = map(float, match)
                if abs(lat - target_lat) < 1.0:
                    num_lons = int((lon2 - lon1) / dlon + 1)
                    data_lines = lines[i+1:i+6]
                    data_str = ''.join(data_lines)
                    data = list(map(int, re.findall(r'-?\d+', data_str)))
                    lon_index = int((target_lon - lon1) / dlon)
                    if 0 <= lon_index < len(data):
                        tec_value = data[lon_index]
                        epoch_str = datetime(*epoch).isoformat() if epoch else "unknown"
                        TEC_data[epoch_str] = tec_value
    return TEC_data

if __name__ == "__main__":
    import sys
    filepath = sys.argv[1] if len(sys.argv) > 1 else "igrg0010.18i"
    target_lat = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
    target_lon = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
    result = parse_ionex_file(filepath, target_lat, target_lon)
    print(json.dumps(result, indent=2))
