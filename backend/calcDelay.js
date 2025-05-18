const deg2rad = Math.PI / 180;
const c = 2.99792458e8;
const TECU2meters = (40.308193 / Math.pow(1575.42e6, 2)) * 1e16;

// Интерполяция ионосферной задержки
function ioDelay(lat, lon, delays, bounds) {
  const [lonWest, lonEast, latSouth, latNorth] = bounds;
  const x = (lon - lonWest) / (lonEast - lonWest);
  const y = (lat - latSouth) / (latNorth - latSouth);
  const weights = [
    x * y, // NE
    (1 - x) * y, // NW
    (1 - x) * (1 - y), // SW
    x * (1 - y), // SE
  ];

  let result = 0;
  for (let i = 0; i < 4; i++) {
    result += weights[i] * (delays[i] / 10.0); // Делим на 10, как в оригинале
  }

  return result * TECU2meters;
}

module.exports = ioDelay;
