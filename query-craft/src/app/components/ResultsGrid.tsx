/**
 * Results Grid Component
 * 
 * Displays SQL query results in a sortable, interactive table format.
 * Provides CSV export, execution metrics, and handles various result states
 * (success, error, empty, no data).
 * 
 * @component
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Database, Clock } from "lucide-react";

/**
 * Props for the ResultsGrid component
 */
interface ResultsGridProps {
  /** Query result data or null if no query executed */
  data: {
    /** Column names */
    columns: string[];
    /** Row data as 2D array */
    values: (string | number | boolean | null)[][];
    /** Number of rows affected by DML operations */
    rowsAffected?: number;
    /** Query execution time in milliseconds */
    executionTime: number;
  } | null;
  /** Error message if query failed */
  error: string | null;
}

/**
 * Results Grid Component
 * 
 * Displays query results with:
 * - Sortable columns (click to sort)
 * - CSV export functionality
 * - Execution time and row count metrics
 * - NULL value handling
 * - Error state display
 * - Empty state messaging
 * 
 * @param props - Component props
 * @returns Rendered results table or appropriate state message
 */
export default function ResultsGrid({ data, error }: ResultsGridProps) {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: "20px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--accent-error)",
          borderRadius: "8px",
          color: "var(--accent-error)",
        }}
      >
        <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Error</h3>
        <p style={{ fontSize: "0.875rem" }}>{error}</p>
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: "40px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "8px",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        <Database size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
        <p>Run a query to see results</p>
      </motion.div>
    );
  }

  const { columns, values, rowsAffected, executionTime } = data;

  if (columns.length === 0 || values.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: "20px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            <Clock size={14} style={{ display: "inline", marginRight: "4px" }} />
            {executionTime.toFixed(2)}ms
          </div>
          {rowsAffected !== undefined && (
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              <Database size={14} style={{ display: "inline", marginRight: "4px" }} />
              {rowsAffected} row(s) affected
            </div>
          )}
        </div>
        <p style={{ color: "var(--accent-success)" }}>Query executed successfully</p>
      </motion.div>
    );
  }

  /**
   * Handles column sorting
   * Toggles sort direction if same column clicked, otherwise sorts ascending
   * 
   * @param columnIndex - Index of the column to sort by
   */
  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnIndex);
      setSortDirection("asc");
    }
  };

  const sortedValues = sortColumn !== null
    ? [...values].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal === bVal) return 0;
        if (aVal === null) return 1;
        if (bVal === null) return -1;
        
        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === "asc" ? comparison : -comparison;
      })
    : values;

  /**
   * Exports query results to CSV file
   * Handles comma escaping and generates timestamped filename
   */
  const exportToCSV = () => {
    const csvContent = [
      columns.join(","),
      ...sortedValues.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      {/* Stats Bar */}
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
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            <Database size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
            <strong>{sortedValues.length}</strong> row(s)
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            <Clock size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
            <strong>{executionTime.toFixed(2)}</strong>ms
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "6px",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
          }}
        >
          <Download size={14} />
          Export CSV
        </motion.button>
      </div>

      {/* Results Table */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "8px",
        }}
      >
        <table>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} onClick={() => handleSort(idx)}>
                  {col}
                  {sortColumn === idx && (
                    <span style={{ marginLeft: "6px" }}>
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedValues.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx}>
                    {cell === null ? (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                        NULL
                      </span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

