import "./styles.scss";
import { Chart, Table } from "./components";
import { useData } from "./hooks";
import { useState } from "react";

function App() {
  const [cityInput, setCityInput] = useState<string>("");
  const { getData, data, city, coords, isLoading, error } = useData();

  const handleEnterCity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setCityInput(value);
  };

  return (
    <main className="main">
      <label className="main__city-label" htmlFor="city">
        City:{" "}
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getData(cityInput);
        }}
      >
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
          type="submit"
          className="main__button"
          disabled={cityInput.length === 0}
        >
          Plot a chart
        </button>
      </form>
      <div className="developers">
        <span className="developers__group">M40-502C-20</span>
        <span className="developers__sigma">Тонких С. А.</span>
        <span className="developers__sigma">Капралов С. А.</span>
      </div>
      {coords && (
        <div className="coords">
          <span className="coords__lat">Lat: {coords?.lat}</span>{" "}
          <span className="coords__lon">Lon: {coords?.lon}</span>
        </div>
      )}
			{error && <div className="error">{error}</div>}
      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          {data && (
            <div className={"chart"}>
              <h3 className="chart-title">
                Ionospheric delays for{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontStyle: "italic",
                  }}
                >
                  «{city}»
                </span>
              </h3>
              <Table data={data} />
              <Chart data={data} />
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default App;
