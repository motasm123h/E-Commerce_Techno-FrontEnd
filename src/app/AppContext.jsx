import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [navItems, setNavItems] = useState([]);
    const [settings, setSettings] = useState({});
    
    // 1. إضافة الـ State الناقصة للأقسام والإعلانات
    const [homeSections, setHomeSections] = useState([]);
    const [homeAds, setHomeAds] = useState([]);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                setLoading(true);
                const [navRes, settingsRes, sectionsRes, adsRes] = await Promise.all([
                    api.get('/public/store-navigation'),
                    api.get('/public/settings'),
                    api.get('/public/home-sections'),
                    api.get('/public/advertisements')
                ]);
                if (navRes.data) setNavItems(navRes.data);
                if (settingsRes.data) setSettings(settingsRes.data);
                // console.log(settingsRes.data)
                
                if (sectionsRes.data?.data) setHomeSections(sectionsRes.data.data);
                if (adsRes.data?.data) setHomeAds(adsRes.data.data);

            } catch (error) {
                console.error("Failed to load global app data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGlobalData();
    }, []); // مصفوفة فارغة تعني: اشتغل مرة واحدة فقط عند البداية

    const value = {
        navItems,
        settings,
        homeSections,
        homeAds,
        loading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export const useGlobalApp = () => {
    return useContext(AppContext);
};