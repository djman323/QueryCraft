/**
 * Main Application Page
 * 
 * This is the root component of QueryCraft that orchestrates the entire SQL editor application.
 * It manages global state, database initialization, query execution, and coordinates
 * communication between all child components.
 * 
 * @module page
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Editor from "./components/Editor";
import ResultsGrid from "./components/ResultsGrid";
import QueryTabs from "./components/QueryTabs";
import SchemaSidebar from "./components/SchemaSidebar";
import FeaturesSidebar from "./components/FeaturesSidebar";
import QueryLibrarySidebar from "./components/QueryLibrarySidebar";
import ChartsView from "./components/ChartsView";
import DraggableTableConnectionGraph from "./components/DraggableTableConnectionGraph";

/**
 * Result of a SQL query execution
 */
interface QueryResult {
  /** Column names in the result set */
  columns: string[];
  /** 2D array of row data */
  values: (string | number | boolean | null)[][];
  /** Number of rows affected (for DML operations) */
  rowsAffected?: number;
  /** Execution time in milliseconds */
  executionTime: number;
}

/**
 * Represents a database table with its columns
 */
interface SchemaTable {
  /** Table name */
  name: string;
  /** Array of column definitions */
  columns: SchemaColumn[];
}

/**
 * Represents a table column with its metadata
 */
interface SchemaColumn {
  /** Column name */
  name: string;
  /** Data type (TEXT, INTEGER, etc.) */
  type: string;
  /** Whether column has NOT NULL constraint */
  notnull: boolean;
  /** Whether column is a primary key */
  pk: boolean;
}

/**
 * Represents a query editor tab
 */
interface Tab {
  /** Unique tab identifier */
  id: number;
  /** Display name of the tab */
  name: string;
}

/**
 * Main application component
 * 
 * Manages the entire QueryCraft application including:
 * - Database initialization and lifecycle
 * - Query execution and result display
 * - Tab management for multiple queries
 * - Schema visualization and exploration
 * - Chart generation from query results
 * - ER diagram visualization
 * 
 * @returns The rendered application
 */
export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, name: "Query 1" }]);
  const [activeTab, setActiveTab] = useState(1);
  const [results, setResults] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<SchemaTable[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [chartData, setChartData] = useState<{
    type: "bar" | "pie" | "line";
    title: string;
    data: { label: string; value: number }[];
  } | null>(null);
  const [showConnections, setShowConnections] = useState(false);

  /**
   * Initialize SQL.js database on component mount
   * Loads sample data and retrieves initial schema
   */
  useEffect(() => {
    const init = async () => {
      try {
        const { initDatabase, getSchema: getSchemaFn } = await import("./lib/sqlEngine");
        await initDatabase();
        const newSchema = getSchemaFn();
        setSchema(newSchema);
        setIsInitialized(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(`Failed to initialize database: ${err.message}`);
      }
    };
    init();
  }, []);

  /**
   * Refreshes the database schema after DDL operations
   * Called after CREATE, DROP, or ALTER statements
   */
  const refreshSchema = async () => {
    const { getSchema: getSchemaFn } = await import("./lib/sqlEngine");
    const newSchema = getSchemaFn();
    setSchema(newSchema);
  };

  /**
   * Executes a SQL query and updates the UI with results
   * 
   * @param sql - The SQL query string to execute
   * 
   * Handles:
   * - Query execution and timing
   * - Error display
   * - Schema refresh for DDL commands
   */
  const runQuery = async (sql: string) => {
    setIsExecuting(true);
    setError(null);
    
    try {
      const { executeQuery: executeQueryFn } = await import("./lib/sqlEngine");
      const result = await executeQueryFn(sql);
      setResults(result);
      
      // Refresh schema if it was a DDL command
      if (
        sql.trim().toUpperCase().startsWith("CREATE") ||
        sql.trim().toUpperCase().startsWith("DROP") ||
        sql.trim().toUpperCase().startsWith("ALTER")
      ) {
        await refreshSchema();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Query execution failed");
      setResults(null);
    } finally {
      setIsExecuting(false);
    }
  };

  /**
   * Creates a new query tab
   * Generates a unique ID and switches to the new tab
   */
  const addTab = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    setTabs([...tabs, { id: newId, name: `Query ${newId}` }]);
    setActiveTab(newId);
  };

  /**
   * Closes a query tab
   * 
   * @param id - ID of the tab to close
   * 
   * Prevents closing the last tab and switches to another tab if
   * the closed tab was active
   */
  const closeTab = (id: number) => {
    if (tabs.length === 1) return;
    
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    
    if (activeTab === id) {
      setActiveTab(newTabs[0].id);
    }
  };

  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto 16px" }} />
          <p>Initializing SQL Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Left Sidebar Column - Schema + Features */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--border-primary)",
        }}
      >
        {/* Schema Sidebar - Top Half */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          <SchemaSidebar schema={schema} />
        </div>
        
        {/* Features Sidebar - Bottom Half */}
        <div style={{ flex: 1, overflow: "auto", display: "flex" }}>
          <FeaturesSidebar schema={schema} onShowChart={(chartData) => setChartData(chartData)} />
        </div>
      </div>

      {/* Main Editor Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border-primary)",
              background: "var(--bg-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                QueryCraft
              </h1>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "4px" }}>Modern SQL Editor with In-Browser Execution</p>
            </div>
            <button
              onClick={() => setShowConnections(!showConnections)}
              style={{
                padding: "6px 12px",
                background: showConnections ? "var(--bg-primary)" : "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "4px",
                cursor: "pointer",
                color: "var(--text-primary)",
              }}
            >
              {showConnections ? "Hide Connections" : "Show Connections"}
            </button>
          </motion.div>

        {/* Query Tabs */}
        <div style={{ padding: "0 24px" }}>
          <QueryTabs
            tabs={tabs}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onAddTab={addTab}
            onCloseTab={closeTab}
          />
        </div>

        {/* Editor and Results */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "16px 24px 24px",
            overflow: "hidden",
          }}
        >
          {showConnections ? (
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <DraggableTableConnectionGraph schema={schema} />
            </div>
          ) : (
            <>
              {/* Editor - 40% height */}
              <div style={{ height: "40%", minHeight: "200px" }}>
                <Editor onRun={runQuery} isExecuting={isExecuting} />
              </div>

              {/* Results - 60% height */}
              <div style={{ flex: 1, minHeight: "0" }}>
                {chartData ? (
                  <ChartsView chartData={chartData} onClose={() => setChartData(null)} />
                ) : (
                  <ResultsGrid data={results} error={error} />
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "8px 24px",
            textAlign: "center",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            borderTop: "1px solid var(--border-primary)",
            background: "var(--bg-secondary)",
          }}
        >
          Made by Devansh Jani
        </div>
      </div>

      {/* Query Library Sidebar */}
      <QueryLibrarySidebar />
    </div>
  );
}

