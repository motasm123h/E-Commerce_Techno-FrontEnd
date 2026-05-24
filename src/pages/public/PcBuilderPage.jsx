import { usePcBuilder } from '../../hooks/usePcBuilder';
import { useState } from 'react';

export default function PcBuilderPage() {
    const { components, loading, error, selections, selectComponent, totalPrice, addBuildToCart } = usePcBuilder();
    const [successMessage, setSuccessMessage] = useState(false);

    const rowConfigurations = [
        { key: 'cpu', label: 'CPU' },
        { key: 'motherboard', label: 'Mother Board' },
        { key: 'graphic_card', label: 'Graphic Card' },
        { key: 'ram', label: 'RAM' },
        { key: 'hard_disk', label: 'Hard Disk' },
        { key: 'power_supply', label: 'Power Supply' },
        { key: 'cooling_system', label: 'Cooling System' },
        { key: 'fan', label: 'Fan' },
        { key: 'monitor', label: 'Monitor' },
        { key: 'headphone', label: 'Headphone' }
    ];

    if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading Configurator...</div>;
    if (error) return <div className="max-w-md mx-auto my-12 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-sm font-bold">{error}</div>;

    const handleAddAndNotify = () => {
        addBuildToCart();
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 4000);
    };

    return (
        <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* الجزء الرئيسي: قائمة اختيار المكونات مع بوردر قوي */}
                <div className="bg-white border-2 border-gray-300 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6 border-b-2 border-gray-900 pb-4">
                        Configure System Components
                    </h3>

                    <div className="space-y-2">
                        {rowConfigurations.map((row) => {
                            const availableItems = components[row.key] || [];
                            const currentSelection = selections[row.key];

                            return (
                                <div key={row.key} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 py-4 border-b-2 border-gray-100 last:border-0">
                                    <div className="text-sm font-bold text-gray-800">
                                        {row.label}
                                    </div>

                                    <div className="md:col-span-2">
                                        <select
                                            value={currentSelection ? currentSelection.id : ''}
                                            onChange={(e) => {
                                                const selectedId = parseInt(e.target.value);
                                                const foundProduct = availableItems.find(p => p.id === selectedId);
                                                selectComponent(row.key, foundProduct || null);
                                            }}
                                            className="w-full bg-white border-2 border-gray-300 text-sm text-gray-900 px-4 py-3 rounded-lg focus:outline-none focus:border-gray-900 transition font-bold"
                                        >
                                            <option value="">Select {row.label}</option>
                                            {availableItems.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name} (+${Number(item.price).toFixed(2)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="text-right text-sm font-black text-gray-900">
                                        {currentSelection ? `$${Number(currentSelection.price).toFixed(2)}` : '$0.00'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* شريط الإجمالي */}
                {successMessage && (
                    <div className="bg-green-50 border-2 border-green-500 text-green-900 p-4 rounded-xl text-center text-sm font-bold">
                        ✓ All configured PC components have been added to your shopping cart!
                    </div>
                )}

                <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-sm font-bold text-gray-600">Total Cost:</span>
                        <span className="text-3xl font-black text-gray-900">${totalPrice.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleAddAndNotify}
                        disabled={totalPrice === 0}
                        className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition duration-200 disabled:opacity-30 cursor-pointer"
                    >
                        Add Build to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}