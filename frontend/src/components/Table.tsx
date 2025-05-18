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
          {data.Epoch.map((item, index) => (
            <div
              className="table__body-row"
              key={index + Date.now().toString()}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="table__body-col table__ExactDelay">
          {data.ExactDelay.map((item, index) => (
            <div
              className="table__body-row"
              key={index + Date.now().toString()}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="table__body-col table__ForecastDelay">
          {data.ForecastDelay.map((item, index) => (
            <div
              className="table__body-row"
              key={index + Date.now().toString()}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="table__body-col table__Klobuchar">
          {data.Klobuchar.map((item, index) => (
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
