const URL = "http://localhost:3000";

export const getChart = async (body: { lat: number; lon: number }) => {
  const response = await fetch(URL + "/data", {
    method: "POST",
    body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
  });

	console.log(response);

  return response.json();
};

export const getCoords = async (city: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    city
  )}&limit=1`;

  const response = await fetch(url);

  return response.json();
};
