"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface SchemaColumn {
  name: string;
  type: string;
  notnull: boolean;
  pk: boolean;
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

interface TableChartSelectorProps {
  schema: SchemaTable[];
  onShowChart?: (chartData: {
    type: "bar" | "pie" | "line";
    title: string;
    data: { label: string; value: number }[];
  }) => void;
}

export default function TableChartSelector({
  schema,
  onShowChart,
}: TableChartSelectorProps) {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [columns, setColumns] = useState<SchemaColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update column list when table changes
  useEffect(() => {
    if (!selectedTable) {
      setColumns([]);
      setSelectedColumn("");
      return;
    }
    const table = schema.find((t) => t.name === selectedTable);
    if (table) {
      setColumns(table.columns);
      setSelectedColumn("");
    }
  }, [selectedTable, schema]);

  const generateChart = async () => {
    if (!selectedTable || !selectedColumn) return;
    setLoading(true);
    setError(null);
    try {
      // Dynamically import to avoid circular dependencies
      const { executeQuery: exec } = await import("../lib/sqlEngine");
      const sql = `SELECT ${selectedColumn} as label, COUNT(*) as value FROM ${selectedTable} GROUP BY ${selectedColumn}`;
      const result = await exec(sql);
      // Transform result into chart data
      const chartData = result.values.map((row) => ({
        label: String(row[0]),
        value: Number(row[1]),
      }));
      onShowChart?.({
        type: "pie",
        title: `${selectedTable} - ${selectedColumn} Distribution`,
        data: chartData,
      });
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to generate chart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        border: "1px solid var(--border-primary)",
        borderRadius: "8px",
        padding: "12px",
        background: "var(--bg-tertiary)",
        marginBottom: "12px",
      }}
    >
      <h4
        style={{
          fontSize: "0.9rem",
          marginBottom: "8px",
          color: "var(--text-primary)",
        }}
      >
        Data Analytics
      </h4>
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          style={{ flex: 1, padding: "6px", borderRadius: "4px" }}
        >
          <option value="">Select Table</option>
          {schema.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          disabled={!selectedTable}
          style={{ flex: 1, padding: "6px", borderRadius: "4px" }}
        >
          <option value="">Select Column</option>
          {columns.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={generateChart}
        disabled={!selectedTable || !selectedColumn || loading}
        style={{
          width: "100%",
          padding: "8px",
          background: "var(--accent-primary)",
          color: "var(--text-on-primary)",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Chart"}
      </button>
      {error && (
        <div
          style={{
            marginTop: "8px",
            color: "var(--accent-error)",
            fontSize: "0.75rem",
          }}
        >
          {error}
        </div>
      )}
    </motion.div>
  );
}
