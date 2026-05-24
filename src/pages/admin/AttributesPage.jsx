import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AttributesPage() {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form State
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('checkbox'); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    const fetchAttributes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/attributes');
            setAttributes(res.data.data || res.data); 
        } catch (err) {
            setError('Failed to load attributes');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAttributes();
    }, []);


    const handleEdit = (attr) => {
        setEditingId(attr.id);
        setName(attr.name);
        setType(attr.type);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setType('checkbox');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/admin/attributes/${editingId}`, { name, type });
            } else {
                await api.post('/admin/attributes', { name, type });
            }
            resetForm();
            fetchAttributes(); // تحديث الجدول
        } catch (err) {
            alert('Failed to save attribute');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this attribute?')) return;
        try {
            await api.delete(`/admin/attributes/${id}`);
            fetchAttributes();
        } catch (err) {
            alert('Failed to delete attribute');
        }
    };

    if (loading) return <div className="p-6">Loading attributes...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Attributes</h1>

            {/* Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-medium mb-4 text-gray-800">
                    {editingId ? 'Edit Attribute' : 'Add New Attribute'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attribute Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Screen Size, RAM..."
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Input Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="checkbox">Checkbox (Multiple choices)</option>
                            <option value="select">Dropdown (Single choice)</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                        {editingId && (
                            <button type="button" onClick={resetForm} className="bg-gray-200 px-6 py-2 rounded-md font-medium">Cancel</button>
                        )}
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : 'Save Attribute'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {attributes.map((attr) => (
                            <tr key={attr.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-500">{attr.id}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{attr.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{attr.type}</td>
                                <td className="px-6 py-4 text-right text-sm space-x-3">
                                    <button onClick={() => handleEdit(attr)} className="text-blue-600 hover:text-blue-900 font-medium cursor-pointer">Edit</button>
                                    <button onClick={() => handleDelete(attr.id)} className="text-red-600 hover:text-red-900 font-medium cursor-pointer">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}