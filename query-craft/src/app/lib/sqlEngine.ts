// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SQL: any = null;

export interface QueryResult {
    columns: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: any[][];
    rowsAffected?: number;
    executionTime: number;
}

export interface SchemaTable {
    name: string;
    columns: SchemaColumn[];
}

export interface SchemaColumn {
    name: string;
    type: string;
    notnull: boolean;
    pk: boolean;
}

// Initialize SQL.js
export async function initDatabase(): Promise<void> {
    if (SQL) return;

    try {
        // Dynamically import SQL.js for client-side only
        const initSqlJs = (await import('sql.js')).default;

        SQL = await initSqlJs({
            locateFile: () => `/sql-wasm.wasm`
        });

        db = new SQL.Database();

        // Load sample data
        await loadSampleData();
    } catch (error) {
        console.error('Failed to initialize SQL.js:', error);
        throw error;
    }
}

// Execute SQL query
export async function executeQuery(sql: string): Promise<QueryResult> {
    if (!db) {
        await initDatabase();
    }

    const startTime = performance.now();

    try {
        const trimmedSql = sql.trim();

        // Handle SELECT queries
        if (trimmedSql.toUpperCase().startsWith('SELECT')) {
            const results = db.exec(trimmedSql);
            const endTime = performance.now();

            if (results.length === 0) {
                return {
                    columns: [],
                    values: [],
                    executionTime: endTime - startTime
                };
            }

            return {
                columns: results[0].columns,
                values: results[0].values,
                executionTime: endTime - startTime
            };
        }

        // Handle INSERT, UPDATE, DELETE, CREATE, DROP, ALTER
        db.run(trimmedSql);
        const endTime = performance.now();

        return {
            columns: ['Status'],
            values: [['Query executed successfully']],
            rowsAffected: db.getRowsModified(),
            executionTime: endTime - startTime
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.message || 'Query execution failed');
    }
}

// Get database schema
export function getSchema(): SchemaTable[] {
    if (!db) return [];

    try {
        // Get all tables
        const tablesResult = db.exec(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

        if (tablesResult.length === 0) return [];

        const tables: SchemaTable[] = [];


        for (const row of tablesResult[0].values) {
            const tableName = row[0] as string;

            // Get columns for each table
            const columnsResult = db.exec(`PRAGMA table_info(${tableName})`);

            if (columnsResult.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const columns: SchemaColumn[] = columnsResult[0].values.map((col: any) => ({
                    name: col[1] as string,
                    type: col[2] as string,
                    notnull: col[3] === 1,
                    pk: col[5] === 1
                }));

                tables.push({
                    name: tableName,
                    columns
                });
            }
        }

        return tables;
    } catch (error) {
        console.error('Error getting schema:', error);
        return [];
    }
}

// Export database
export function exportDatabase(): Uint8Array | null {
    if (!db) return null;
    return db.export();
}

// Import database
export async function importDatabase(data: Uint8Array): Promise<void> {
    if (!SQL) {
        await initDatabase();
    }

    db = new SQL.Database(data);
}

// Clear database
export function clearDatabase(): void {
    if (!db) return;

    const tables = getSchema();
    tables.forEach(table => {
        try {
            db.run(`DROP TABLE IF EXISTS ${table.name}`);
        } catch (error) {
            console.error(`Error dropping table ${table.name}:`, error);
        }
    });
}

// Load sample data
async function loadSampleData(): Promise<void> {
    if (!db) return;

    const sampleSQL = `
    -- Create Users table
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create Categories table
    CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );
    
    -- Create Products table
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category_id INTEGER,
      stock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
    
    -- Create Orders table
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    -- Create Order Items table
    CREATE TABLE order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
    
    -- Insert sample users
    INSERT INTO users (username, email, full_name) VALUES
      ('john_doe', 'john@example.com', 'John Doe'),
      ('jane_smith', 'jane@example.com', 'Jane Smith'),
      ('bob_wilson', 'bob@example.com', 'Bob Wilson'),
      ('alice_brown', 'alice@example.com', 'Alice Brown'),
      ('charlie_davis', 'charlie@example.com', 'Charlie Davis');
    
    -- Insert sample categories
    INSERT INTO categories (name, description) VALUES
      ('Electronics', 'Electronic devices and gadgets'),
      ('Clothing', 'Apparel and fashion items'),
      ('Books', 'Physical and digital books'),
      ('Home & Garden', 'Home improvement and garden supplies'),
      ('Sports', 'Sports equipment and accessories');
    
    -- Insert sample products
    INSERT INTO products (name, description, price, category_id, stock) VALUES
      ('Laptop Pro 15', 'High-performance laptop', 1299.99, 1, 25),
      ('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 1, 150),
      ('USB-C Cable', 'Fast charging cable', 12.99, 1, 200),
      ('Cotton T-Shirt', 'Comfortable cotton t-shirt', 19.99, 2, 100),
      ('Denim Jeans', 'Classic blue jeans', 49.99, 2, 75),
      ('Programming Book', 'Learn advanced programming', 39.99, 3, 50),
      ('Fiction Novel', 'Bestselling fiction', 14.99, 3, 80),
      ('Garden Tools Set', 'Complete gardening kit', 89.99, 4, 30),
      ('LED Desk Lamp', 'Adjustable LED lamp', 34.99, 4, 60),
      ('Tennis Racket', 'Professional tennis racket', 129.99, 5, 20);
    
    -- Insert sample orders
    INSERT INTO orders (user_id, total_amount, status) VALUES
      (1, 1329.98, 'completed'),
      (2, 69.98, 'completed'),
      (3, 179.97, 'pending'),
      (4, 54.98, 'shipped'),
      (1, 89.99, 'completed');
    
    -- Insert sample order items
    INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
      (1, 1, 1, 1299.99),
      (1, 2, 1, 29.99),
      (2, 4, 2, 19.99),
      (2, 5, 1, 49.99),
      (3, 6, 1, 39.99),
      (3, 7, 2, 14.99),
      (3, 8, 1, 89.99),
      (4, 9, 1, 34.99),
      (4, 3, 1, 12.99),
      (5, 8, 1, 89.99);
  `;

    try {
        db.run(sampleSQL);
    } catch (error) {
        console.error('Error loading sample data:', error);
    }
}
