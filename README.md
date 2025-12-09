# Retail Sales Management System – TruEstate Assignment

## 1. Overview (3–5 lines)
This project implements a Retail Sales Management System with full-stack functionality.  
It supports search, multi-select filters, sorting, and server-side pagination over the provided sales dataset.  
The backend loads the dataset from Google Drive and exposes REST APIs, while the frontend provides a clean, structured UI for interacting with the data.

## 2. Tech Stack
- Backend: Node.js, Express, csv-parse
- Frontend: React, Vite, Axios
- Other: JavaScript (ES6+), CSS

## 3. Search Implementation Summary
Search is implemented on the backend in `salesService.js`, applied on `customerName` and `phoneNumber` fields.  
It is case-insensitive and is combined with all other active filters and sorting.  
Frontend sends `search` as a query parameter; the backend filters in-memory data and returns the filtered result set.

## 4. Filter Implementation Summary
Filters are implemented as multi-select or range-based for customer region, gender, age, product category, tags, payment method, and date range.  
`/api/sales/filters` returns distinct values for dropdowns.  
All filter logic resides in `salesService.js` and works in combination, preserving state alongside search and sorting.

## 5. Sorting Implementation Summary
Sorting is supported for date (newest first), quantity, and customer name (A–Z).  
The backend sorts the filtered data based on `sortBy` and `sortOrder` query params before paginating.  
Sorting always respects active search and filter states; no sorting is done on the frontend.

## 6. Pagination Implementation Summary
Pagination is server-side with a fixed page size of 10 items.  
The backend calculates `totalItems`, `totalPages`, and returns the requested page along with metadata.  
The frontend renders "Previous / Next" controls and page info, preserving all active search, filter, and sort states when changing pages.

## 7. Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
# truestate-assignment




> Note: The original dataset file `backend/data/Retail_Sales_Dataset.csv` and the generated SQLite DB are not committed to Git due to GitHub's 100MB file size limit.  
> To run locally, place the CSV under `backend/data/` and execute the import script:
> `node src/scripts/importSales.js`.
