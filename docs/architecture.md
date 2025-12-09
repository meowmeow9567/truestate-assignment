# System Architecture

---

## 🔹 Backend Architecture

**Framework:** Node.js + Express  
**Database:** SQLite (better-sqlite3)  
**Data Source:** CSV imported into DB

Backend Responsibilities:
- Load CSV into SQLite
- Apply filters, search, sorting via SQL queries
- Calculate summary statistics
- Provide paginated API responses

Key Endpoints:
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | Search + Filters + Sorting + Pagination |
| GET | `/api/sales/filters` | Returns all available filter options |

---

## 🔹 Frontend Architecture

**Framework:** React  
**Data Fetching:** Axios  
**State Management:** Custom hooks (`useSalesData`)

Major Components:
| Component | Responsibility |
|----------|----------------|
| SearchBar | Full text search |
| FiltersPanel | Multi-select + range filters |
| SortDropdown | Sorting control |
| SalesTable | Display paginated rows |
| Pagination | Navigation through pages |
| Summary Cards | Units sold, total amount & discount |

---

## 🔹 Data Flow

```mermaid
flowchart LR
A[CSV File] --> B[SQLite Import Script]
B --> C[Sales Table]
C -->|SQL Query| D[Express API]
D -->|JSON| E[React Frontend]
E -->|User Actions| D




# 📂 Folder Structure

Sales-Management-System/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── salesController.js
│   │   ├── db/
│   │   │   └── sqlite.js
│   │   ├── models/
│   │   │   └── saleModel.js   (optional - validation)
│   │   ├── routes/
│   │   │   └── salesRoutes.js
│   │   ├── services/
│   │   │   └── salesService.js
│   │   ├── utils/
│   │   │   ├── queryParser.js
│   │   │   └── dataLoader.js  (if fallback local source used)
│   │   ├── scripts/
│   │   │   └── importSales.js
│   │   └── index.js
│   │
│   ├── data/
│   │   └── Retail_Sales_Dataset.csv
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FiltersPanel.jsx
│   │   │   ├── SalesTable.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SortDropdown.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── hooks/
│   │   │   └── useSalesData.js
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── public/
│   └── package.json
│
├── docs/
│   └── architecture.md
│
└── README.md





# 🧩 Module Responsibilities

| Module | Layer | Responsibility |
|--------|-------|----------------|
| **db.js** | Backend DB Config | Establishes connection to SQLite database |
| **sqlite.js** | Backend DB Helper | Executes DB queries (select, pagination, filtering) |
| **importSales.js** | Backend Script | Imports CSV file into SQLite DB |
| **salesRoutes.js** | Backend Routing | Defines API routes `/api/sales` & `/api/sales/filters` |
| **salesController.js** | Backend Controller | Maps API request → service → response |
| **salesService.js** | Backend Business Logic | Handles search, filtering, sorting, pagination, summary calculations |
| **queryParser.js** | Backend Utility | Parses and validates incoming query parameters |
| **dataLoader.js** | Backend Utility (optional) | Fallback loader if no DB present |
| **useSalesData.js** | Frontend Hook | Connects frontend filters & table to API |
| **FiltersPanel.jsx** | Frontend UI | Multi-select filter controls |
| **SearchBar.jsx** | Frontend UI | Search input for Customer Name & Phone |
| **SortDropdown.jsx** | Frontend UI | Sorting options: Date, Quantity, Name |
| **SalesTable.jsx** | Frontend UI | Displays paginated filtered results |
| **Pagination.jsx** | Frontend UI | Handles page navigation |
| **Loader.jsx** | Frontend UI | Shows loading animation |
| **Sidebar.jsx** | Frontend UI | Displays navigation menu as per required design |
| **App.jsx** | Frontend Root | Combines UI and data logic |

---

