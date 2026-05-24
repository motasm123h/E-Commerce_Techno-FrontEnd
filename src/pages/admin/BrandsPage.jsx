import { useState } from 'react';
import { useBrands } from '../../hooks/useBrands';
import { useSections } from '../../hooks/useSections';

export default function BrandsPage() {
    const { brands, loading: brandsLoading, error: brandsError, addBrand, removeBrand } = useBrands();
    const { sections, loading: sectionsLoading, error: sectionsError } = useSections();
    
    // Controlled form state (Rule #10)
    const [name, setName] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        if (!sectionId) {
            setFormError('Please select a target operations section.');
            setIsSubmitting(false);
            return;
        }

        // Construct payload matching Laravel relationship field expectations
        const payload = { 
            name, 
            section_id: parseInt(sectionId) 
        };

        const result = await addBrand(payload);
        
        if (result.success) {
            setName('');
            setSectionId(''); // Reset form inputs
        } else {
            setFormError(result.error);
        }

        setIsSubmitting(false);
    };

    // Rule #11: Comprehensive Error handling
    if (brandsLoading || sectionsLoading) return <div className="p-6 text-gray-600">Loading manufacturer registries...</div>;
    if (brandsError || sectionsError) return <div className="p-6 text-red-600">{brandsError || sectionsError}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Brands</h1>

            {/* CREATE FORM */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-medium mb-4 text-gray-800">Add New Brand</h2>
                {formError && <p className="text-sm text-red-600 mb-3">{formError}</p>}
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Nike, Samsung, Apple"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Section affiliation</label>
                        <select
                            value={sectionId}
                            onChange={(e) => setSectionId(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="">Select Target Section</option>
                            {sections.map((sec) => (
                                <option key={sec.id} value={sec.id}>
                                    {sec.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2 text-right">
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium cursor-pointer"
                        >
                            {isSubmitting ? 'Saving...' : 'Add Brand'}
                        </button>
                    </div>
                </form>
            </div>

            {/* BRANDS TABLE */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Associated Section</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {brands.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No brands found.</td></tr>
                        ) : (
                            brands.map((brand) => (
                                <tr key={brand.id}>
                                    <td className="px-6 py-4 text-sm text-gray-500">{brand.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{brand.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {brand.section?.name || <span className="text-gray-400 italic">Unassigned</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        <button 
                                            onClick={() => removeBrand(brand.id)} 
                                            className="text-red-600 hover:text-red-900 font-medium cursor-pointer"
                                        >
                                            Delete
                                        </button>
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