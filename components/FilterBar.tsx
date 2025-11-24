import React, { useState } from 'react';
import { TFunction, FilterState } from '../types';
import { SearchIcon } from './icons/SearchIcon';

interface FilterBarProps {
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  t: TFunction;
}

export const initialFilterState: FilterState = {
    location: '',
    bedrooms: '0',
    minPrice: '',
    maxPrice: '',
    minSize: '',
    maxSize: '',
};

const FilterInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);

export const FilterBar: React.FC<FilterBarProps> = ({ onApply, onReset, t }) => {
    const [filters, setFilters] = useState<FilterState>(initialFilterState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        onApply(filters);
    };

    const handleReset = () => {
        setFilters(initialFilterState);
        onReset();
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                
                <div className="sm:col-span-2 lg:col-span-4">
                    <FilterInput label={t('location')}>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={handleChange}
                                placeholder={t('search_by_location')}
                                className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                    </FilterInput>
                </div>

                <div className="lg:col-span-2">
                    <FilterInput label={t('bedrooms')}>
                         <select
                            name="bedrooms"
                            value={filters.bedrooms}
                            onChange={handleChange}
                            className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-brand-primary focus:border-brand-primary"
                        >
                            <option value="0">{t('any')}</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                        </select>
                    </FilterInput>
                </div>
                
                <div className="lg:col-span-2">
                    <FilterInput label={t('price_range')}>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleChange}
                                placeholder={t('min_price')}
                                className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-brand-primary focus:border-brand-primary"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleChange}
                                placeholder={t('max_price')}
                                className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                    </FilterInput>
                </div>

                <div className="lg:col-span-2">
                    <FilterInput label={t('size_range')}>
                       <div className="flex space-x-2 rtl:space-x-reverse">
                            <input
                                type="number"
                                name="minSize"
                                value={filters.minSize}
                                onChange={handleChange}
                                placeholder={t('min_size')}
                                className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-brand-primary focus:border-brand-primary"
                            />
                             <input
                                type="number"
                                name="maxSize"
                                value={filters.maxSize}
                                onChange={handleChange}
                                placeholder={t('max_size')}
                                className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                    </FilterInput>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 flex space-x-2 rtl:space-x-reverse">
                    <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-brand-dark transition-colors">
                        {t('apply_filters')}
                    </button>
                    <button type="button" onClick={handleReset} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                        {t('reset_filters')}
                    </button>
                </div>

            </form>
        </div>
    );
};