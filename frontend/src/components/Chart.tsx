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

  data.epoch.forEach((item, index) => {
    chartData.push({
      name: item,
      exactDelay: data.exactDelay[index],
      forecastDelay: data.forecastDelay[index],
      klobuchar: data.klobuchar[index],
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
          <Tooltip contentStyle={{ color: isDark ? "#ffffff" : "#213547", backgroundColor: isDark ? "#242424" : "#ffffff" }} />
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
