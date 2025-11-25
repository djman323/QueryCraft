/**
 * Draggable Table Connection Graph Component
 * 
 * Interactive ER diagram that visualizes database table relationships.
 * Users can drag tables around to organize the layout, and foreign key
 * relationships are automatically detected and displayed as connection arrows.
 * 
 * Features:
 * - Drag-and-drop table positioning
 * - Automatic foreign key detection (by _id suffix convention)
 * - SVG-based connection rendering with arrows
 * - Full table schema display in each node
 * - Grid-based initial layout
 * 
 * @component
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { Key, Hash, Type, Calendar, AlignLeft, CheckSquare } from "lucide-react";

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

interface DraggableTableConnectionGraphProps {
  schema: SchemaTable[];
}

interface Position {
  x: number;
  y: number;
}

// Helper to get icon for column type
const getColumnIcon = (type: string, pk: boolean) => {
  if (pk) return <Key size={12} className="text-yellow-500" />;
  if (type.includes("int") || type.includes("float") || type.includes("number"))
    return <Hash size={12} className="text-blue-400" />;
  if (type.includes("date") || type.includes("time"))
    return <Calendar size={12} className="text-green-400" />;
  if (type.includes("bool"))
    return <CheckSquare size={12} className="text-purple-400" />;
  return <Type size={12} className="text-gray-400" />;
};

// Calculate initial positions in a grid layout
const getInitialPositions = (schema: SchemaTable[], width: number, height: number) => {
  const positions: Record<string, Position> = {};
  const cols = Math.ceil(Math.sqrt(schema.length));
  const rows = Math.ceil(schema.length / cols);
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  schema.forEach((table, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    positions[table.name] = {
      x: col * cellWidth + cellWidth / 2 - 100, // Center in cell, offset by half card width (approx)
      y: row * cellHeight + cellHeight / 2 - 100,
    };
  });
  return positions;
};

const getConnections = (schema: SchemaTable[]) => {
  const tableMap = new Map<string, SchemaTable>();
  schema.forEach((t) => tableMap.set(t.name, t));
  const connections: { from: string; to: string }[] = [];
  schema.forEach((t) => {
    t.columns.forEach((c) => {
      if (c.name.endsWith("_id")) {
        const targetName = c.name.replace(/_id$/i, "");
        const possible = [targetName, `${targetName}s`, `${targetName}es`];
        const found = possible.find((n) => tableMap.has(n));
        if (found) connections.push({ from: t.name, to: found });
      }
    });
  });
  return connections;
};

// Internal component for a single draggable node
const DraggableNode = ({
  table,
  initialPos,
  onPositionChange,
}: {
  table: SchemaTable;
  initialPos: Position;
  onPositionChange: (name: string, x: number, y: number) => void;
}) => {
  const x = React.useRef(initialPos.x);
  const y = React.useRef(initialPos.y);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: initialPos.x, y: initialPos.y }}
      onDrag={(event, info) => {
        // We need to track the absolute position. 
        // info.point is relative to the viewport, which is hard to use if container scrolls.
        // info.offset is the total drag distance from start.
        // So current pos = initial drag start pos + offset.
        // But we need to persist this when drag ends.
        // Let's just use the delta to accumulate.
        x.current += info.delta.x;
        y.current += info.delta.y;
        onPositionChange(table.name, x.current, y.current);
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "200px",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-primary)",
        borderRadius: "8px",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
        cursor: "grab",
      }}
      whileDrag={{ scale: 1.02, cursor: "grabbing", zIndex: 20 }}
    >
      {/* Header */}
      <div
        style={{
          padding: "8px 12px",
          background: "var(--bg-tertiary)",
          borderBottom: "1px solid var(--border-primary)",
          borderRadius: "8px 8px 0 0",
          fontWeight: 600,
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{table.name}</span>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
          {table.columns.length} cols
        </span>
      </div>

      {/* Columns */}
      <div style={{ padding: "8px", maxHeight: "200px", overflowY: "auto" }}>
        {table.columns.map((col) => (
          <div
            key={col.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 0",
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              borderBottom: "1px solid var(--border-primary)",
            }}
          >
            {getColumnIcon(col.type, col.pk)}
            <span
              style={{
                flex: 1,
                fontWeight: col.pk ? 600 : 400,
                color: col.pk ? "var(--text-primary)" : "inherit",
              }}
            >
              {col.name}
            </span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
              {col.type}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default function DraggableTableConnectionGraph({ schema }: DraggableTableConnectionGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const connections = React.useMemo(() => getConnections(schema), [schema]);

  // Initialize positions
  useEffect(() => {
    if (containerRef.current && Object.keys(positions).length === 0 && schema.length > 0) {
      const { clientWidth, clientHeight } = containerRef.current;
      setPositions(getInitialPositions(schema, clientWidth, clientHeight));
    }
  }, [schema]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePositionChange = (name: string, x: number, y: number) => {
    setPositions((prev) => ({
      ...prev,
      [name]: { x, y },
    }));
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg-primary)",
        backgroundImage: "radial-gradient(var(--border-primary) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-primary)" />
          </marker>
        </defs>
        {connections.map((c, idx) => {
          const start = positions[c.from];
          const end = positions[c.to];
          if (!start || !end) return null;

          const startX = start.x + 100;
          const startY = start.y + 20;
          const endX = end.x + 100;
          const endY = end.y + 20;

          return (
            <line
              key={`${c.from}-${c.to}-${idx}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="var(--accent-primary)"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              opacity="0.6"
            />
          );
        })}
      </svg>

      {schema.map((table) => {
        // Only render if we have an initial position
        if (!positions[table.name]) return null;
        
        return (
          <DraggableNode
            key={table.name}
            table={table}
            initialPos={positions[table.name]}
            onPositionChange={handlePositionChange}
          />
        );
      })}
    </div>
  );
}
