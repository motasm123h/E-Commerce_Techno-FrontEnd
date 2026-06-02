
import { useState, useEffect } from 'react';
import { usePcBuilderGlobal } from '../../app/PcBuilderContext'; 
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const COMPATIBILITY_RULES = [
    {
        categories: ['cpu', 'motherboard'],
        left: 'socket',
        right: 'socket'
    },

    {
        categories: ['cpu', 'motherboard'],
        left: 'generation',
        right: 'supported generations'
    },

    {
        categories: ['cpu', 'ram'],
        left: 'supported ram types',
        right: 'ram type'
    },

    {
        categories: ['motherboard', 'ram'],
        left: 'ram type',
        right: 'ram type'
    },

    {
        categories: ['cooling_system', 'cpu'],
        left: 'supported sockets',
        right: 'socket'
    },

    {
        categories: ['case', 'motherboard'],
        left: 'supported form factors',
        right: 'form factor'
    }
];

export default function PcBuilderPage() {
    const { t } = useTranslation();
    
    const { 
        components, 
        loading, 
        error, 
        selections, 
        selectComponent, 
        totalPrice, 
        addBuildToCart,
        clearBuild,
        fetchComponents
    } = usePcBuilderGlobal();
    
    const [successMessage, setSuccessMessage] = useState(false);
    
    useEffect(() => {
        fetchComponents(); 
    }, []);

    const rowConfigurations = [
        { key: 'cpu', label: 'Processor (CPU)' },
        { key: 'motherboard', label: 'Motherboard' },
        { key: 'ram', label: 'Memory (RAM)' },
        { key: 'graphic_card', label: 'Graphic Card (GPU)' },
        { key: 'hard_disk', label: 'Storage (SSD/HDD)' },
        { key: 'power_supply', label: 'Power Supply Unit (PSU)' },
        { key: 'cooling_system', label: 'CPU Cooler' },
        { key: 'fan', label: 'Case Fans' },
        { key: 'monitor', label: 'Display Monitor' },
        { key: 'headphone', label: 'Gaming Headset' }
    ];
    
    const attributeIndex = useMemo(() => {

        const index = new Map();

        Object.values(components)
            .flat()
            .forEach(product => {

                const attrs = {};

                product.attribute_groups?.forEach(group => {

                    const attrName = group.attribute_name
                        ?.toLowerCase()
                        ?.trim();

                    if (!attrName) return;

                    attrs[attrName] = new Set(
                        group.selected_values.map(v =>
                            v.value_name
                                ?.toLowerCase()
                                ?.trim()
                        )
                    );
                });

                index.set(product.id, attrs);
            });

        return index;

    }, [components]);



    const hasIntersection = (setA, setB) => {

        if (!setA || !setB) {
            return true;
        }

        for (const value of setA) {
            if (setB.has(value)) {
                return true;
            }
        }

        return false;
    };


    const isComponentCompatible = (
        candidate,
        category
    ) => {

        const candidateAttrs =
            attributeIndex.get(candidate.id);

        for (const [selectedCategory, selectedProduct]
            of Object.entries(selections)) {

            if (!selectedProduct) continue;

            if (selectedProduct.id === candidate.id) {
                continue;
            }

            const selectedAttrs =
                attributeIndex.get(selectedProduct.id);

            for (const rule of COMPATIBILITY_RULES) {

                const applies =
                    rule.categories.includes(category)
                    &&
                    rule.categories.includes(selectedCategory);

                if (!applies) continue;

                const candidateLeft =
                    candidateAttrs?.[rule.left];

                const selectedRight =
                    selectedAttrs?.[rule.right];

                if (
                    candidateLeft &&
                    selectedRight &&
                    !hasIntersection(
                        candidateLeft,
                        selectedRight
                    )
                ) {
                    return false;
                }

                const candidateRight =
                    candidateAttrs?.[rule.right];

                const selectedLeft =
                    selectedAttrs?.[rule.left];

                if (
                    candidateRight &&
                    selectedLeft &&
                    !hasIntersection(
                        candidateRight,
                        selectedLeft
                    )
                ) {
                    return false;
                }
            }
        }

        return true;
    };

    const filteredComponents = useMemo(() => {

        const result = {};

        Object.entries(components).forEach(([category, products]) => {

            result[category] = (products || []).filter(product => {

                const currentSelection =
                    selections[category];

                if (
                    currentSelection &&
                    currentSelection.id === product.id
                ) {
                    return true;
                }

                return isComponentCompatible(
                    product,
                    category
                );
            });
        });

        return result;

    }, [components, selections, attributeIndex]);
        

    const handleAddAndNotify = () => {
        addBuildToCart();
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 4000);
    };

    if (loading) return <div className="text-center py-36 text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse">Assembling dynamic matrix...</div>;
    if (error) return <div className="max-w-md mx-auto my-12 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-center text-xs font-black uppercase tracking-wider">{error}</div>;

    return (
        <div className="bg-[#f8fafc] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="max-w-5xl mx-auto space-y-6">
                
                <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(15,23,42,0.02)]">
                    <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                                Global PC Configurator
                            </h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mt-0.5">
                                Automated Dynamic Rules Engine Enabled
                            </p>
                        </div>
                        <button 
                            onClick={clearBuild}
                            className="text-[10px] font-black uppercase tracking-widest border border-rose-200 text-rose-500 bg-rose-50/30 px-4 py-2 rounded-xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all cursor-pointer select-none"
                        >
                            ✕ Clear Configuration Reset
                        </button>
                    </div>

                    <div className="space-y-1 divide-y divide-slate-50">
                        {rowConfigurations.map((row) => {
                            const filteredItems =filteredComponents[row.key] || [];
                            const currentSelection = selections[row.key];

                            return (
                                <div key={row.key} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 py-4 first:pt-0 last:pb-0 group">
                                    <div className="text-xs font-black tracking-widest uppercase text-slate-600 group-hover:text-[#00cc88] transition-colors flex items-center gap-2">
                                        <span>{row.label}</span>
                                    </div>

                                    <div className="md:col-span-2">
                                        <select
                                            value={currentSelection ? currentSelection.id : ''}
                                            onChange={(e) => {
                                                const selectedId = parseInt(e.target.value);
                                                const foundProduct = filteredItems.find(p => p.id === selectedId);
                                                selectComponent(row.key, foundProduct || null);
                                            }}
                                            className="w-full bg-slate-50/50 border border-slate-200 text-xs text-slate-800 font-bold px-4 py-2.5 rounded-xl focus:outline-none focus:bg-white focus:border-[#00cc88] focus:ring-1 focus:ring-[#00cc88] transition-all cursor-pointer shadow-3xs"
                                        >
                                            <option value="">Select compatible {row.label} ({filteredItems.length} options)</option>
                                            {filteredItems.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name} (+${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="text-left md:text-right text-sm font-mono font-black text-slate-900">
                                        {currentSelection ? `$${Number(currentSelection.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {successMessage && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-center text-xs font-black uppercase tracking-wider animate-fade-in shadow-3xs">
                        ✓ Configuration successfully deployed to shopping cart!
                    </div>
                )}

                <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_10px_30px_rgba(15,23,42,0.02)] transition-all duration-300">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Rig Price:</span>
                        <span className="text-3xl font-mono font-black text-slate-900 tracking-tight">${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <button
                        onClick={handleAddAndNotify}
                        disabled={totalPrice === 0}
                        className="w-full sm:w-auto bg-[#00cc88] hover:bg-[#00b374] text-white font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl disabled:opacity-20 cursor-pointer select-none"
                    >
                        Add Build to Cart →
                    </button>
                </div>
            </div>
        </div>
    );
}