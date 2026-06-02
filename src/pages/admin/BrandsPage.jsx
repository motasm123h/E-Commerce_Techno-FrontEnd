import { useState } from 'react';
import { useBrands } from '../../hooks/useBrands';
import { useSections } from '../../hooks/useSections';

export default function BrandsPage() {
    const {
        brands,
        loading: brandsLoading,
        error: brandsError,
        addBrand,
        updateBrand,
        removeBrand
    } = useBrands();

    const {
        sections,
        loading: sectionsLoading,
        error: sectionsError
    } = useSections();

    const [editingId, setEditingId] = useState(null);

    const [nameEn, setNameEn] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [sectionId, setSectionId] = useState('');

    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEdit = (brand) => {
        setEditingId(brand.id);

        setNameEn(brand.name?.en || '');
        setNameAr(brand.name?.ar || '');
        setSectionId(String(brand.section_id || ''));

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setNameEn('');
        setNameAr('');
        setSectionId('');
        setFormError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormError(null);
        setIsSubmitting(true);

        if (!sectionId) {
            setFormError('Please select a target section.');
            setIsSubmitting(false);
            return;
        }

        const payload = {
            name: {
                en: nameEn.trim(),
                ar: nameAr.trim()
            },
            section_id: parseInt(sectionId)
        };

        let result;

        if (editingId) {
            result = await updateBrand(editingId, payload);
        } else {
            result = await addBrand(payload);
        }

        if (result.success) {
            resetForm();
        } else {
            setFormError(result.error);
        }

        setIsSubmitting(false);
    };

    if (brandsLoading || sectionsLoading) {
        return (
            <div className="p-6 text-gray-600">
                Loading brands...
            </div>
        );
    }

    if (brandsError || sectionsError) {
        return (
            <div className="p-6 text-red-600">
                {brandsError || sectionsError}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Manage Brands
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-medium mb-4 text-gray-800">
                    {editingId ? 'Edit Brand' : 'Add New Brand'}
                </h2>

                {formError && (
                    <p className="text-sm text-red-600 mb-3">
                        {formError}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand Name (English)
                            </label>

                            <input
                                type="text"
                                value={nameEn}
                                onChange={(e) =>
                                    setNameEn(e.target.value)
                                }
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand Name (Arabic)
                            </label>

                            <input
                                type="text"
                                value={nameAr}
                                onChange={(e) =>
                                    setNameAr(e.target.value)
                                }
                                required
                                dir="rtl"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Section
                            </label>

                            <select
                                value={sectionId}
                                onChange={(e) =>
                                    setSectionId(e.target.value)
                                }
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">
                                    Select Section
                                </option>

                                {sections.map((sec) => (
                                    <option
                                        key={sec.id}
                                        value={sec.id}
                                    >
                                        {sec.name?.en ||
                                            sec.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-gray-300 rounded-md"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting
                                ? 'Saving...'
                                : editingId
                                ? 'Update Brand'
                                : 'Add Brand'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                ID
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Brand
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Section
                            </th>

                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {brands.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    No brands found.
                                </td>
                            </tr>
                        ) : (
                            brands.map((brand) => (
                                <tr key={brand.id}>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {brand.id}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {brand.name?.en}

                                        <span className="mx-2 text-gray-300">
                                            |
                                        </span>

                                        <span dir="rtl">
                                            {brand.name?.ar}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {brand.section?.name?.en ||
                                            '—'}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm">
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        brand
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    removeBrand(
                                                        brand.id
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}