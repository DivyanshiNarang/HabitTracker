import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../context/ThemeContext.jsx";

export default function WeeklyBarChart({ data, title = "Last 7 days" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const grid = isDark ? "rgba(255,255,255,0.08)" : "rgba(26,43,30,0.07)";
  const tick = isDark ? "#7a9a82" : "#5a7260";
  const tooltipStyle = {
    background: isDark ? "rgba(13,21,16,0.97)" : "rgba(255,255,255,0.97)",
    border: `1px solid ${isDark ? "rgba(74,124,89,0.2)" : "rgba(74,124,89,0.15)"}`,
    borderRadius: 12,
    fontSize: 12,
    color: isDark ? "#e6f0e8" : "#1a2b1e",
    backdropFilter: "blur(12px)",
  };

  return (
    <div className="card p-5">
      <div className="text-sm font-medium mb-3">{title}</div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <defs>
              <linearGradient id="wkbar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#88b895" />
                <stop offset="100%" stopColor="#3d6849" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: tick }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: tick }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(26,43,30,0.04)" }}
              contentStyle={tooltipStyle}
            />
            <Bar dataKey="count" fill="url(#wkbar)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
