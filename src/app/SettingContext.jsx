// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '../services/api';

// const SettingContext = createContext();

// export function SettingProvider({ children }) {
//     const [settings, setSettings] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const fetchSettings = async () => {
//         try {
//             setLoading(true);
//             const response = await api.get('/public/settings');
//             setSettings(response.data);
//             setError(null);
//         } catch (err) {
//             setError('Failed to load site configurations.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchSettings();
//     }, []);

//     const updateSettings = async (updatedPayload) => {
//         try {
//             await api.post('/settings', { settings: updatedPayload });
//             setSettings(prev => ({ ...prev, ...updatedPayload }));
//             return { success: true };
//         } catch (err) {
//             return { success: false, error: err.response?.data?.message || 'Failed to save settings.' };
//         }
//     };

//     return (
//         <SettingContext.Provider value={{ settings, loading, error, updateSettings, refreshSettings: fetchSettings }}>
//             {children}
//         </SettingContext.Provider>
//     );
// }

// export function useSettings() {
//     return useContext(SettingContext);
// }