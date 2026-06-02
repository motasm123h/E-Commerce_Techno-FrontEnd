import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AttributesPage() {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Attribute Form State
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('checkbox'); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [activeAttribute, setActiveAttribute] = useState(null); // المواصفة التي يتم إدارة قيمها الآن
    const [values, setValues] = useState([]);
    const [newValueText, setNewValueText] = useState('');
    const [editingValueId, setEditingValueId] = useState(null);
    const [valueText, setValueText] = useState('');
    const [loadingValues, setLoadingValues] = useState(false);

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

    // جلب قيم مواصفة معينة عند النقر عليها
    const openValuesManager = async (attr) => {
        setActiveAttribute(attr);
        setNewValueText('');
        setEditingValueId(null);
        try {
            setLoadingValues(true);
            const res = await api.get(`/admin/attributes/${attr.id}/values`);
            setValues(res.data.data || res.data);
        } catch (err) {
            alert('Failed to load values');
        } finally {
            setLoadingValues(false);
        }
    };

    const handleAddValueSubmit = async (e) => {
        e.preventDefault();
        if (!newValueText.trim()) return;
        try {
            await api.post('/admin/attribute-values', {
                attribute_id: activeAttribute.id,
                value: newValueText.trim()
            });
            setNewValueText('');
            openValuesManager(activeAttribute); 
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save value');
        }
    };

    const handleUpdateValueSubmit = async (e) => {
        e.preventDefault();
        if (!valueText.trim()) return;
        try {
            await api.put(`/admin/attribute-values/${editingValueId}`, {
                value: valueText.trim()
            });
            setEditingValueId(null);
            setValueText('');
            openValuesManager(activeAttribute);
        } catch (err) {
            alert('Failed to update value');
        }
    };

    const handleDeleteValue = async (id) => {
        if (!window.confirm('Delete this value?')) return;
        try {
            await api.delete(`/admin/attribute-values/${id}`);
            openValuesManager(activeAttribute);
        } catch (err) {
            alert('Failed to delete value');
        }
    };

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
                await api.post(`/admin/attributes/${editingId}`, { name, type });
            } else {
                await api.post('/admin/attributes', { name, type });
            }
            resetForm();
            fetchAttributes(); 
        } catch (err) {
            alert('Failed to save attribute');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this attribute? All related values will be purged.')) return;
        try {
            await api.delete(`/admin/attributes/${id}`);
            if (activeAttribute?.id === id) setActiveAttribute(null);
            fetchAttributes();
        } catch (err) {
            alert('Failed to delete attribute');
        }
    };

    if (loading) return <div className="p-6">Loading attributes...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Attributes</h1>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium mb-4 text-gray-800">
                        {editingId ? 'Edit Attribute Schema' : 'Add New Attribute Key'}
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Input Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="checkbox">Checkbox (Multiple choices)</option>
                                <option value="select">Dropdown (Single choice)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            {editingId && (
                                <button type="button" onClick={resetForm} className="bg-gray-200 px-6 py-2 rounded-md font-medium cursor-pointer">Cancel</button>
                            )}
                            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 cursor-pointer">
                                {isSubmitting ? 'Saving...' : 'Save Attribute'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* جدول المواصفات */}
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
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {attributes.map((attr) => (
                                <tr key={attr.id} className={`hover:bg-gray-50 transition-colors ${activeAttribute?.id === attr.id ? 'bg-blue-50/40' : ''}`}>
                                    <td className="px-6 py-4 text-gray-500">{attr.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{attr.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{attr.type}</td>
                                    <td className="px-6 py-4 text-right space-x-3 font-bold text-xs">
                                        <button onClick={() => openValuesManager(attr)} className="text-blue-600 hover:underline cursor-pointer">🎨 Manage Values</button>
                                        <button onClick={() => handleEdit(attr)} className="text-amber-600 hover:underline cursor-pointer">Edit</button>
                                        <button onClick={() => handleDelete(attr.id)} className="text-red-600 hover:underline cursor-pointer">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 h-fit min-h-[400px]">
                {activeAttribute ? (
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">
                                Option Nodes: <span className="text-blue-600">{activeAttribute.name}</span>
                            </h3>
                            <button onClick={() => setActiveAttribute(null)} className="text-xs text-gray-400 hover:text-gray-600">✕ Close</button>
                        </div>

                        {editingValueId ? (
                            <form onSubmit={handleUpdateValueSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    required
                                    value={valueText}
                                    onChange={(e) => setValueText(e.target.value)}
                                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white outline-none"
                                />
                                <button type="submit" className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold">Update</button>
                                <button type="button" onClick={() => setEditingValueId(null)} className="bg-gray-200 text-gray-700 text-xs px-2 py-1.5 rounded-lg">✕</button>
                            </form>
                        ) : (
                            <form onSubmit={handleAddValueSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    required
                                    placeholder={`Add value to ${activeAttribute.name}...`}
                                    value={newValueText}
                                    onChange={(e) => setNewValueText(e.target.value)}
                                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white outline-none focus:border-blue-500"
                                />
                                <button type="submit" className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded-lg font-bold hover:bg-blue-700">+ Add</button>
                            </form>
                        )}

                        {loadingValues ? (
                            <p className="text-xs text-center text-gray-400 py-4">Syncing Values List...</p>
                        ) : (
                            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                                {values.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic text-center py-6">No specific predefined options set yet.</p>
                                ) : (
                                    values.map(v => (
                                        <div key={v.id} className="bg-white p-2.5 rounded-lg border border-gray-200 flex justify-between items-center text-xs shadow-xs">
                                            <span className="font-bold text-gray-800">{v.value}</span>
                                            <div className="space-x-2 font-semibold">
                                                <button 
                                                    onClick={() => { setEditingValueId(v.id); setValueText(v.value); }} 
                                                    className="text-amber-600 hover:underline"
                                                >
                                                    Rename
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteValue(v.id)} 
                                                    className="text-red-500 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 italic text-xs">
                        Select "Manage Values" on any attribute inside the table blueprint grid to coordinate its structured options repository.
                    </div>
                )}
            </div>
            
        </div>
    );
}