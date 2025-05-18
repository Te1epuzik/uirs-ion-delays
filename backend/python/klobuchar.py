import sys
import json
import numpy as np
from math import floor
from datetime import datetime, timedelta

semi2rad = np.pi
deg2rad = np.pi / 180.0
deg2semi = 1.0 / 180.0
c = 2.99792458e8
SECONDS_IN_WEEK = 604800


def time_of_week(date_time: list) -> float:
    year, month, day, hour, minute, second = map(int, date_time)
    dt = datetime(year, month, day, hour, minute, second)
    gps_epoch = datetime(1980, 1, 6)
    delta = dt - gps_epoch
    tow = delta.total_seconds() % SECONDS_IN_WEEK
    return tow


def klobuchar(lat, lon, elev, azim, date_time, alpha, beta):
    try:
        tow = time_of_week(date_time)
        fi = float(lat)
        lamb = float(lon)
        a = azim * deg2rad
        e = elev * deg2semi
        
        psi = 0.0137 / (e + 0.11) - 0.022
        lat_i = fi * deg2semi + psi * np.cos(a)
        lat_i = np.clip(lat_i, -0.416, 0.416)
        
        long_i = lamb * deg2semi + (psi * np.sin(a) / np.cos(lat_i * semi2rad))
        lat_m = lat_i + 0.064 * np.cos((long_i - 1.617) * semi2rad)
        t = (4.32e4 * long_i + tow) % 86400.0
        
        sF = 1.0 + 16.0 * (0.53 - e)**3
        PER = beta[0] + beta[1]*lat_m + beta[2]*lat_m**2 + beta[3]*lat_m**3
        PER = max(PER, 72000)
        
        x = 2.0 * np.pi * (t - 50400.0) / PER
        AMP = alpha[0] + alpha[1]*lat_m + alpha[2]*lat_m**2 + alpha[3]*lat_m**3
        AMP = max(AMP, 0.0)
        
        dIon = sF * 5e-9 if abs(x) > 1.57 else sF * (5e-9 + AMP*(1 - x**2/2 + x**4/24))
        return float(c * dIon)
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    result = {}
    try:
        if len(sys.argv) != 8:
            raise ValueError("Требуется 7 аргументов")
            
        args = [
            float(sys.argv[1]), 
            float(sys.argv[2]),
            float(sys.argv[3]),
            float(sys.argv[4]),
            json.loads(sys.argv[5]),  # Дата-время
            json.loads(sys.argv[6]),   # Alpha
            json.loads(sys.argv[7])    # Beta
        ]
        
        for arr, name in zip([args[5], args[6]], ['alpha', 'beta']):
            if len(arr) != 4 or not all(isinstance(x, (int, float)) for x in arr):
                raise ValueError(f"Неверный формат {name}")
        
        delay = klobuchar(*args)
        result = {"delay": delay} if not isinstance(delay, dict) else delay
        
    except Exception as e:
        result = {"error": f"{str(e)}"}
    
    print(json.dumps(result))
