"use client";

import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

interface Tab {
  id: number;
  name: string;
}

interface QueryTabsProps {
  tabs: Tab[];
  activeTab: number;
  onSelectTab: (id: number) => void;
  onAddTab: () => void;
  onCloseTab: (id: number) => void;
}

export default function QueryTabs({
  tabs,
  activeTab,
  onSelectTab,
  onAddTab,
  onCloseTab,
}: QueryTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid var(--border-primary)",
      }}
    >
      {tabs.map((tab) => (
        <motion.div
          key={tab.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            borderRadius: "6px",
            background: tab.id === activeTab
              ? "var(--accent-primary)"
              : "var(--bg-tertiary)",
            color: tab.id === activeTab
              ? "white"
              : "var(--text-secondary)",
            fontSize: "0.875rem",
            fontWeight: tab.id === activeTab ? 500 : 400,
            cursor: "pointer",
            border: "1px solid",
            borderColor: tab.id === activeTab
              ? "var(--accent-primary)"
              : "var(--border-primary)",
          }}
          onClick={() => onSelectTab(tab.id)}
        >
          <span>{tab.name}</span>
          {tabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2px",
                background: "transparent",
                borderRadius: "3px",
                opacity: 0.7,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.7";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <X size={14} />
            </button>
          )}
        </motion.div>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddTab}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          background: "var(--bg-tertiary)",
          border: "1px solid var(--border-primary)",
          color: "var(--text-secondary)",
        }}
      >
        <Plus size={16} />
      </motion.button>
    </div>
  );
}

