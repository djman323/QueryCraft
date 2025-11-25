"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Download,

  ChevronDown,
  ChevronRight,
  Trash2,
  Copy,
  Clock,
  FileJson,
  FileText,
  Zap,
  TrendingUp,
} from "lucide-react";
import TableChartSelector, { SchemaTable } from "./TableChartSelector";
import TableConnectionGraph from "./TableConnectionGraph";
import DraggableTableConnectionGraph from "./DraggableTableConnectionGraph";

interface QueryHistoryItem {
  id: string;
  sql: string;
  timestamp: Date;
  executionTime: number;
  success: boolean;
}

interface FeaturesSidebarProps {
  schema: SchemaTable[];
  onShowChart?: (chartData: {
    type: "bar" | "pie" | "line";
    title: string;
    data: { label: string; value: number }[];
  }) => void;
}

export default function FeaturesSidebar({ schema, onShowChart }: FeaturesSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["history", "export", "format", "stats", "settings", "connections"]));
  const [showDraggable, setShowDraggable] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([
    {
      id: "1",
      sql: "SELECT * FROM users LIMIT 10;",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      executionTime: 12.5,
      success: true,
    },
    {
      id: "2",
      sql: "SELECT COUNT(*) FROM orders WHERE status = 'completed';",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      executionTime: 8.3,
      success: true,
    },
    {
      id: "3",
      sql: "SELECT * FROM products ORDER BY price DESC;",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      executionTime: 15.7,
      success: false,
    },
  ]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleCopyQuery = (sql: string) => {
    navigator.clipboard.writeText(sql);
  };

  const handleDeleteHistory = (id: string) => {
    setQueryHistory(queryHistory.filter((item) => item.id !== id));
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(queryHistory, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query_history_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSQL = () => {
    const data = queryHistory.map((item) => item.sql).join("\n\n");
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `queries_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      style={{
        width: "280px",
        height: "100%",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-primary)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px", borderBottom: "1px solid var(--border-primary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Zap size={20} style={{ color: "var(--accent-primary)" }} />
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Features</h2>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {/* Query History Section */}
        <div style={{ marginBottom: "8px" }}>
          <button
            onClick={() => toggleSection("history")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--text-primary)",
              background: "transparent",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <History size={16} style={{ color: "var(--accent-primary)" }} />
              <span>Query History</span>
            </div>
            {expandedSections.has("history") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <AnimatePresence>
            {expandedSections.has("history") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden", paddingLeft: "8px", marginTop: "4px" }}
              >
                {queryHistory.length === 0 ? (
                  <div style={{ padding: "12px", fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
                    No query history
                  </div>
                ) : (
                  queryHistory.map((item) => (
                    <div key={item.id} style={{ padding: "8px", marginBottom: "4px", background: "var(--bg-tertiary)", borderRadius: "6px", border: `1px solid ${item.success ? "var(--border-primary)" : "var(--accent-error)"}` }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "monospace", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.sql}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <span>
                            <Clock size={10} style={{ display: "inline", marginRight: "2px" }} />
                            {formatTimestamp(item.timestamp)}
                          </span>
                          <span>{item.executionTime}ms</span>
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button onClick={() => handleCopyQuery(item.sql)} style={{ padding: "2px", background: "transparent", cursor: "pointer" }} title="Copy query">
                            <Copy size={12} style={{ color: "var(--text-muted)" }} />
                          </button>
                          <button onClick={() => handleDeleteHistory(item.id)} style={{ padding: "2px", background: "transparent", cursor: "pointer" }} title="Delete">
                            <Trash2 size={12} style={{ color: "var(--accent-error)" }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Export/Import Section */}
        <div style={{ marginBottom: "8px" }}>
          <button
            onClick={() => toggleSection("export")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--text-primary)",
              background: "transparent",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Download size={16} style={{ color: "var(--accent-success)" }} />
              <span>Export/Import</span>
            </div>
            {expandedSections.has("export") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <AnimatePresence>
            {expandedSections.has("export") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden", paddingLeft: "8px", marginTop: "4px" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <button onClick={handleExportJSON} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)", borderRadius: "6px", fontSize: "0.8125rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                    <FileJson size={14} /> Export as JSON
                  </button>
                  <button onClick={handleExportSQL} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)", borderRadius: "6px", fontSize: "0.8125rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                    <FileText size={14} /> Export as SQL
                  </button>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>



        {/* DB Statistics Section */}
        <div style={{ marginBottom: "8px" }}>
          <button
            onClick={() => {
              if (onShowChart) {
                onShowChart({
                  type: "bar",
                  title: "Database Statistics",
                  data: [
                    { label: "Users", value: 247 },
                    { label: "Products", value: 156 },
                    { label: "Orders", value: 523 },
                    { label: "Categories", value: 45 },
                    { label: "Reviews", value: 276 },
                  ],
                });
              }
            }}
            style={{ width: "100%", padding: "10px 12px", background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <TrendingUp size={12} /> View Detailed Stats
          </button>
        </div>

        {/* Data Analytics Section */}
        <div style={{ marginBottom: "8px" }}>
          <TableChartSelector schema={schema} onShowChart={onShowChart} />
        {/* Table Connections Section */}
        <div style={{ marginBottom: "8px" }}>
          <button
            onClick={() => toggleSection("connections")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--text-primary)",
              background: "transparent",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Zap size={16} style={{ color: "var(--accent-warning)" }} />
              <span>Table Connections</span>
            </div>
            {expandedSections.has("connections") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <AnimatePresence>
            {expandedSections.has("connections") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden", paddingLeft: "8px", marginTop: "4px" }}
              >
                {/* Buttons to switch visualization */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <button
                    onClick={() => setShowDraggable(false)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      background: showDraggable ? "var(--bg-primary)" : "var(--bg-tertiary)",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Static Graph
                  </button>
                  <button
                    onClick={() => setShowDraggable(true)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      background: showDraggable ? "var(--bg-tertiary)" : "var(--bg-primary)",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Draggable Graph
                  </button>
                </div>
                {showDraggable ? (
                  <DraggableTableConnectionGraph schema={schema} />
                ) : (
                  <TableConnectionGraph schema={schema} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </motion.div>
  );
}
