import React, { useState, useEffect } from 'react';

const ConfigScreen = ({ onStart }) => {
    const [configs, setConfigs] = useState([{ id: Date.now(), name: '', token: '' }]);
    const [error, setError] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('dashlane_portfolio_configs');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setConfigs(parsed);
                }
            } catch (e) {
                console.error("Failed to parse saved configs", e);
            }
        }
    }, []);

    const addRow = () => {
        setConfigs([...configs, { id: Date.now(), name: '', token: '' }]);
        setError(null);
    };

    const removeRow = (id) => {
        if (configs.length === 1) {
            setConfigs([{ id: Date.now(), name: '', token: '' }]);
            return;
        }
        setConfigs(configs.filter(c => c.id !== id));
    };

    const updateRow = (id, field, value) => {
        setConfigs(configs.map(c => c.id === id ? { ...c, [field]: value } : c));
        setError(null);
    };

    const handleStart = () => {
        const validConfigs = configs.filter(c => c.name.trim() && c.token.trim());
        if (validConfigs.length === 0) {
            setError("Please enter at least one valid Brand Name and API Token pair.");
            return;
        }
        localStorage.setItem('dashlane_portfolio_configs', JSON.stringify(validConfigs));
        onStart(validConfigs);
    };

    const handleClearRequest = () => {
        setShowClearConfirm(true);
        // Auto-hide confirmation after 3 seconds
        setTimeout(() => setShowClearConfirm(false), 3000);
    };

    const handleClearConfirm = () => {
        localStorage.removeItem('dashlane_portfolio_configs');
        setConfigs([{ id: Date.now(), name: '', token: '' }]);
        setShowClearConfirm(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Portfolio Dashboard
                    </h1>
                    <p className="text-gray-400">Manage visibility across your entire organization.</p>
                </div>

                <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        <div className="col-span-4">Brand / Subsidiary</div>
                        <div className="col-span-7">API Bearer Token</div>
                        <div className="col-span-1"></div>
                    </div>

                    {configs.map((config) => (
                        <div key={config.id} className="grid grid-cols-12 gap-4 items-center animate-fade-in">
                            <div className="col-span-4">
                                <input
                                    type="text"
                                    placeholder="e.g. Acme Corp EU"
                                    value={config.name}
                                    onChange={(e) => updateRow(config.id, 'name', e.target.value)}
                                    className="glass-input w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div className="col-span-7">
                                <input
                                    type="password"
                                    placeholder="eyJhbG..."
                                    value={config.token}
                                    onChange={(e) => updateRow(config.id, 'token', e.target.value)}
                                    className="glass-input w-full px-4 py-3 rounded-xl font-mono text-xs focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <button
                                    onClick={() => removeRow(config.id)}
                                    className="text-gray-500 hover:text-danger transition-colors p-2"
                                    title="Remove"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3 text-danger animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
                    <button
                        onClick={addRow}
                        className="flex items-center gap-2 text-primary hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Another Team
                    </button>

                    <div className="flex gap-4 items-center">
                        {!showClearConfirm ? (
                            <button
                                onClick={handleClearRequest}
                                className="px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                Clear Storage
                            </button>
                        ) : (
                            <button
                                onClick={handleClearConfirm}
                                className="px-6 py-3 rounded-xl bg-danger text-white hover:bg-danger/90 transition-colors text-sm font-medium animate-pulse"
                            >
                                Confirm Clear?
                            </button>
                        )}

                        <button
                            onClick={handleStart}
                            className="glass-button px-8 py-3 rounded-xl shadow-lg shadow-cyan-500/20"
                        >
                            Load Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfigScreen;
