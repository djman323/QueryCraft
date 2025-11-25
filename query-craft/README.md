# QueryCraft 🚀

A modern, feature-rich SQL editor that runs entirely in your browser with powerful visualization and query building capabilities.

![QueryCraft](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![SQL.js](https://img.shields.io/badge/SQL.js-1.13-orange?style=for-the-badge)

## ✨ Features

### 🎯 Core Functionality
- **In-Browser SQL Execution**: Powered by SQL.js (SQLite compiled to WebAssembly)
- **Monaco Editor Integration**: Professional code editing experience with syntax highlighting, autocomplete, and keyboard shortcuts
- **Real-time Schema Visualization**: Interactive database schema browser with table and column information
- **Multi-Tab Editor**: Work on multiple queries simultaneously with tabbed interface

### 📊 Advanced Features
- **Interactive Table Relationship Graph**: Drag-and-drop ER diagram showing table connections and foreign key relationships
- **Dynamic Chart Generation**: Create pie, bar, and line charts from query results
- **Visual Query Builder**: Build queries visually by selecting tables and columns
- **Query Library**: Pre-built query templates for common SQL operations
- **Query Execution Metrics**: Real-time execution time tracking

### 🎨 User Experience
- **Modern Dark Theme**: Beautiful gradient-based UI with glassmorphism effects
- **Smooth Animations**: Powered by Framer Motion for fluid interactions
- **Responsive Design**: Works seamlessly across desktop and tablet devices
- **Drag & Drop Support**: Drop queries directly into the editor

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/djman323/QueryCraft.git
cd QueryCraft/query-craft
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Writing and Executing Queries

1. **Write SQL**: Type your SQL query in the Monaco editor
2. **Execute**: Click "Run Query" or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)
3. **View Results**: See query results in the grid below the editor

### Exploring the Schema

- Browse tables and columns in the **Schema Sidebar** (left panel, top)
- Click on tables to expand and view column details
- Primary keys and foreign keys are clearly marked

### Visualizing Table Relationships

1. Click the **"Show Connections"** button in the header
2. Drag tables around to arrange your ER diagram
3. Connection arrows automatically show foreign key relationships

### Creating Charts

1. Open the **Features Sidebar** (left panel, bottom)
2. Navigate to the **Chart Generator** section
3. Select a table and column
4. Choose your chart type (Pie, Bar, or Line)
5. Click "Generate Chart" to visualize data distribution

### Using Query Templates

1. Open the **Query Library Sidebar** (right panel)
2. Browse through categorized query templates
3. Click on any query to see the code
4. Drag the query into the editor to use it

### Managing Multiple Queries

- Click the **+** icon in the tab bar to open a new query tab
- Switch between tabs to work on different queries
- Close tabs with the **×** button (minimum one tab required)

## 🏗️ Technology Stack

- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.6](https://www.typescriptlang.org/)
- **UI Library**: [React 19.1](https://react.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + Custom CSS Variables
- **Animations**: [Framer Motion 12.23](https://www.framer.com/motion/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (VS Code's editor)
- **Database Engine**: [SQL.js 1.13](https://sql.js.org/) (SQLite in WebAssembly)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
query-craft/
├── src/
│   ├── app/
│   │   ├── components/          # React components
│   │   │   ├── Editor.tsx       # SQL editor with Monaco
│   │   │   ├── ResultsGrid.tsx  # Query results display
│   │   │   ├── SchemaSidebar.tsx       # Database schema browser
│   │   │   ├── FeaturesSidebar.tsx     # Visual query builder & charts
│   │   │   ├── QueryLibrarySidebar.tsx # Query templates
│   │   │   ├── DraggableTableConnectionGraph.tsx  # ER diagram
│   │   │   ├── ChartsView.tsx          # Chart visualization
│   │   │   ├── TableChartSelector.tsx  # Chart configuration
│   │   │   └── QueryTabs.tsx           # Tab management
│   │   ├── lib/
│   │   │   └── sqlEngine.ts     # SQL.js wrapper & database logic
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript type definitions
│   │   ├── globals.css          # Global styles and CSS variables
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Main application page
│   └── types/                   # Additional type definitions
├── public/
│   └── sql-wasm.wasm           # SQLite WebAssembly binary
├── ARCHITECTURE.md             # Architecture documentation
├── CONTRIBUTING.md             # Contribution guidelines
└── README.md                   # This file
```

## 🎯 Sample Data

QueryCraft comes with a pre-loaded sample database containing:

- **users** - User accounts (5 records)
- **categories** - Product categories (5 records)
- **products** - Product catalog (10 records)
- **orders** - Customer orders (5 records)
- **order_items** - Order line items (10 records)

This sample data demonstrates:
- Primary and foreign key relationships
- One-to-many relationships
- Many-to-many relationships through junction tables
- Common e-commerce database patterns

Try queries like:
```sql
-- Get all orders with user details
SELECT o.id, u.full_name, o.total_amount, o.status
FROM orders o
JOIN users u ON o.user_id = u.id;

-- Product sales analysis
SELECT p.name, SUM(oi.quantity) as total_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.name
ORDER BY total_sold DESC;
```

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/djman323/QueryCraft)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

### Other Platforms

QueryCraft can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted with Node.js

**Important**: Ensure the `sql-wasm.wasm` file in the `public/` directory is properly served as a static asset.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

## 👨‍💻 Author

**Devansh Jani**

## 🙏 Acknowledgments

- [SQL.js](https://sql.js.org/) - SQLite compiled to JavaScript
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor from VS Code
- [Next.js](https://nextjs.org/) - React framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 🐛 Known Issues & Future Enhancements

### Known Issues
- Charts may not display properly for very large datasets
- Draggable graph performance may degrade with 10+ tables

### Planned Features
- [ ] Export query results to CSV/JSON
- [ ] Save and load database files
- [ ] Query history
- [ ] Dark/Light theme toggle
- [ ] Advanced join builder
- [ ] SQL formatting and beautification
- [ ] Query performance analysis

---

**Made with ❤️ by Devansh Jani**
