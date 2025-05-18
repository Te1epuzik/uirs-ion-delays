const { PythonShell } = require("python-shell");

const getIonex = (filePath, targetLat = 62.0, targetLon = 129.7) => {
  return new Promise((resolve) => {
    let options = {
      mode: "text",
      pythonOptions: ["-u"],
      args: [filePath, targetLat, targetLon],
    };

    PythonShell.run("./python/parse_ionex.py", options)
      .then((results) => {
        resolve(JSON.parse(results.join("")));
      })
      .catch((err) => {
        console.error("Ошибка при запуске Python:", err);
      });
  });
};

const getTECDelays = (filePath, lat = 62.0, lon = 129.7) => {
  return new Promise((resolve) => {
    let options = {
      mode: "text",
      pythonOptions: ["-u"],
      args: [filePath, lat, lon],
    };

    PythonShell.run("./python/find_TEC_delays.py", options)
      .then((results) => {
        resolve(JSON.parse(results.join("")));
      })
      .catch((err) => {
        console.error("Ошибка при запуске Python:", err);
      });
  });
};

const getCords = (filePath, posLat = 62.0, posLong = 129.7) => {
  return new Promise((resolve) => {
    let options = {
      mode: "text",
      pythonOptions: ["-u"],
      args: [filePath, posLat, posLong],
    };

    PythonShell.run("./python/find_cords.py", options)
      .then((results) => {
        resolve(JSON.parse(results.join("")));
      })
      .catch((err) => {
        console.error("Ошибка при запуске Python:", err);
      });
  });
};

const getIonCorrections = (filePath) => {
  return new Promise((resolve) => {
    let options = {
      mode: "text",
      pythonOptions: ["-u"],
      args: [filePath],
    };

    PythonShell.run("./python/get_ion_corrections.py", options)
      .then((results) => {
        resolve(JSON.parse(results.join("")));
      })
      .catch((err) => {
        console.error("Ошибка при запуске Python:", err);
      });
  });
};

const getIoDelaysByEpoch = (filePath, lat = 62.0, lon = 129.7) => {
  return new Promise((resolve) => {
    let options = {
      mode: "text",
      pythonOptions: ["-u"],
      args: [filePath, lat, lon],
    };

    PythonShell.run("./python/io_delays_by_epoch.py", options)
      .then((results) => {
        resolve(JSON.parse(results.join("")));
      })
      .catch((err) => {
        console.error("Ошибка при запуске Python:", err);
      });
  });
};

const getKlobuchar = (lat, lon, elev, azim, time, alpha, beta) => {
  return new Promise((resolve) => {
    const options = {
      mode: "text",
      pythonOptions: ["-u"],
      args: [
        lat.toString(),
        lon.toString(),
        elev.toString(),
        azim.toString(),
        JSON.stringify(time), // Сериализация времени
        JSON.stringify(alpha),
        JSON.stringify(beta)
      ]
    };

    PythonShell.run("./python/klobuchar.py", options)
      .then((results) => {
        try {
          const data = JSON.parse(results.join(""));
          resolve(data.delay || 0);
        } catch (e) {
          console.error("Ошибка парсинга результата:", e);
          resolve(0);
        }
      })
      .catch((err) => {
        console.error("Ошибка выполнения:", err);
        resolve(0);
      });
  });
};


module.exports = {
  getIonex,
  getIonCorrections,
  getCords,
  getTECDelays,
  getIoDelaysByEpoch,
  getKlobuchar,
};
