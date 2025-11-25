/**
 * Query Tabs Component
 * 
 * Manages multiple query tabs allowing users to work on different SQL queries simultaneously.
 * Provides tab switching, adding new tabs, and closing tabs functionality.
 * 
 * @component
 */

"use client";

import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

/**
 * Represents a query tab
 */
interface Tab {
  /** Unique tab identifier */
  id: number;
  /** Display name of the tab */
  name: string;
}

/**
 * Props for the QueryTabs component
 */
interface QueryTabsProps {
  /** Array of all tabs */
  tabs: Tab[];
  /** ID of the currently active tab */
  activeTab: number;
  /** Callback when a tab is selected */
  onSelectTab: (id: number) => void;
  /** Callback to add a new tab */
  onAddTab: () => void;
  /** Callback to close a tab */
  onCloseTab: (id: number) => void;
}

/**
 * Query Tabs Component
 * 
 * Renders a tab bar with:
 * - Individual tabs with active state highlighting
 * - Close buttons (prevents closing last tab)
 * - Add button to create new tabs
 * - Smooth animations for tab switching
 * 
 * @param props - Component props
 * @returns Rendered tab bar
 */
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

