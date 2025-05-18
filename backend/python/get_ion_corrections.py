import re
import json

def get_ion_corrections(filename: str):
  with open(filename, 'r') as file:
    for line in file:
      line = line.replace('D', 'e')
      if "ION ALPHA" in line:
        ion_alpha = tuple(float(x) for x in re.findall(r'-?\d+\.\d+e-\d+', line))
      elif "ION BETA" in line:
        ion_beta = tuple(float(x) for x in re.findall(r'-?\d+\.\d+e\+\d+', line))

  return ion_alpha, ion_beta

if __name__ == "__main__":
    import sys
    filepath = sys.argv[1] if len(sys.argv) > 1 else "brdc0010.18n"
    result = get_ion_corrections(filepath)
    print(json.dumps(result, indent=2))
