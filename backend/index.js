const { getIonex, getIonCorrections } = require("./getData");
const { calcKlobuchar } = require("./calcKlobuchar");
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const ELEVATION = 90;
const AZIMUTH = 0;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.post("/data", async (req, res) => {
	const { lat, lon } = req.body;
  const epoch = await getIonex(path.join(__dirname, "./data/igrg0010.18i"), lat, lon);
  const exactDelay = [];
  const forecastDelay = [];
  const klobuchar = [];

	console.log(epoch);

	const [alpha, beta] = await getIonCorrections(path.join(__dirname, "./data/brdc0010.18n"))

  getIonex(path.join(__dirname, "./data/igrg0010.18i"), lat, lon).then(
    (data) => {
      const values = [];
      for (const isoDate in data) {
        const delay = data[isoDate];

        const dt = new Date(isoDate);

        const newKlobuchar = calcKlobuchar(
          lat,
          lon,
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

        klobuchar.push(newKlobuchar);
      }

      res.json({
        epoch: Object.keys(epoch).map((item) => {
					const [date, time] = item.split("T");
					
					return date.split("-").reverse().join(".") + " " + time
				}),
        exactDelay,
        forecastDelay,
        klobuchar,
      });
    }
  );
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
