import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

// Constants
import { API_BASE_URL } from '../constants';
import Icon from './Icon';

// Utility functions
const getUserRole = (role) => {
    if (role.teamAdmin) return 'Admin';
    if (role.groupManager) return 'Group Manager';
    if (role.billingAdmin) return 'Billing Admin';
    return 'User';
};

const getScoreColor = (score) => {
    if (score >= 0.8) return 'green';
    if (score >= 0.6) return 'orange';
    return 'red';
};

const TeamView = ({ dashlaneInfo, token }) => {
    // Use the pre-fetched dashlaneInfo so we don't fetch main data again
    // But we need 'api' for the Drill-down (user devices).

    const [userDevices, setUserDevices] = useState(null);
    const [activeUser, setActiveUser] = useState(null);

    useEffect(() => {
        // Reset selection when switching teams
        setUserDevices(null);
        setActiveUser(null);
    }, [dashlaneInfo]);

    useEffect(() => {
        const fetchUserDevice = async () => {
            if (!activeUser || !token) return;

            const api = axios.create({
                baseURL: API_BASE_URL,
                headers: { Authorization: `Bearer ${token}` }
            });

            try {
                console.log(`Fetching devices for ${activeUser} with token ending in ...${token.slice(-4)}`);
                const response = await api.post('/MembersDeviceInformation', {
                    emails: [activeUser]
                });
                console.log("Device response:", response.data);
                setUserDevices(response.data.data.devices);
            } catch (error) {
                console.error('Failed to fetch user devices:', error);
                alert("Failed to fetch devices. Check console for details.");
            }
        };

        fetchUserDevice();
    }, [activeUser, token]);

    if (!dashlaneInfo) return <div>Loading...</div>;

    return (
        <div className="flex animate-fade-in w-full">
            <div className="flex w-full">
                <div className="flex-grow overflow-x-hidden overflow-auto flex flex-wrap content-start p-2">
                    <UsersInfo users={dashlaneInfo.users} setActiveUser={setActiveUser} />
                    <ScoreDetails healthscore={dashlaneInfo.healthscore} />
                    <div className="flex flex-wrap lg:w-1/2 w-full">
                        <SeatsTaken team={dashlaneInfo.team} />
                        <PendingInvitations team={dashlaneInfo.team} />
                        <DevicesInfo userDevices={userDevices} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserDevice = ({ device }) => (
    <tr className="hover:bg-white/5 transition-colors">
        <td className="px-6 py-4">
            <div className="user__info">
                <div className="name">
                    <p>{device.name}</p>
                    <span className="type type--invited">{device.platform}</span>
                </div>
            </div>
        </td>
        <td className="px-6 py-4"><p className="user__metric">{device.appVersion || "-"}</p></td>
        <td className="px-6 py-4"><p className="user__metric">{device.model || "-"}</p></td>
        <td className="px-6 py-4"><p className="user__metric">{device.osVersion || "-"}</p></td>
    </tr>
);

const DevicesInfo = ({ userDevices }) => {
    if (!userDevices) {
        return (
            <div className="p-3 lg:w-full w-full">
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center min-h-[200px] text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-center">Click on the <span className="inline-block bg-slate-700 p-1 rounded mx-1"><Icon name="action" /></span> next to a user to see their Device information</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 lg:w-full w-full">
            <div className="glass-panel p-6 rounded-2xl">
                <table className="users__table w-full text-left">
                    <thead className="bg-gray-800/50 text-xs uppercase text-gray-400">
                        <tr>
                            <th className="px-6 py-3 font-medium">Device</th>
                            <th className="px-6 py-3 font-medium">Dashlane version</th>
                            <th className="px-6 py-3 font-medium">Device Model</th>
                            <th className="px-6 py-3 font-medium">Device OS version</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {userDevices.map((device, i) => (
                            <UserDevice key={i} device={device} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UserProfile = ({ user, setActiveUser }) => {
    const auth_type = user.authentication.type === "email_token" ? "Email token" : "-";
    const status = user.status === 'accepted' ? 'Dashlane user' : user.status;
    const role = getUserRole(user.role);

    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4">
                <div className="user__info">
                    <div className="name">
                        <p className="text-gray-200">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`type ${user.status === 'accepted' ? 'type--invited' : 'type--not_invited'}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4"><p className="user__metric user__metric--score">{user.passwordHealth.score || "-"}</p></td>
            <td className="px-6 py-4"><p className="user__metric user__metric--weak">{user.passwordHealth.weakPasswords || "-"}</p></td>
            <td className="px-6 py-4"><p className="user__metric user__metric--compromised">{user.passwordHealth.compromisedPasswords || "-"}</p></td>
            <td className="px-6 py-4"><p className="user__metric">{auth_type}</p></td>
            <td className="px-6 py-4"><p className="user__metric">{user.lastActivity || "-"}</p></td>
            <td className="px-6 py-4"><p className="user__metric">{role}</p></td>
            <td className="px-6 py-4">
                {user.status === 'accepted' && (
                    <button className="user__button hover:bg-cyan-600 transition-colors" onClick={() => setActiveUser(user.email)}>
                        <Icon name="action" />
                    </button>
                )}
            </td>
        </tr>
    );
};

const UsersInfo = ({ users, setActiveUser }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const sortedMembers = React.useMemo(() => {
        let sortableItems = [...users.members];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'email':
                        aValue = a.email.toLowerCase();
                        bValue = b.email.toLowerCase();
                        break;
                    case 'status':
                        aValue = a.status;
                        bValue = b.status;
                        break;
                    case 'score':
                        aValue = a.passwordHealth.score || 0;
                        bValue = b.passwordHealth.score || 0;
                        break;
                    case 'weak':
                        aValue = a.passwordHealth.weakPasswords || 0;
                        bValue = b.passwordHealth.weakPasswords || 0;
                        break;
                    case 'compromised':
                        aValue = a.passwordHealth.compromisedPasswords || 0;
                        bValue = b.passwordHealth.compromisedPasswords || 0;
                        break;
                    case 'auth':
                        aValue = a.authentication.type;
                        bValue = b.authentication.type;
                        break;
                    case 'role':
                        aValue = getUserRole(a.role);
                        bValue = getUserRole(b.role);
                        break;
                    default:
                        return 0;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [users.members, sortConfig]);

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
        <div className="p-3 lg:w-full w-full">
            <div className="glass-panel p-6 rounded-2xl">
                <h2>Users</h2>
                <div className="overflow-x-auto">
                    <table className="users__table w-full text-left">
                        <thead className="bg-gray-800/50 text-xs uppercase text-gray-400">
                            <tr>
                                <th onClick={() => requestSort('email')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">
                                    Email {getSortIndicator('email')}
                                </th>
                                <th onClick={() => requestSort('status')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">
                                    Status {getSortIndicator('status')}
                                </th>
                                <th onClick={() => requestSort('score')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">
                                    Health Score {getSortIndicator('score')}
                                </th>
                                <th onClick={() => requestSort('weak')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">
                                    Weak {getSortIndicator('weak')}
                                </th>
                                <th onClick={() => requestSort('compromised')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">
                                    Compromised {getSortIndicator('compromised')}
                                </th>
                                <th onClick={() => requestSort('auth')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">
                                    Authentication {getSortIndicator('auth')}
                                </th>
                                <th className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">
                                    Last Active
                                </th>
                                <th onClick={() => requestSort('role')} className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors select-none">
                                    Role {getSortIndicator('role')}
                                </th>
                                <th className="px-6 py-3 font-medium">Devices</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {sortedMembers.map((user, i) => (
                                <UserProfile key={i} user={user} setActiveUser={setActiveUser} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SeatsTaken = ({ team }) => (
    <div className="p-3 lg:w-1/2 w-full">
        <div className="glass-panel p-6 rounded-2xl card-small">
            <h3>Seats taken</h3>
            <h3>Seats taken</h3>
            <div className="metric__highlight mb-3">
                <p className="metric__highlight-text text-gray-200">
                    {team.seats.active}/{team.seats.remaining + team.seats.active}
                </p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden relative border border-gray-600">
                <div
                    className="bg-primary h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                    style={{ width: `${(team.seats.active / (team.seats.remaining + team.seats.active)) * 100}%` }}
                >
                </div>
            </div>
        </div>
    </div>
);

const PendingInvitations = ({ team }) => (
    <div className="p-3 lg:w-1/2 w-full">
        <div className="glass-panel p-6 rounded-2xl card-small">
            <h3>Pending invitations</h3>
            <div className="metric__highlight">
                <p className="metric__highlight-text text-gray-200">{team.seats.pending}</p>
            </div>
        </div>
    </div>
);

const CustomizedAxisTick = ({ x, y, index, payload }) => {
    const label = payload.value || 'Now';
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={8}
                textAnchor={label === 'Now' ? "end" : "start"}
                fill="#94a3b8"
                fontSize={11}
            >
                {label}
            </text>
        </g>
    );
};

const ScoreDetails = ({ healthscore }) => (
    <div className="p-3 lg:w-1/2 w-full">
        <div className="glass-panel p-6 rounded-2xl min-h-[400px]">
            <div className="flex flex-col">
                <h2>Password Health Score details</h2>
                <div className="graph_label mb-4">Company score over time</div>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthscore}>
                        <CartesianGrid
                            horizontal={true}
                            vertical={false}
                            strokeWidth="1"
                            stroke="rgba(255, 255, 255, 0.1)"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={8}
                            tick={<CustomizedAxisTick />}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickMargin={8}
                            domain={[0, 100]}
                            tickCount={6}
                            stroke="#94a3b8"
                            fontSize={11}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#06b6d4"
                            strokeWidth="2"
                            dot={{ r: 2, fill: '#06b6d4', strokeWidth: 0 }}
                            activeDot={{ r: 4, fill: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="divider my-6 border-t border-gray-700/50" />
            <HealthScoreDetails healthscore={healthscore} />
        </div>
    </div>
);

const HealthScoreDetails = ({ healthscore }) => {
    const currentScore = healthscore[healthscore.length - 1];
    const score = currentScore.score / 100;
    const scoreColor = getScoreColor(score);

    return (
        <div className="flex flex-col md:flex-row score__details gap-6">
            <div className="details__metric-score flex items-center gap-4">
                <div>
                    <h4 className="text-gray-400 text-xs uppercase font-semibold mb-1">Health Score</h4>
                    <div className="flex items-center gap-2">
                        <span className={`text--${scoreColor}`}><Icon name="score" /></span>
                        <p className="text-4xl font-bold text-white">{score.toLocaleString("en", { style: "percent" })}</p>
                    </div>
                </div>
            </div>
            <div className="divider -vertical hidden md:block border-l border-gray-700/50 mx-4" />
            <div className="details__metrics grid grid-cols-2 md:grid-cols-5 gap-4 flex-grow">
                <div className="detail">
                    <h4 className="text-gray-400 text-xs uppercase font-semibold mb-1">Total logins</h4>
                    <p className="text-xl font-bold text-white">{currentScore.passwordsTotal}</p>
                </div>
                <div className="detail">
                    <h4 className="text-gray-400 text-xs uppercase font-semibold mb-1">Safe</h4>
                    <p className="text-xl font-bold text-success">{currentScore.safe}</p>
                </div>
                <div className="detail">
                    <h4 className="text-gray-400 text-xs uppercase font-semibold mb-1">Weak</h4>
                    <p className="text-xl font-bold text-warning">{currentScore.weak}</p>
                </div>
                <div className="detail">
                    <h4 className="text-gray-400 text-xs uppercase font-semibold mb-1">Reused</h4>
                    <p className="text-xl font-bold text-warning">{currentScore.reused}</p>
                </div>
                <div className="detail">
                    <h4 className="text-gray-400 text-xs uppercase font-semibold mb-1">Compromised</h4>
                    <p className="text-xl font-bold text-danger">{currentScore.compromised}</p>
                </div>
            </div>
        </div>
    );
};



export default TeamView;
