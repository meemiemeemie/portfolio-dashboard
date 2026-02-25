import React from 'react';

const Sidebar = ({ tenants, activeView, onSelectView, onBackToConfig }) => {
    return (
        <div className="w-64 glass-panel border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">
                    Dashlane
                </h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Portfolio Manager</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                <button
                    onClick={() => onSelectView('portfolio')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'portfolio'
                        ? 'bg-primary/20 text-primary shadow-lg shadow-primary/10 border border-primary/20'
                        : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="font-medium">Portfolio Overview</span>
                </button>

                <div className="pt-6 pb-2 px-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Teams</p>
                </div>

                {tenants.map(tenant => (
                    <button
                        key={tenant.id}
                        onClick={() => onSelectView(tenant.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeView === tenant.id
                            ? 'bg-slate-800 text-white border border-gray-700'
                            : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-3 truncate">
                            <div className={`w-2 h-2 rounded-full ${tenant.status === 'success' ? 'bg-success shadow-[0_0_8px_var(--success)]' :
                                tenant.status === 'loading' ? 'bg-warning animate-pulse' : 'bg-danger'
                                }`} />
                            <span className="truncate text-sm font-medium">{tenant.name}</span>
                        </div>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={onBackToConfig}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 transition-all border border-gray-700 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.414 4.586a2 2 0 00-2.828 0L4.586 8.586a2 2 0 000 2.828l4 4a2 2 0 002.828-2.828L9.828 11H16a1 1 0 100-2H9.828l1.586-1.586z" clipRule="evenodd" />
                    </svg>
                    Config & Settings
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
