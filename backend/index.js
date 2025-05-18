const { getIonex, getIonCorrections } = require("./getData");
const { calcKlobuchar } = require("./calcKlobuchar");
const express = require("express");
const fs = require("fs");
const path = require("path");

const CITY_CHITA = {
  name: "Чита",
  lat: 52.05075711868686,
  lon: 113.48280154660213,
};

const CITY_SOLICUMSK = {
  name: "Соликамск",
  lat: 59.671577178783586,
  lon: 56.752400699192386,
};

const ELEVATION = 90;
const AZIMUTH = 0;

const app = express();
const port = 3000;

let alpha;
let beta;

getIonCorrections(path.join(__dirname, "./data/brdc0010.18n")).then((data) => {
  alpha = data[0];
  beta = data[1];
});

getIonex(
  path.join(__dirname, "./data/igrg0010.18i"),
  CITY_SOLICUMSK.lat,
  CITY_SOLICUMSK.lon
).then((data) => {
  const values = [];
  for (const isoDate in data) {
    const delay = data[isoDate];

    const dt = new Date(isoDate);

    const klobuchar = calcKlobuchar(CITY_SOLICUMSK.lat, CITY_SOLICUMSK.lon, {
      elev: ELEVATION,
      azim: AZIMUTH,
      alpha: alpha,
      beta: beta,
      time: [
        dt.getUTCFullYear(),
        dt.getUTCMonth() + 1,
        dt.getUTCDate(),
        dt.getUTCHours(),
        dt.getUTCMinutes(),
        dt.getUTCSeconds(),
      ],
    });

    values.push(klobuchar);
  }
  console.log(data);
  console.log(values);
});

app.post("/data", (req, res) => {
  const { name, lat, lon } = req.body;
  getIonex(path.join(__dirname, "./data/igrg0010.18i"), lat, lon).then(
    (data) => {
      const values = [];
      for (const isoDate in data) {
        const delay = data[isoDate];

        const dt = new Date(isoDate);

        const klobuchar = calcKlobuchar(
          CITY_SOLICUMSK.lat,
          CITY_SOLICUMSK.lon,
          {
            elev: ELEVATION,
            azim: AZIMUTH,
            alpha: alpha,
            beta: beta,
            time: [
              dt.getUTCFullYear(),
              dt.getUTCMonth() + 1,
              dt.getUTCDate(),
              dt.getUTCHours(),
              dt.getUTCMinutes(),
              dt.getUTCSeconds(),
            ],
          }
        );

        values.push(klobuchar);
      }
      console.log(data);
      console.log(values);
    }
  );
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
