import { useState } from "react";

type TTableDto = {
  Epoch: string[];
  ExactDelay: number[];
  ForecastDelay: number[];
  Klobuchar: number[];
};

export const useData = () => {
  const [data, setData] = useState<TTableDto | null>(null);
  const [city, setCity] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  const getData = async (city: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      city
    )}&limit=1`;

    const response = await fetch(url);
    const coords = await response.json();

    setCity(city);
    setCoords({ lat: coords[0].lat, lon: coords[0].lon });
  };

  const getFakeData = () => {
    setData({
      Epoch: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
      ],
      ExactDelay: [1, 2, 3, 3, 5, 6, 7, 8, 9, 9, 11, 8, 4],
      ForecastDelay: [2, 3, 4, 4, 6, 3, 8, 2, 3, 8, 5, 7, 5],
      Klobuchar: [3, 2, 6, 8, 2, 1, 7, 2, 4, 7, 4, 9, 3],
    });
  };

  return { getFakeData, getData, data, city, coords };
};
