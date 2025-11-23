"use client";

import React, { useState, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Play, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type EditorProps = {
  onRun: (sql: string) => Promise<void>;
  isExecuting: boolean;
};

const Editor: React.FC<EditorProps> = ({ onRun, isExecuting }) => {
  const [sql, setSql] = useState<string>("-- Write your SQL query here\nSELECT * FROM users LIMIT 10;");
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
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

