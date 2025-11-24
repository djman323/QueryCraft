import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Search } from 'lucide-react';

interface QueryItem {
  id: string;
  name: string;
  sql: string;
  description: string;
}

interface QueryCategory {
  id: string;
  name: string;
  queries: QueryItem[];
}

const QUERY_LIBRARY: QueryCategory[] = [
  {
    id: 'basics',
    name: 'Basic Queries',
    queries: [
      {
        id: 'select_all',
        name: 'Select All',
        sql: 'SELECT * FROM users;',
        description: 'Get all columns from users table'
      },
      {
        id: 'select_columns',
        name: 'Select Columns',
        sql: 'SELECT username, email FROM users;',
        description: 'Get specific columns'
      },
      {
        id: 'where_clause',
        name: 'Filter Rows (WHERE)',
        sql: "SELECT * FROM products WHERE price > 50;",
        description: 'Filter results based on a condition'
      },
      {
        id: 'order_by',
        name: 'Sort Results',
        sql: "SELECT * FROM products ORDER BY price DESC;",
        description: 'Sort data by a column'
      },
      {
        id: 'limit',
        name: 'Limit Results',
        sql: "SELECT * FROM users LIMIT 5;",
        description: 'Restrict number of rows returned'
      }
    ]
  },
  {
    id: 'aggregation',
    name: 'Aggregation',
    queries: [
      {
        id: 'count',
        name: 'Count Rows',
        sql: 'SELECT COUNT(*) FROM orders;',
        description: 'Count total number of records'
      },
      {
        id: 'sum',
        name: 'Sum Values',
        sql: 'SELECT SUM(total_amount) FROM orders;',
        description: 'Calculate sum of a column'
      },
      {
        id: 'avg',
        name: 'Average Value',
        sql: 'SELECT AVG(price) FROM products;',
        description: 'Calculate average of a column'
      },
      {
        id: 'group_by',
        name: 'Group By',
        sql: "SELECT category_id, COUNT(*) FROM products GROUP BY category_id;",
        description: 'Group rows and aggregate'
      }
    ]
  },
  {
    id: 'joins',
    name: 'Joins',
    queries: [
      {
        id: 'inner_join',
        name: 'Inner Join',
        sql: `SELECT orders.id, users.username, orders.total_amount 
FROM orders 
INNER JOIN users ON orders.user_id = users.id;`,
        description: 'Combine rows from two tables'
      },
      {
        id: 'left_join',
        name: 'Left Join',
        sql: `SELECT users.username, orders.id 
FROM users 
LEFT JOIN orders ON users.id = orders.user_id;`,
        description: 'All rows from left table, matching from right'
      }
    ]
  },
  {
    id: 'manipulation',
    name: 'Data Manipulation',
    queries: [
      {
        id: 'insert',
        name: 'Insert Row',
        sql: `INSERT INTO users (username, email, full_name) 
VALUES ('new_user', 'new@example.com', 'New User');`,
        description: 'Add a new record'
      },
      {
        id: 'update',
        name: 'Update Row',
        sql: "UPDATE products SET price = price * 1.1 WHERE category_id = 1;",
        description: 'Modify existing records'
      },
      {
        id: 'delete',
        name: 'Delete Row',
        sql: "DELETE FROM orders WHERE status = 'cancelled';",
        description: 'Remove records'
      }
    ]
  }
];

export default function QueryLibrarySidebar() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['basics', 'aggregation', 'joins', 'manipulation']));
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDragStart = (e: React.DragEvent, sql: string) => {
    e.dataTransfer.setData('text/plain', sql);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const filteredCategories = QUERY_LIBRARY.map(category => ({
    ...category,
    queries: category.queries.filter(q => 
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      q.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.queries.length > 0);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-secondary)",
        borderLeft: "1px solid var(--border-primary)",
        width: "280px",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}
        >
          Query Library
        </h2>
        <div style={{ position: "relative" }}>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-primary)",
              borderRadius: "6px",
              fontSize: "0.875rem",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {filteredCategories.map((category) => (
          <div key={category.id} style={{ marginBottom: "8px" }}>
            <button
              onClick={() => toggleCategory(category.id)}
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
              <span>{category.name}</span>
              {expandedCategories.has(category.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {expandedCategories.has(category.id) && (
              <div style={{ marginTop: "4px", paddingLeft: "8px" }}>
                {category.queries.map((query) => (
                  <div
                    key={query.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, query.sql)}
                    className="group"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      padding: "8px",
                      borderRadius: "6px",
                      cursor: "grab",
                      border: "1px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-tertiary)";
                      e.currentTarget.style.borderColor = "var(--border-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <GripVertical
                      className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "var(--text-muted)" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {query.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {query.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "16px",
          borderTop: "1px solid var(--border-primary)",
          background: "var(--bg-tertiary)",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          Drag and drop queries into the editor
        </p>
      </div>
    </div>
  );
}
