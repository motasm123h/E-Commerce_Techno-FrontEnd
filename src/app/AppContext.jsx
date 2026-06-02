import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [navItems, setNavItems] = useState([]);
    const [settings, setSettings] = useState({});
    const [homeSections, setHomeSections] = useState([]);
    const [homeAds, setHomeAds] = useState([]);

    const [navLoading, setNavLoading] = useState(true);
    const [settingsLoading, setSettingsLoading] = useState(true);

    useEffect(() => {
        api.get('/public/store-navigation')
            .then(res => {
                if (res.data) setNavItems(res.data);
            })
            .catch(err => console.error("Nav error", err))
            .finally(() => setNavLoading(false));

        api.get('/public/settings')
            .then(res => {
                if (res.data) setSettings(res.data);
            })
            .catch(err => console.error("Settings error", err))
            .finally(() => setSettingsLoading(false));

        api.get('/public/home-sections')
            .then(res => {
                if (res.data?.data) setHomeSections(res.data.data);
            })
            .catch(err => console.error("Sections error", err));

        api.get('/public/advertisements')
            .then(res => {
                if (res.data?.data) setHomeAds(res.data.data);
            })
            .catch(err => console.error("Ads error", err));

    }, []); 

    
    const globalLoading = navLoading || settingsLoading;

    const value = {
        navItems,
        settings,
        homeSections,
        homeAds,
        loading: globalLoading 
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