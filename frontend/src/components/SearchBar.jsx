// frontend/src/components/SearchBar.jsx
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <div className="search-label">Search</div>
      <input
        type="text"
        placeholder="Customer Name or Phone Number"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
