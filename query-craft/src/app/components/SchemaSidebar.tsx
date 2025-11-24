"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, ChevronDown, ChevronRight, Key, Search } from "lucide-react";

interface SchemaColumn {
  name: string;
  type: string;
  notnull: boolean;
  pk: boolean;
}

interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

interface SchemaSidebarProps {
  schema: SchemaTable[];
}

export default function SchemaSidebar({ schema }: SchemaSidebarProps) {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(
    new Set(schema.map(t => t.name))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const filteredSchema = schema.filter(table =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.columns.some(col => col.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: isCollapsed ? "50px" : "280px" }}
      transition={{ duration: 0.3 }}
      style={{
        width: isCollapsed ? "50px" : "280px",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-primary)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: isCollapsed ? "20px 10px" : "20px",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: isCollapsed ? "0" : "16px", justifyContent: isCollapsed ? "center" : "flex-start" }}>
          <Database size={20} style={{ color: "var(--accent-primary)" }} />
          {!isCollapsed && <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Schema</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              marginLeft: isCollapsed ? "0" : "auto",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              color: "var(--text-muted)",
            }}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "6px",
                fontSize: "0.875rem",
              }}
            />
          </div>
        )}
      </div>

      {/* Tables List */}
      {!isCollapsed && (
        <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
        {filteredSchema.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
            }}
          >
            {searchQuery ? "No tables found" : "No tables in database"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredSchema.map((table) => (
              <div
                key={table.name}
                style={{
                  background: "var(--bg-tertiary)",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: "1px solid var(--border-primary)",
                }}
              >
                {/* Table Header */}
                <button
                  onClick={() => toggleTable(table.name)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "transparent",
                    color: "var(--text-primary)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {expandedTables.has(table.name) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    {table.name}
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      background: "var(--bg-primary)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {table.columns.length}
                  </span>
                </button>

                {/* Columns List */}
                <AnimatePresence>
                  {expandedTables.has(table.name) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          padding: "8px 12px",
                          borderTop: "1px solid var(--border-primary)",
                          background: "var(--bg-primary)",
                        }}
                      >
                        {table.columns.map((col) => (
                          <div
                            key={col.name}
                            style={{
                              padding: "6px 8px",
                              fontSize: "0.8125rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {col.pk && (
                              <Key
                                size={12}
                                style={{ color: "var(--accent-warning)", flexShrink: 0 }}
                              />
                            )}
                            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                              {col.name}
                            </span>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--text-muted)",
                                background: "var(--bg-secondary)",
                                padding: "2px 6px",
                                borderRadius: "3px",
                                flexShrink: 0,
                              }}
                            >
                              {col.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </motion.div>
  );
}

