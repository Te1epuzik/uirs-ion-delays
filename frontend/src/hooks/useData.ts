import { useState } from "react";
import { getCoords, getChart } from "../api";
import type { TTableDto } from "../types";

export const useData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TTableDto | null>(null);
  const [city, setCity] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  const getData = async (city: string) => {
    setIsLoading(true);
		setError(null);
    try {
      const coords = await getCoords(city);

      if (!coords.length) {
				setIsLoading(false);
				setCity("");
				setCoords(null);
				setData(null);
				setError("City not found");
				return;
      }

      const { lat, lon, display_name } = coords[0];

      const data = await getChart({
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      });

      setCity(display_name);
      setCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
      setData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { getData, data, city, coords, isLoading, error };
};
