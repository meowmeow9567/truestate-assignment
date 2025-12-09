// frontend/src/components/FiltersPanel.jsx
export default function FiltersPanel({ filters, values, onChange }) {
  // ----- helpers -----

  const handleReset = () => {
    onChange({
      selectedRegions: [],
      selectedGenders: [],
      selectedProductCategories: [],
      selectedTags: [],
      selectedPaymentMethods: [],
      ageMin: '',
      ageMax: '',
      dateFrom: '',
      dateTo: '',
      ageRangePreset: '',
      datePreset: ''
    });
  };

  const handleSingleSelect = (key, value) => {
    onChange({
      [key]: value ? [value] : []
    });
  };

  // AGE RANGE dropdown options
  const ageOptions = [
    { value: '', label: 'Age Range' },
    { value: '18-24', label: '18 – 24' },
    { value: '25-34', label: '25 – 34' },
    { value: '35-44', label: '35 – 44' },
    { value: '45-54', label: '45 – 54' },
    { value: '55+', label: '55+' }
  ];

  const applyAgePreset = preset => {
    let ageMin = '';
    let ageMax = '';

    switch (preset) {
      case '18-24':
        ageMin = 18;
        ageMax = 24;
        break;
      case '25-34':
        ageMin = 25;
        ageMax = 34;
        break;
      case '35-44':
        ageMin = 35;
        ageMax = 44;
        break;
      case '45-54':
        ageMin = 45;
        ageMax = 54;
        break;
      case '55+':
        ageMin = 55;
        ageMax = '';
        break;
      default:
        ageMin = '';
        ageMax = '';
    }

    onChange({
      ageRangePreset: preset,
      ageMin: ageMin === '' ? '' : String(ageMin),
      ageMax: ageMax === '' ? '' : String(ageMax)
    });
  };

  // DATE RANGE dropdown – using year-based ranges to match dataset
  const dateOptions = [
    { value: '', label: 'Date Range' },
    { value: '2021', label: 'Year 2021' },
    { value: '2022', label: 'Year 2022' },
    { value: '2023', label: 'Year 2023' }
  ];

  const applyDatePreset = preset => {
    let dateFrom = '';
    let dateTo = '';

    switch (preset) {
      case '2021':
        dateFrom = '2021-01-01';
        dateTo = '2021-12-31';
        break;
      case '2022':
        dateFrom = '2022-01-01';
        dateTo = '2022-12-31';
        break;
      case '2023':
        dateFrom = '2023-01-01';
        dateTo = '2023-12-31';
        break;
      default:
        dateFrom = '';
        dateTo = '';
    }

    onChange({
      datePreset: preset,
      dateFrom,
      dateTo
    });
  };

  return (
    <div className="filters-row">
      {/* Refresh button */}
      <button
        type="button"
        className="filter-refresh-btn"
        onClick={handleReset}
        title="Reset filters"
      >
        ↻
      </button>

      {/* Customer Region */}
      <div className="filter-pill">
        <select
          value={values.selectedRegions[0] || ''}
          onChange={e => handleSingleSelect('selectedRegions', e.target.value)}
        >
          <option value="">Customer Region</option>
          {(filters.regions || []).map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Gender */}
      <div className="filter-pill">
        <select
          value={values.selectedGenders[0] || ''}
          onChange={e => handleSingleSelect('selectedGenders', e.target.value)}
        >
          <option value="">Gender</option>
          {(filters.genders || []).map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Age Range DROPDOWN */}
      <div className="filter-pill">
        <select
          value={values.ageRangePreset || ''}
          onChange={e => applyAgePreset(e.target.value)}
        >
          {ageOptions.map(opt => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Product Category */}
      <div className="filter-pill">
        <select
          value={values.selectedProductCategories[0] || ''}
          onChange={e =>
            handleSingleSelect('selectedProductCategories', e.target.value)
          }
        >
          <option value="">Product Category</option>
          {(filters.productCategories || []).map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="filter-pill">
        <select
          value={values.selectedTags[0] || ''}
          onChange={e => handleSingleSelect('selectedTags', e.target.value)}
        >
          <option value="">Tags</option>
          {(filters.tags || []).map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Method */}
      <div className="filter-pill">
        <select
          value={values.selectedPaymentMethods[0] || ''}
          onChange={e =>
            handleSingleSelect('selectedPaymentMethods', e.target.value)
          }
        >
          <option value="">Payment Method</option>
          {(filters.paymentMethods || []).map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range DROPDOWN */}
      <div className="filter-pill">
        <select
          value={values.datePreset || ''}
          onChange={e => applyDatePreset(e.target.value)}
        >
          {dateOptions.map(opt => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
