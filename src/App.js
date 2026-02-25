import React, { useState } from 'react';
import ConfigScreen from './components/ConfigScreen';
import Sidebar from './components/Sidebar';
import PortfolioView from './components/PortfolioView';
import TeamView from './components/TeamView';
import { useDashlaneData } from './hooks/useDashlaneData';

const App = () => {
  const [view, setView] = useState('config'); // 'config', 'portfolio', or tenantId
  const { tenants, initializeTenants, clearTenants } = useDashlaneData();

  const handleStart = (configs) => {
    initializeTenants(configs);
    setView('portfolio');
  };

  const handleBackToConfig = () => {
    setView('config');
    clearTenants();
  };

  if (view === 'config') {
    return <ConfigScreen onStart={handleStart} />;
  }

  const activeTenant = tenants.find(t => t.id === view);

  return (
    <div className="flex min-h-screen bg-dark text-white font-sans">
      <Sidebar
        tenants={tenants}
        activeView={view}
        onSelectView={setView}
        onBackToConfig={handleBackToConfig}
      />

      <div className="flex-1 ml-64 p-8 relative">
        {view === 'portfolio' && (
          <PortfolioView tenants={tenants} />
        )}

        {activeTenant && (
          <div className="animate-fade-in space-y-6">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white shadow-text">{activeTenant.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${activeTenant.status === 'success' ? 'bg-success' :
                    activeTenant.status === 'error' ? 'bg-danger' : 'bg-warning animate-pulse'
                    }`}></span>
                  <span className="text-sm text-gray-400 capitalize">{activeTenant.status}</span>
                </div>
              </div>
            </header>

            {activeTenant.status === 'loading' && (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {activeTenant.status === 'error' && (
              <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger">
                Error loading dashboard: {activeTenant.error}
              </div>
            )}

            {activeTenant.status === 'success' && activeTenant.data && (
              <TeamView dashlaneInfo={activeTenant.data} token={activeTenant.token} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
