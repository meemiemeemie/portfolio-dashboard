import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const useDashlaneData = () => {
    const [tenants, setTenants] = useState([]);

    const fetchTenantData = async (tenant) => {
        const api = axios.create({
            baseURL: API_BASE_URL,
            headers: { Authorization: `Bearer ${tenant.token}` }
        });

        try {
            const [team, healthscore, users] = await Promise.all([
                api.post('/Status'),
                api.post('/PasswordHealth'),
                api.post('/Members', {
                    page: 0,
                    order: 'ASC',
                    orderBy: 'email',
                    limit: 100
                })
            ]);

            const data = {
                team: team.data.data,
                healthscore: [...healthscore.data.data.history, healthscore.data.data.current],
                users: users.data.data
            };

            setTenants(prev => prev.map(t =>
                t.id === tenant.id ? { ...t, status: 'success', data } : t
            ));
        } catch (error) {
            console.error(`Failed to fetch data for ${tenant.name}:`, error);
            setTenants(prev => prev.map(t =>
                t.id === tenant.id ? { ...t, status: 'error', error: error.message } : t
            ));
        }
    };

    const initializeTenants = useCallback((configs) => {
        const initialTenants = configs.map(c => ({
            ...c,
            status: 'loading',
            data: null,
            error: null
        }));
        setTenants(initialTenants);

        // Fetch data for each tenant independently
        configs.forEach(tenant => fetchTenantData(tenant));
    }, []);

    const clearTenants = useCallback(() => {
        setTenants([]);
    }, []);

    return {
        tenants,
        initializeTenants,
        clearTenants
    };
};
