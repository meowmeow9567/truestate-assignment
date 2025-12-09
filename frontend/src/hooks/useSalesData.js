// frontend/src/hooks/useSalesData.js
import { useEffect, useState } from 'react';
import { fetchFilters, fetchSales } from '../services/api';

const DEFAULT_SORT = { sortBy: 'date', sortOrder: 'desc' };

export function useSalesData() {
    const [filters, setFilters] = useState({
        regions: [],
        genders: [],
        productCategories: [],
        tags: [],
        paymentMethods: []
    });

    const [filterValues, setFilterValues] = useState({
        search: '',
        selectedRegions: [],
        selectedGenders: [],
        selectedProductCategories: [],
        selectedTags: [],
        selectedPaymentMethods: [],
        ageMin: '',
        ageMax: '',
        dateFrom: '',
        dateTo: '',
        ageRangePreset: '',    // 👈 NEW
        datePreset: '',
        sortBy: DEFAULT_SORT.sortBy,
        sortOrder: DEFAULT_SORT.sortOrder,
        page: 1
    });

    const [data, setData] = useState({
        items: [],
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
        summary: { totalUnits: 0, totalAmount: 0, totalDiscount: 0 }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const opts = await fetchFilters();
                setFilters(opts);
            } catch (err) {
                console.error(err);
                setError('Failed to load filters');
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetchSales({
                    search: filterValues.search || undefined,
                    regions:
                        filterValues.selectedRegions.length > 0
                            ? filterValues.selectedRegions.join(',')
                            : undefined,
                    genders:
                        filterValues.selectedGenders.length > 0
                            ? filterValues.selectedGenders.join(',')
                            : undefined,
                    productCategories:
                        filterValues.selectedProductCategories.length > 0
                            ? filterValues.selectedProductCategories.join(',')
                            : undefined,
                    tags:
                        filterValues.selectedTags.length > 0
                            ? filterValues.selectedTags.join(',')
                            : undefined,
                    paymentMethods:
                        filterValues.selectedPaymentMethods.length > 0
                            ? filterValues.selectedPaymentMethods.join(',')
                            : undefined,
                    ageMin: filterValues.ageMin || undefined,
                    ageMax: filterValues.ageMax || undefined,
                    dateFrom: filterValues.dateFrom || undefined,
                    dateTo: filterValues.dateTo || undefined,
                    sortBy: filterValues.sortBy,
                    sortOrder: filterValues.sortOrder,
                    page: filterValues.page
                });

                setData({
                    items: response.data,
                    page: response.page,
                    pageSize: response.pageSize,
                    totalItems: response.totalItems,
                    totalPages: response.totalPages,
                    summary:
                        response.summary || { totalUnits: 0, totalAmount: 0, totalDiscount: 0 }
                });
            } catch (err) {
                console.error(err);
                setError('Failed to load sales data');
            } finally {
                setLoading(false);
            }
        })();
    }, [filterValues]);

    const updateFilterValues = updates => {
        setFilterValues(prev => ({
            ...prev,
            page: 1,
            ...updates
        }));
    };

    const goToPage = newPage => {
        setFilterValues(prev => ({
            ...prev,
            page: newPage
        }));
    };

    return {
        filters,
        filterValues,
        updateFilterValues,
        data,
        loading,
        error,
        goToPage
    };
}
