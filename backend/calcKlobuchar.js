const c = 2.99792458e8;
const deg2rad = Math.PI / 180;


// Time of week (simplified, assumes date format: [YYYY, MM, DD, HH, mm, ss])
function timeOfWeek([year, month, day, hours, mins, sec]) {
  const date = new Date(Date.UTC(year, month - 1, day, hours, mins, sec));
  const gpsEpoch = new Date(Date.UTC(1980, 0, 6, 0, 0, 0));
  const seconds = (date - gpsEpoch) / 1000;
  const week = Math.floor(seconds / 604800);
  const tow = Math.round((seconds % 604800) / 0.5) * 0.5;
  return { week, tow };
}

function calcKlobuchar(latDeg, lonDeg, options) {
  const { elev, azim, alpha, beta, time } = options;
  const { tow } = timeOfWeek(time);
  const fi = latDeg;
  const lamb = lonDeg;
  const a = azim * deg2rad;
  const e = elev / 180;
  const psi = 0.0137 / (e + 0.11) - 0.022;

  let lat_i = fi / 180 + psi * Math.cos(a);
  lat_i = Math.max(Math.min(lat_i, 0.416), -0.416);

  const lon_i = lamb / 180 + (psi * Math.sin(a)) / Math.cos(lat_i * Math.PI);
  const lat_m = lat_i + 0.064 * Math.cos((lon_i - 1.617) * Math.PI);
  let t = 43200 * lon_i + tow;
  t %= 86400;

  const sF = 1.0 + 16.0 * Math.pow(0.53 - e, 3);

  let PER =
    beta[0] +
    beta[1] * lat_m +
    beta[2] * Math.pow(lat_m, 2) +
    beta[3] * Math.pow(lat_m, 3);
  PER = Math.max(PER, 72000);

  const x = (2 * Math.PI * (t - 50400)) / PER;

  let AMP =
    alpha[0] +
    alpha[1] * lat_m +
    alpha[2] * Math.pow(lat_m, 2) +
    alpha[3] * Math.pow(lat_m, 3);
  AMP = Math.max(AMP, 0);

  let dIon;
  if (Math.abs(x) > 1.57) {
    dIon = sF * 5e-9;
  } else {
    dIon = sF * (5e-9 + AMP * (1 - Math.pow(x, 2) / 2 + Math.pow(x, 4) / 24));
  }

  return c * dIon;
}

module.exports = { calcKlobuchar, timeOfWeek};
