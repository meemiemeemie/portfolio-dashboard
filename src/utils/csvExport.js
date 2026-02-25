import React from 'react';

const downloadCSV = (tenants) => {
    const headers = [
        'Organization',
        'Email',
        'Status',
        'Role',
        'Health Score',
        'Weak Passwords',
        'Reused Passwords',
        'Compromised Passwords',
        '2FA Type'
    ];

    const rows = [];

    tenants.forEach(tenant => {
        if (!tenant.data || !tenant.data.users || !tenant.data.users.members) return;

        tenant.data.users.members.forEach(user => {
            rows.push([
                tenant.name,
                user.email,
                user.status,
                Object.keys(user.role).find(key => user.role[key]) || 'User', // Simple role extraction
                user.passwordHealth.score,
                user.passwordHealth.weakPasswords,
                user.passwordHealth.reusedPasswords,
                user.passwordHealth.compromisedPasswords,
                user.authentication.type
            ]);
        });
    });

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'dashlane_portfolio_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const CSVDownload = ({ tenants }) => {
    return (
        <button
            onClick={() => downloadCSV(tenants)}
            className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export CSV
        </button>
    );
};
