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

module.exports = { getIonex, getIonCorrections };
