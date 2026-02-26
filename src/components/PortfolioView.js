import React from 'react';
import { CSVDownload } from '../utils/csvExport';

const PortfolioView = ({ tenants }) => {
    const loadedTenants = tenants.filter(t => t.status === 'success' && t.data);
    const [sortConfig, setSortConfig] = React.useState({ key: 'name', direction: 'ascending' });

    const totalSeats = loadedTenants.reduce((acc, t) => acc + (t.data.team.seats.active || 0), 0);
    const totalRemaining = loadedTenants.reduce((acc, t) => acc + (t.data.team.seats.remaining || 0), 0);
    const totalInvited = loadedTenants.reduce((acc, t) => acc + (t.data.team.seats.pending || 0), 0); // Assuming pending count is available? Usually implies invited but not accepted. Check API structure if possible, usually seats.pending exists.
    const totalAllocated = totalSeats + totalRemaining;

    const tenantsWithScores = loadedTenants.filter(t => {
        const current = t.data.healthscore[t.data.healthscore.length - 1];
        return current && current.score > 0;
    });

    const avgHealthScore = tenantsWithScores.length > 0
        ? tenantsWithScores.reduce((acc, t) => {
            const current = t.data.healthscore[t.data.healthscore.length - 1];
            return acc + (current ? current.score : 0);
        }, 0) / tenantsWithScores.length
        : 0;

    const sortedTenants = React.useMemo(() => {
        let items = [...loadedTenants];
        if (sortConfig.key) {
            items.sort((a, b) => {
                let aValue, bValue;
                const aCurrent = a.data.healthscore[a.data.healthscore.length - 1];
                const bCurrent = b.data.healthscore[b.data.healthscore.length - 1];

                switch (sortConfig.key) {
                    case 'name':
                        aValue = a.name.toLowerCase();
                        bValue = b.name.toLowerCase();
                        break;
                    case 'active_seats':
                        aValue = a.data.team.seats.active || 0;
                        bValue = b.data.team.seats.active || 0;
                        break;
                    case 'available_seats':
                        aValue = a.data.team.seats.remaining || 0;
                        bValue = b.data.team.seats.remaining || 0;
                        break;
                    case 'pending_invites':
                        aValue = a.data.team.seats.pending || 0;
                        bValue = b.data.team.seats.pending || 0;
                        break;
                    case 'score':
                        aValue = aCurrent.score || 0;
                        bValue = bCurrent.score || 0;
                        break;
                    case 'weak':
                        aValue = aCurrent.weak || 0;
                        bValue = bCurrent.weak || 0;
                        break;
                    case 'reused':
                        aValue = aCurrent.reused || 0;
                        bValue = bCurrent.reused || 0;
                        break;
                    case 'compromised':
                        aValue = aCurrent.compromised || 0;
                        bValue = bCurrent.compromised || 0;
                        break;
                    default:
                        return 0;
                }
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return items;
    }, [loadedTenants, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return <span className="text-gray-600 ml-1">↕</span>;
        return sortConfig.direction === 'ascending' ? <span className="text-primary ml-1">▲</span> : <span className="text-primary ml-1">▼</span>;
    };

    return (
        <div className="p-8 animate-fade-in space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Portfolio Overview</h1>
                    <p className="text-gray-400">Aggregated insights across {loadedTenants.length} organizations</p>
                </div>
                <div>
                    <CSVDownload tenants={loadedTenants} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                    </div>
                    <h3 className="text-primary/80">Total Active Seats</h3>
                    <p className="text-4xl font-bold text-white mt-2">{totalSeats.toLocaleString()}</p>
                    <div className="mt-4 w-full bg-gray-700 rounded-full h-4 overflow-hidden relative border border-gray-600">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                            style={{ width: `${(totalSeats / totalAllocated) * 100}%` }}
                        >
                            <span className="text-[10px] font-bold text-black leading-none">{((totalSeats / totalAllocated) * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{((totalSeats / totalAllocated) * 100).toFixed(1)}% Usage rate</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-accent" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-accent/80">Avg. Health Score</h3>
                        <div className="group/tooltip relative inline-block cursor-help">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-[10px] text-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-10 border border-border-glass leading-tight pointer-events-none">
                                Organizations with a score of 0 (insufficient data) are excluded from this average calculation.
                            </div>
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-white mt-2">
                        {(avgHealthScore / 100).toLocaleString("en", { style: "percent", minimumFractionDigits: 1 })}
                    </p>
                    <div className="mt-4 w-full bg-gray-700 rounded-full h-4 overflow-hidden relative border border-gray-600">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2 ${avgHealthScore > 80 ? 'bg-success' : avgHealthScore > 60 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ width: `${avgHealthScore}%` }}
                        >
                            <span className="text-[10px] font-bold text-black leading-none">{avgHealthScore.toFixed(0)}%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Aggregate score across all organizations</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-gray-400">Total Reports</h3>
                    <p className="text-4xl font-bold text-white mt-2">{loadedTenants.length}</p>
                    <p className="text-xs text-gray-400 mt-2">Data sources connected</p>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white">Organization Details</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50 text-xs uppercase text-gray-400">
                            <tr>
                                <th onClick={() => requestSort('name')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">Organization {getSortIndicator('name')}</th>
                                <th onClick={() => requestSort('active_seats')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">Active Seats {getSortIndicator('active_seats')}</th>
                                <th onClick={() => requestSort('available_seats')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">Available {getSortIndicator('available_seats')}</th>
                                <th onClick={() => requestSort('pending_invites')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">Pending {getSortIndicator('pending_invites')}</th>
                                <th onClick={() => requestSort('score')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">Health Score {getSortIndicator('score')}</th>
                                <th onClick={() => requestSort('weak')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">Weak {getSortIndicator('weak')}</th>
                                <th onClick={() => requestSort('reused')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">Reused {getSortIndicator('reused')}</th>
                                <th onClick={() => requestSort('compromised')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">Compromised {getSortIndicator('compromised')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {sortedTenants.map((t) => {
                                const current = t.data.healthscore[t.data.healthscore.length - 1];
                                return (
                                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{t.name}</td>
                                        <td className="px-6 py-4 text-gray-300">{t.data.team.seats.active}</td>
                                        <td className="px-6 py-4 text-gray-400">{t.data.team.seats.remaining}</td>
                                        <td className="px-6 py-4 text-gray-400">{t.data.team.seats.pending}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${current.score > 80 ? 'bg-success/10 text-success' :
                                                current.score > 60 ? 'bg-warning/10 text-warning' :
                                                    'bg-danger/10 text-danger'
                                                }`}>
                                                {current.score}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-warning">{current.weak}</td>
                                        <td className="px-6 py-4 text-warning">{current.reused}</td>
                                        <td className="px-6 py-4 text-danger">{current.compromised}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PortfolioView;
