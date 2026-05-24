import { useState, useEffect } from 'react';
import api from '../services/api';

export function useStoreNavigation() {
    const [navItems, setNavItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNav = async () => {
            try {
                const response = await api.get('/public/store-navigation');
                setNavItems(response.data);
            } catch (error) {
                console.error("Failed to load store navigation", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNav();
    }, []);

    return { navItems, loading };
}