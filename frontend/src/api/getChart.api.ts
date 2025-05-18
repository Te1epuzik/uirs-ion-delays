export const getChart = async (url: string) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      data: { name: "Chita", lat: 52.05075711868686, lon: 113.48280154660213 },
    }),
  });

	return response.json();
};
