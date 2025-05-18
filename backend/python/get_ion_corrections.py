import re
import json

def get_ion_corrections(filename: str):
    ion_alpha = ion_beta = None

    with open(filename, 'r') as file:
        for line in file:
            line = line.replace('D', 'e')
            matches = re.findall(r'[-+]?\d+\.\d+e[-+]?\d+', line)

            if "ION ALPHA" in line:
                ion_alpha = [float(x) for x in matches]
            elif "ION BETA" in line:
                ion_beta = [float(x) for x in matches]

    if not ion_alpha or not ion_beta:
        raise ValueError("Не удалось найти ION ALPHA или ION BETA в файле.")

    return ion_alpha, ion_beta

if __name__ == "__main__":
    import sys
    filepath = sys.argv[1] if len(sys.argv) > 1 else "brdc0010.18n"
    result = get_ion_corrections(filepath)
    print(json.dumps(result, indent=2))

