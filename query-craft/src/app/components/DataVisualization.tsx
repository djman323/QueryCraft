"use client";

import { motion } from "framer-motion";
import { BarChart3, PieChart, LineChart, X } from "lucide-react";

interface ChartData {
  type: "bar" | "pie" | "line";
  title: string;
  data: { label: string; value: number }[];
}

interface DataVisualizationProps {
  chartData: ChartData;
  onClose: () => void;
}

export default function DataVisualization({ chartData, onClose }: DataVisualizationProps) {
  const maxValue = Math.max(...chartData.data.map((d) => d.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "var(--bg-secondary)",
          borderRadius: "8px",
          border: "1px solid var(--border-primary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {chartData.type === "bar" && <BarChart3 size={20} style={{ color: "var(--accent-primary)" }} />}
          {chartData.type === "pie" && <PieChart size={20} style={{ color: "var(--accent-primary)" }} />}
          {chartData.type === "line" && <LineChart size={20} style={{ color: "var(--accent-primary)" }} />}
          <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{chartData.title}</h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            color: "var(--text-muted)",
          }}
          title="Close chart"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chart Container */}
      <div
        style={{
          flex: 1,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "8px",
          padding: "24px",
          overflow: "auto",
        }}
      >
        {chartData.type === "bar" && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              height: "100%",
              gap: "16px",
              padding: "20px 0",
            }}
          >
            {chartData.data.map((item, index) => {
              const heightPercent = (item.value / maxValue) * 100;
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                    maxWidth: "120px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {item.value}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{
                      width: "100%",
                      minHeight: "20px",
                      background: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))`,
                      borderRadius: "6px 6px 0 0",
                      boxShadow: "var(--shadow-md)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      textAlign: "center",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {chartData.type === "pie" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "24px",
            }}
          >
            {/* Simple pie chart representation */}
            <div
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: `conic-gradient(${chartData.data
                  .map((item, index) => {
                    const total = chartData.data.reduce((sum, d) => sum + d.value, 0);
                    const percent = (item.value / total) * 100;
                    const colors = [
                      "var(--accent-primary)",
                      "var(--accent-secondary)",
                      "var(--accent-success)",
                      "var(--accent-warning)",
                      "var(--accent-error)",
                    ];
                    return `${colors[index % colors.length]} 0 ${percent}%`;
                  })
                  .join(", ")})`,
                boxShadow: "var(--shadow-lg)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {chartData.data.map((item, index) => {
                const colors = [
                  "var(--accent-primary)",
                  "var(--accent-secondary)",
                  "var(--accent-success)",
                  "var(--accent-warning)",
                  "var(--accent-error)",
                ];
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.875rem",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "3px",
                        background: colors[index % colors.length],
                      }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>
                      {item.label}: <strong>{item.value}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {chartData.type === "line" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "20px",
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="50"
                  y1={50 + i * 50}
                  x2="450"
                  y2={50 + i * 50}
                  stroke="var(--border-primary)"
                  strokeWidth="1"
                  opacity="0.3"
                />
              ))}

              {/* Line path */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                d={chartData.data
                  .map((item, index) => {
                    const x = 50 + (index * 400) / (chartData.data.length - 1);
                    const y = 250 - (item.value / maxValue) * 200;
                    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                stroke="var(--accent-primary)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {chartData.data.map((item, index) => {
                const x = 50 + (index * 400) / (chartData.data.length - 1);
                const y = 250 - (item.value / maxValue) * 200;
                return (
                  <g key={index}>
                    <circle cx={x} cy={y} r="5" fill="var(--accent-secondary)" />
                    <text
                      x={x}
                      y={y - 15}
                      textAnchor="middle"
                      fontSize="12"
                      fill="var(--text-primary)"
                    >
                      {item.value}
                    </text>
                    <text
                      x={x}
                      y={275}
                      textAnchor="middle"
                      fontSize="10"
                      fill="var(--text-secondary)"
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}
