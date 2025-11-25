import React from "react";
import { motion } from "framer-motion";

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

interface TableConnectionGraphProps {
  schema: SchemaTable[];
}

// Simple heuristic: if a column name ends with "_id" and matches another table name (singular/plural), create an edge.
const getConnections = (schema: SchemaTable[]) => {
  const tableMap = new Map<string, SchemaTable>();
  schema.forEach((t) => tableMap.set(t.name, t));
  const connections: { from: string; to: string }[] = [];
  schema.forEach((t) => {
    t.columns.forEach((c) => {
      if (c.name.endsWith("_id")) {
        const targetName = c.name.replace(/_id$/i, "");
        // try exact match or plural/singular variations
        const possible = [targetName, `${targetName}s`, `${targetName}es`];
        const found = possible.find((n) => tableMap.has(n));
        if (found) {
          connections.push({ from: t.name, to: found });
        }
      }
    });
  });
  return connections;
};

export default function TableConnectionGraph({ schema }: TableConnectionGraphProps) {
  const connections = React.useMemo(() => getConnections(schema), [schema]);
  const width = 300;
  const height = 200;
  const nodeRadius = 20;
  const nodes = schema.map((t, i) => ({
    name: t.name,
    x: ((i + 1) * width) / (schema.length + 1),
    y: height / 2,
  }));

  const nodeMap = new Map(nodes.map((n) => [n.name, n]));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ padding: "12px", background: "var(--bg-tertiary)", borderRadius: "8px", border: "1px solid var(--border-primary)" }}
    >
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {/* Edges */}
        {connections.map((c, idx) => {
          const from = nodeMap.get(c.from);
          const to = nodeMap.get(c.to);
          if (!from || !to) return null;
          return (
            <line
              key={idx}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--accent-primary)"
              strokeWidth={2}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((n) => (
          <g key={n.name}>
            <circle cx={n.x} cy={n.y} r={nodeRadius} fill="var(--bg-primary)" stroke="var(--border-primary)" />
            <text
              x={n.x}
              y={n.y}
              textAnchor="middle"
              dy="0.35em"
              fontSize="0.75rem"
              fill="var(--text-primary)"
            >
              {n.name}
            </text>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}
