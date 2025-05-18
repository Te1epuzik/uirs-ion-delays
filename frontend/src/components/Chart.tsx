import type { TTableDto } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type TProps = Readonly<{
  data: TTableDto;
}>;

export const Chart = ({ data }: TProps) => {
	const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const chartData: {
    name: string;
    exactDelay: number;
    forecastDelay: number;
    klobuchar: number;
  }[] = [];

  data.Epoch.forEach((item, index) => {
    chartData.push({
      name: item,
      exactDelay: data.ExactDelay[index],
      forecastDelay: data.ForecastDelay[index],
      klobuchar: data.Klobuchar[index],
    });
  });
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{
              value: "Delay, m",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip contentStyle={{ backgroundColor: isDark ? "#4a4a4a" : "#ffffff" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="exactDelay"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="forecastDelay"
            stroke="#d898a8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="klobuchar"
            stroke="#99e396"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
