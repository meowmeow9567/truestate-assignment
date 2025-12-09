// frontend/src/App.jsx
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import FiltersPanel from './components/FiltersPanel';
import SortDropdown from './components/SortDropdown';
import SalesTable from './components/SalesTable';
import Pagination from './components/Pagination';
import Loader from './components/Loader';
import { useSalesData } from './hooks/useSalesData';

export default function App() {
    const {
        filters,
        filterValues,
        updateFilterValues,
        data,
        loading,
        error,
        goToPage
    } = useSalesData();

    const [servicesOpen, setServicesOpen] = useState(true);
    const [invoicesOpen, setInvoicesOpen] = useState(true);


    const { summary } = data;

    // Approx conversion: 1 SR ≈ ₹22 (you can tweak this)
    const INR_TO_SR = 1 / 22;

    const totalAmountInr = Number(summary.totalAmount || 0);
    const totalDiscountInr = Number(summary.totalDiscount || 0);

    const totalAmountSr = totalAmountInr * INR_TO_SR;
    const totalDiscountSr = totalDiscountInr * INR_TO_SR;


    return (
        <div className="app-container">
            {/* SHELL: left sidebar + right main app */}
            <div className="app-shell">
                {/* LEFT NAVIGATION (exact layout like screenshot) */}
                <aside className="side-nav">
                    {/* Top white card: Vault + name + caret */}
                    <div className="side-card side-card-top">
                        <div className="side-top-row">
                            <div className="side-top-left">
                                <div className="side-logo">V</div>
                                <div className="side-vault-text">
                                    <div className="side-vault-title">Vault</div>
                                    <div className="side-vault-user">Anurag Yadav</div>
                                </div>
                            </div>
                            <span className="side-caret">⌄</span>
                        </div>
                    </div>

                    {/* Primary links: Dashboard, Nexus, Intake (no white card) */}
                    <nav className="side-primary-nav">
                        <button className="side-link">
                            <span className="side-link-icon">🏠</span>
                            <span>Dashboard</span>
                        </button>
                        <button className="side-link">
                            <span className="side-link-icon">👥</span>
                            <span>Nexus</span>
                        </button>
                        <button className="side-link">
                            <span className="side-link-icon">▶</span>
                            <span>Intake</span>
                        </button>
                    </nav>

                    {/* Services white card (collapsible) */}
                    <div className="side-card">
                        <button
                            type="button"
                            className="side-card-header"
                            onClick={() => setServicesOpen(open => !open)}
                        >
                            <span className="side-card-icon">📂</span>
                            <span className="side-card-title">Services</span>
                            <span className={`side-caret ${servicesOpen ? 'open' : ''}`}>⌄</span>
                        </button>

                        {servicesOpen && (
                            <div className="side-card-list">
                                <button className="side-card-item">
                                    <span className="side-link-icon">⏺</span>
                                    <span>Pre-active</span>
                                </button>
                                <button className="side-card-item">
                                    <span className="side-link-icon">▢</span>
                                    <span>Active</span>
                                </button>
                                <button className="side-card-item">
                                    <span className="side-link-icon">✕</span>
                                    <span>Blocked</span>
                                </button>
                                <button className="side-card-item">
                                    <span className="side-link-icon">✔</span>
                                    <span>Closed</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Invoices white card (collapsible) */}
                    <div className="side-card">
                        <button
                            type="button"
                            className="side-card-header"
                            onClick={() => setInvoicesOpen(open => !open)}
                        >
                            <span className="side-card-icon">🧾</span>
                            <span className="side-card-title">Invoices</span>
                            <span className={`side-caret ${invoicesOpen ? 'open' : ''}`}>⌄</span>
                        </button>

                        {invoicesOpen && (
                            <div className="side-card-list">
                                <button className="side-card-item side-card-item-active">
                                    <span className="side-link-icon">📄</span>
                                    <span>Proforma Invoices</span>
                                </button>
                                <button className="side-card-item">
                                    <span className="side-link-icon">📄</span>
                                    <span>Final Invoices</span>
                                </button>
                            </div>
                        )}
                    </div>

                </aside>


                {/* RIGHT MAIN AREA */}
                <div className="app-main">
                    {/* HEADER: title left, search right */}
                    <header className="app-header">
                        <div className="header-left">
                            <h1>Sales Management System</h1>
                            {/* <p className="subtitle">
                                Retail transactions with search, filters, sorting &amp; pagination
                            </p> */}
                        </div>
                        <div className="header-right">
                            <SearchBar
                                value={filterValues.search}
                                onChange={val => updateFilterValues({ search: val })}
                            />
                        </div>
                    </header>

                    {/* WHITE CONTENT AREA: filters + sort + summary + table */}
                    <main className="main-content">
                        {/* TOOLBAR: filters on left, sort on right */}
                        <div className="toolbar">
                            <div className="toolbar-left">
                                <FiltersPanel
                                    filters={filters}
                                    values={filterValues}
                                    onChange={updateFilterValues}
                                />
                            </div>
                            <div className="toolbar-right">
                                <SortDropdown
                                    sortBy={filterValues.sortBy}
                                    onChange={sortBy =>
                                        updateFilterValues({
                                            sortBy,
                                            // enforce spec: date & quantity = desc, name = asc
                                            sortOrder: sortBy === 'customerName' ? 'asc' : 'desc'
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Summary cards (top stats) */}
                        <div className="summary-row">
                            {/* Total units sold – no SRs */}
                            <div className="summary-card">
                                <div className="summary-header">
                                    <span className="summary-title">Total units sold</span>
                                    <span className="summary-icon">!</span>
                                </div>
                                <div className="summary-main">
                                    {summary.totalUnits}
                                </div>
                            </div>

                            {/* Total Amount – INR + SRs (no NaN) */}
                            <div className="summary-card">
                                <div className="summary-header">
                                    <span className="summary-title">Total Amount</span>
                                    <span className="summary-icon">!</span>
                                </div>
                                <div className="summary-main">
                                    ₹{Math.abs(totalAmountInr).toLocaleString('en-IN')}
                                    <span className="summary-main-srs">
                                        ({Math.abs(Math.round(totalAmountSr)).toLocaleString('en-IN')} SRs)
                                    </span>
                                </div>
                            </div>

                            {/* Total Discount – INR + SRs, no minus sign */}
                            <div className="summary-card">
                                <div className="summary-header">
                                    <span className="summary-title">Total Discount</span>
                                    <span className="summary-icon">!</span>
                                </div>
                                <div className="summary-main">
                                    ₹{Math.abs(totalDiscountInr).toLocaleString('en-IN')}
                                    <span className="summary-main-srs">
                                        ({Math.abs(Math.round(totalDiscountSr)).toLocaleString('en-IN')} SRs)
                                    </span>
                                </div>
                            </div>
                        </div>




                        {error && <div className="error-banner">{error}</div>}

                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                <SalesTable items={data.items} />
                                <Pagination
                                    page={data.page}
                                    totalPages={data.totalPages}
                                    onPageChange={goToPage}
                                />
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
