# Sales Management System

A full-stack web application for managing and analyzing retail sales data. It supports real-time search, multi-select filtering, sorting, and pagination. Data is stored in SQLite for efficient querying and performance. UI follows the required professional retail dashboard layout.

---

##  Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React + Axios |
| Backend | Node.js + Express.js |
| Database | SQLite (better-sqlite3) |
| Styling | CSS |
| Data Format | CSV imported into SQLite |

---

##  Search Implementation Summary

- Full-text search over:
  - Customer Name
  - Phone Number  
- Case-insensitive, substring match
- Search works alongside filters + sorting + pagination
- Query handled in database for performance

---

##  Filter Implementation Summary

- Multi-select / range-based filters for:
  - Customer Region
  - Gender
  - Product Category
  - Tags
  - Payment Method
  - Age Range
  - Date Range
- All filters work independently and in combination
- Maintains active state with search and sort options
- Filters update dashboard totals and paginated records

---

##  Sorting Implementation Summary

Sorting field options:
| Field | Order |
|-------|------|
| Date | Newest → Oldest (default) |
| Quantity | High → Low |
| Customer Name | A → Z |

Sorting preserves active filters, search, and pagination.

---

##  Pagination Implementation Summary

- Server-side pagination
- Default page size: 10 records per page
- Total pages calculated dynamically based on filtered results
- Pagination state preserved with search + filters + sorting

---

##  Setup Instructions

### 1️⃣ Backend Setup

```bash
cd backend
npm install
