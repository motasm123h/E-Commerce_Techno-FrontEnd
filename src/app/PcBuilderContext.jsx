// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '../services/api';
// import { useCart } from './CartContext';

// const PcBuilderContext = createContext();

// const INITIAL_SELECTIONS = {
//     case: null, cpu: null, motherboard: null, graphic_card: null,
//     ram: null, hard_disk: null, optical_drive: null, power_supply: null,
//     cooling_system: null, fan: null, monitor: null, mouse: null,
//     keyboard: null, headphone: null, sound_system: null
// };

// export function PcBuilderProvider({ children }) {
//     const { addToCart } = useCart();
//     const [components, setComponents] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const [selections, setSelections] = useState(() => {
//         const savedBuild = localStorage.getItem('eco_pc_build_selections');
//         return savedBuild ? JSON.parse(savedBuild) : INITIAL_SELECTIONS;
//     });

//     useEffect(() => {
//         localStorage.setItem('eco_pc_build_selections', JSON.stringify(selections));
//     }, [selections]);

//     useEffect(() => {
//         const fetchComponents = async () => {
//             try {
//                 const response = await api.get('/public/pc-configurator');
//                 setComponents(response.data);
//             } catch (err) {
//                 setError('Failed to load PC configuration components.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchComponents();
//     }, []);

//     const selectComponent = (type, product) => {
//         setSelections(prev => ({
//             ...prev,
//             [type]: product
//         }));
//     };

//     const clearBuild = () => {
//         setSelections(INITIAL_SELECTIONS);
//     };

//     const totalPrice = Object.values(selections).reduce((total, currentItem) => {
//         if (currentItem) return total + parseFloat(currentItem.price);
//         return total;
//     }, 0);

//     const addBuildToCart = () => {
//         Object.values(selections).forEach(item => {
//             if (item) addToCart(item);
//         });
//         // اختياري: يمكنك تصفير التجميعة بعد نقلها للسلة عبر تفعيل السطر التالي:
//         // clearBuild(); 
//     };

//     return (
//         <PcBuilderContext.Provider value={{
//             components, loading, error, selections, selectComponent, totalPrice, addBuildToCart, clearBuild
//         }}>
//             {children}
//         </PcBuilderContext.Provider>
//     );
// }

// export function usePcBuilderGlobal() {
//     const context = useContext(PcBuilderContext);
//     if (!context) {
//         throw new Error("usePcBuilderGlobal must be used within a PcBuilderProvider");
//     }
//     return context;
// }



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
    
    // ⚡ تعديل 1: نجعل حالة الـ loading افتراضياً false لكي لا يحظر رندرة بقية صفحات الموقع ⚡
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selections, setSelections] = useState(() => {
        const savedBuild = localStorage.getItem('eco_pc_build_selections');
        return savedBuild ? JSON.parse(savedBuild) : INITIAL_SELECTIONS;
    });

    useEffect(() => {
        localStorage.setItem('eco_pc_build_selections', JSON.stringify(selections));
    }, [selections]);

    const fetchComponents = async (architecture) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.get(`/public/pc-configurator?architecture=${architecture}`);
            
            const fetchedData = response.data?.data ? response.data.data : response.data;
            setComponents(fetchedData);
        } catch (err) {
            setError('Failed to load PC configuration components.');
        } finally {
            setLoading(false);
        }
    };

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
    };

    return (
        /* نمرر دالة الـ fetchComponents المحدثة لكي يتم طلبها من صفحة الاختيار */
        <PcBuilderContext.Provider value={{
            components, loading, error, selections, selectComponent, totalPrice, addBuildToCart, clearBuild, fetchComponents
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