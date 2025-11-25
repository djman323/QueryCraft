"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
import type { OnMount } from "@monaco-editor/react";
import { Play, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type EditorProps = {
  onRun: (sql: string) => Promise<void>;
  isExecuting: boolean;
};

const Editor: React.FC<EditorProps> = ({ onRun, isExecuting }) => {
  const [sql, setSql] = useState<string>("-- Write your SQL query here\nSELECT * FROM users LIMIT 10;");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add keyboard shortcut: Ctrl+Enter to run query
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        handleRun();
      }
    );
  };

  const handleRun = async () => {
    if (!sql.trim() || isExecuting) return;
    await onRun(sql);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedSql = e.dataTransfer.getData('text/plain');
    
    if (droppedSql && editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      
      // Insert at cursor position or end of file
      if (position) {
        editor.executeEdits('dnd', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: droppedSql,
          forceMoveMarkers: true
        }]);
      } else {
        // Fallback: append to end
        const value = editor.getValue();
        editor.setValue(value + (value ? '\n\n' : '') + droppedSql);
      }
    }
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
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
          SQL Editor
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRun}
          disabled={isExecuting}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            color: "white",
            fontWeight: 500,
            fontSize: "0.875rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {isExecuting ? (
            <>
              <Loader2 size={16} className="animate-pulse" />
              Executing...
            </>
          ) : (
            <>
              <Play size={16} />
              Run Query (Ctrl+Enter)
            </>
          )}
        </motion.button>
      </div>

      <div
        style={{
          flex: 1,
          border: "1px solid var(--border-primary)",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "var(--shadow-md)",
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <MonacoEditor
          height="100%"
          defaultLanguage="sql"
          value={sql}
          onChange={(value) => setSql(value || "")}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            padding: { top: 10, bottom: 10 },
          }}
        />
      </div>
    </motion.div>
  );
};

export default Editor;

