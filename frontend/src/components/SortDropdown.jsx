// frontend/src/components/SortDropdown.jsx
export default function SortDropdown({ sortBy, onChange }) {
  const handleSortByChange = e => {
    onChange(e.target.value);
  };

  return (
    <div className="sort-dropdown sort-dropdown-right">
      <label>
        Sort by:{' '}
        <select value={sortBy} onChange={handleSortByChange}>
          <option value="date">Date (Newest First)</option>
          <option value="quantity">Quantity</option>
          <option value="customerName">Customer Name (A–Z)</option>
        </select>
      </label>
    </div>
  );
}
