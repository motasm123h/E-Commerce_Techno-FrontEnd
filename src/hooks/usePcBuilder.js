import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../app/CartContext';
import { usePcBuilderGlobal } from '../app/PcBuilderContext';

export function usePcBuilder() {
    const { addToCart } = useCart();
    const [components, setComponents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const context = usePcBuilderGlobal();
    const [selections, setSelections] = useState({
        case: null, cpu: null, motherboard: null, graphic_card: null,
        ram: null, hard_disk: null, optical_drive: null, power_supply: null,
        cooling_system: null, fan: null, monitor: null, mouse: null,
        keyboard: null, headphone: null, sound_system: null
    });

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

    const handleSelectComponent = (type, product) => {
        setSelections(prev => ({
            ...prev,
            [type]: product
        }));
    };

    const calculateTotalPrice = () => {
        return Object.values(selections).reduce((total, currentItem) => {
            if (currentItem) {
                return total + parseFloat(currentItem.price);
            }
            return total;
        }, 0);
    };

    const addBuildToCart = () => {
        Object.values(selections).forEach(item => {
            if (item) {
                addToCart(item);
            }
        });
    };

    return {
        components,
        loading,
        error,
        selections,
        selectComponent: handleSelectComponent,
        totalPrice: calculateTotalPrice(),
        addBuildToCart
    };
}