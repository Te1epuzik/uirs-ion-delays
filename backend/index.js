const {
  getIonex,
  getIonCorrections,
  getIoDelaysByEpoch,
  getKlobuchar,
} = require("./getData");
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
  try {
    const { lat, lon } = req.body;

    // Параллельная загрузка данных
    const [alphaBeta, exactDelays, forecastDelays, klobData] =
      await Promise.all([
        getIonCorrections(path.join(__dirname, "./data/brdc0010.18n")),
        getIoDelaysByEpoch(
          path.join(__dirname, "./data/igsg0010.18i"),
          lat,
          lon
        ),
        getIoDelaysByEpoch(
          path.join(__dirname, "./data/igrg0010.18i"),
          lat,
          lon
        ),
        getIonex(path.join(__dirname, "./data/igrg0010.18i"), lat, lon),
      ]);

    const [alpha, beta] = alphaBeta;
    const klobuchar = [];

    // Обработка данных для Klobuchar
    for (const isoDate of Object.keys(klobData)) {
      const dt = new Date(isoDate);
			console.log(isoDate);
      klobuchar.push(
        await getKlobuchar(
          lat,
          lon,
          ELEVATION,
          AZIMUTH,
          [
            dt.getFullYear(),
            dt.getMonth() + 1,
            dt.getDate(),
            dt.getHours(),
            dt.getMinutes(),
            dt.getSeconds(),
          ],
          alpha,
          beta
        )
      );
    }

    // Форматирование результата
    res.json({
      epoch: Object.keys(klobData).map((isoDate) =>
        new Date(isoDate)
          .toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(",", "")
      ),
      exactDelay: Object.values(exactDelays),
      forecastDelay: Object.values(forecastDelays),
      klobuchar,
    });
  } catch (error) {
    console.error("Ошибка обработки запроса:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
