import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ShippingZonesAdmin() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        id: null,
        city_name: '',
        fee: '',
        is_active: '1' // 1 = Active, 0 = Inactive
    });

    // جلب مناطق الشحن
    const fetchZones = async () => {
        try {
            setLoading(true);
            const response = await api.get('/public/shipping-zones');
            // تأكد من هيكلية استجابة الـ API لديك، غالباً تكون response.data.data
            setZones(response.data?.data || response.data || []);
        } catch (err) {
            setError('Failed to fetch shipping zones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        const payload = {
            city_name: formData.city_name,
            fee: parseFloat(formData.fee),
            is_active: parseInt(formData.is_active)
        };

        try {
            if (isEditing) {
                // Update
                await api.put(`/shipping-zones/${formData.id}`, payload);
            } else {
                // Create
                await api.post('/shipping-zones', payload);
            }
            
            // تصفير الفورم وتحديث الجدول
            setFormData({ id: null, city_name: '', fee: '', is_active: '1' });
            setIsEditing(false);
            fetchZones();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        }
    };

    const handleEdit = (zone) => {
        setIsEditing(true);
        setFormData({
            id: zone.id,
            city_name: zone.city_name,
            fee: zone.fee,
            is_active: zone.is_active ? '1' : '0'
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this zone?')) return;
        
        try {
            await api.delete(`/shipping-zones/${id}`);
            fetchZones();
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed.');
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setFormData({ id: null, city_name: '', fee: '', is_active: '1' });
    };

    if (loading && zones.length === 0) return <div className="p-10 font-bold text-gray-500 uppercase tracking-widest text-center">Loading Zones...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="border-b-2 border-gray-900 pb-4">
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Shipping Zones Management</h1>
            </div>

            {error && (
                <div className="bg-red-50 border-2 border-red-600 text-red-700 p-4 text-xs font-bold uppercase tracking-wider">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-900 p-6 space-y-6 sticky top-6">
                        <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-gray-100 pb-3">
                            {isEditing ? 'Edit Zone' : 'Add New Zone'}
                        </h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">City / Zone Name</label>
                            <input 
                                required 
                                type="text" 
                                name="city_name" 
                                value={formData.city_name} 
                                onChange={handleInputChange} 
                                className="w-full bg-gray-50 border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-gray-900 transition" 
                                placeholder="e.g. Damascus" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Delivery Fee ($)</label>
                            <input 
                                required 
                                type="number" 
                                step="0.01" 
                                name="fee" 
                                value={formData.fee} 
                                onChange={handleInputChange} 
                                className="w-full bg-gray-50 border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-gray-900 transition" 
                                placeholder="5.00" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</label>
                            <select 
                                name="is_active" 
                                value={formData.is_active} 
                                onChange={handleInputChange} 
                                className="w-full bg-gray-50 border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-gray-900 transition appearance-none rounded-none"
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 pt-4">
                            <button type="submit" className="w-full bg-gray-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-4 transition border-2 border-gray-900 hover:border-blue-600 cursor-pointer">
                                {isEditing ? 'Update Zone' : 'Save Zone'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={cancelEdit} className="w-full bg-white text-gray-900 font-black text-xs uppercase tracking-widest py-4 transition border-2 border-gray-200 hover:border-gray-900 cursor-pointer">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white border-2 border-gray-200 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b-2 border-gray-900">
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">ID</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">City Name</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Fee</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-gray-100">
                                {zones.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            No Shipping Zones Found. Add one to start.
                                        </td>
                                    </tr>
                                ) : (
                                    zones.map((zone) => (
                                        <tr key={zone.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4 text-sm font-black text-gray-900">{zone.id}</td>
                                            <td className="p-4 text-sm font-bold text-gray-800">{zone.city_name}</td>
                                            <td className="p-4 text-sm font-black text-blue-600">${Number(zone.fee).toFixed(2)}</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border ${zone.is_active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                                    {zone.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-3">
                                                <button onClick={() => handleEdit(zone)} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 cursor-pointer">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(zone.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 cursor-pointer">
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
            </div>
        </div>
    );
}