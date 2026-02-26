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

  // Mock data for verification
  const mockTenants = [
    {
      id: 'mock-1',
      name: 'Mock Org 1',
      status: 'success',
      data: {
        team: { seats: { active: 10, remaining: 5, pending: 2 } },
        healthscore: [{ score: 80, weak: 1, reused: 2, compromised: 0 }]
      }
    },
    {
      id: 'mock-2',
      name: 'Mock Org 2 (Zero Score)',
      status: 'success',
      data: {
        team: { seats: { active: 5, remaining: 2, pending: 1 } },
        healthscore: [{ score: 0, weak: 0, reused: 0, compromised: 0 }]
      }
    }
  ];

  const tenantsToUse = tenants.length > 0 ? tenants : mockTenants;
  const currentView = tenants.length > 0 ? view : 'portfolio';

  const handleBackToConfig = () => {
    setView('config');
    clearTenants();
  };

  if (currentView === 'config') {
    return <ConfigScreen onStart={handleStart} />;
  }

  const activeTenant = tenantsToUse.find(t => t.id === currentView);

  return (
    <div className="flex min-h-screen bg-dark text-white font-sans">
      <Sidebar
        tenants={tenantsToUse}
        activeView={currentView}
        onSelectView={setView}
        onBackToConfig={handleBackToConfig}
      />

      <div className="flex-1 ml-64 p-8 relative">
        {currentView === 'portfolio' && (
          <PortfolioView tenants={tenantsToUse} />
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
