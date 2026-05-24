import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from './CartContext';

const PcBuilderContext = createContext();

const INITIAL_SELECTIONS = {
    case: null, cpu: null, motherboard: null, graphic_card: null,
    ram: null, hard_disk: null, optical_drive: null, power_supply: null,
    cooling_system: null, fan: null, monitor: null, mouse: null,
    keyboard: null, headphone: null, sound_system: null
};

export function PcBuilderProvider({ children }) {
    const { addToCart } = useCart();
    const [components, setComponents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. استرجاع التجميعة المحفوظة سابقاً من الذاكرة المحلية عند إقلاع التطبيق
    const [selections, setSelections] = useState(() => {
        const savedBuild = localStorage.getItem('eco_pc_build_selections');
        return savedBuild ? JSON.parse(savedBuild) : INITIAL_SELECTIONS;
    });

    // 2. مزامنة وحفظ التجميعة في الـ localStorage فور حدوث أي تغيير على الخيارات
    useEffect(() => {
        localStorage.setItem('eco_pc_build_selections', JSON.stringify(selections));
    }, [selections]);

    // 3. جلب الأصول من الباك إند لارافل مرة واحدة فقط للتطبيق بالكامل
    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const response = await api.get('/public/pc-configurator');
                setComponents(response.data);
            } catch (err) {
                setError('Failed to load PC configuration components.');
            } finally {
                setLoading(false);
            }
        };
        fetchComponents();
    }, []);

    const selectComponent = (type, product) => {
        setSelections(prev => ({
            ...prev,
            [type]: product
        }));
    };

    const clearBuild = () => {
        setSelections(INITIAL_SELECTIONS);
    };

    const totalPrice = Object.values(selections).reduce((total, currentItem) => {
        if (currentItem) return total + parseFloat(currentItem.price);
        return total;
    }, 0);

    const addBuildToCart = () => {
        Object.values(selections).forEach(item => {
            if (item) addToCart(item);
        });
        // اختياري: يمكنك تصفير التجميعة بعد نقلها للسلة عبر تفعيل السطر التالي:
        // clearBuild(); 
    };

    return (
        <PcBuilderContext.Provider value={{
            components, loading, error, selections, selectComponent, totalPrice, addBuildToCart, clearBuild
        }}>
            {children}
        </PcBuilderContext.Provider>
    );
}

export function usePcBuilderGlobal() {
    const context = useContext(PcBuilderContext);
    if (!context) {
        throw new Error("usePcBuilderGlobal must be used within a PcBuilderProvider");
    }
    return context;
}