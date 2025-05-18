import type { TTableDto } from "../types";

type TProps = Readonly<{
  data: TTableDto;
}>;

export const Table = ({ data }: TProps) => {
  return (
    <div className="table">
      <header className="table__header">
        <h2 className="table__title">Ion Delays</h2>
        <div className="table__legend">
          <div className="table__legend-item">Epoch</div>
          <div className="table__legend-item">Exact Delay</div>
          <div className="table__legend-item">Forecast Delay</div>
          <div className="table__legend-item">Klobuchar</div>
        </div>
      </header>
      <div className="table__body">
        <div className="table__body-col table__Epoch">
          {data.epoch.map((item, index) => (
            <div
              className="table__body-row"
              key={index + Date.now().toString()}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="table__body-col table__ExactDelay">
          {data.exactDelay.map((item, index) => (
            <div
              className="table__body-row"
              key={index + Date.now().toString()}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="table__body-col table__ForecastDelay">
          {data.forecastDelay.map((item, index) => (
            <div
              className="table__body-row"
              key={index + Date.now().toString()}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="table__body-col table__Klobuchar">
          {data.klobuchar.map((item, index) => (
            <div
              className="table__body-row"
              key={index + Date.now().toString()}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
