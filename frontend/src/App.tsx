import "./styles.scss";
import { Chart, Table } from "./components";
import { useData } from "./hooks";
import { useState } from "react";

function App() {
  const [cityInput, setCityInput] = useState<string>("");
  const { getFakeData, getData, data, city, coords } = useData();

  const handleEnterCity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setCityInput(value);
  };

  return (
    <main className="main">
      <label className="main__city-label" htmlFor="city">
        City:{" "}
      </label>
      <input
        onChange={handleEnterCity}
        value={cityInput}
        className="main__city-input"
        placeholder="Enter your city"
        type="text"
        name="city"
        id="city"
      />
      <button
        className="main__button"
        onClick={() => {
          getData(cityInput);
          getFakeData();
        }}
        disabled={cityInput.length === 0}
      >
        Plot a chart
      </button>
      <div className="coords">
        <span className="coords__lat">Lat: {coords?.lat}</span>{" "}
        <span className="coords__lon">Lon: {coords?.lon}</span>
      </div>
			<div className="developers">
				<span className="developers__group">M40-502C-20</span>
				<span className="developers__sigma">Тонких С. А.</span>
				<span className="developers__sigma">Капралов С. А.</span>
			</div>
      {data && (
        <div className={"chart"}>
          <h3 className="chart-title">Ionospheric delays for {city}</h3>
          <Table data={data} />
          <Chart data={data} />
        </div>
      )}
    </main>
  );
}

export default App;
