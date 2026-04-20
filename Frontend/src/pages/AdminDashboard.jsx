import React, { useEffect, useState } from 'react';
import { getAdminStats, getAllUsers, deleteUser, updateUserRole } from '../api';
import { motion } from 'framer-motion';
import { FaUsers, FaChartLine, FaTrash, FaUserShield, FaUserCheck, FaUserMinus, FaDownload } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import FishBackground from '../components/FishBackground';
import ConfirmationModal from '../components/ConfirmationModal';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalPredictions: 0, userGrowth: [], speciesDistribution: [] });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'info', confirmText: 'Confirm' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsData, usersData] = await Promise.all([
                getAdminStats(),
                getAllUsers()
            ]);
            setStats(statsData);
            setUsers(usersData);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch admin data');
            setLoading(false);
        }
    };

    const handleExport = () => {
        const headers = ["Name,Email,Role,Date Joined,ID"];
        const rows = users.map(user =>
            `${user.name},${user.email},${user.role},${new Date(user.createdAt).toLocaleDateString()},${user._id}`
        );

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "aaides_users.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeleteClick = (id) => {
        setModal({
            isOpen: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Delete',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await deleteUser(id);
                    setUsers(prev => prev.filter(u => u._id !== id));
                    setModal(prev => ({ ...prev, isOpen: false }));
                } catch (err) {
                    setError('Failed to delete user');
                    setModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const handleRoleClick = (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const action = newRole === 'admin' ? 'Promote' : 'Demote';

        setModal({
            isOpen: true,
            title: `${action} User`,
            message: `Are you sure you want to ${action.toLowerCase()} this user?`,
            confirmText: action,
            type: newRole === 'admin' ? 'info' : 'danger',
            onConfirm: async () => {
                try {
                    const updatedUser = await updateUserRole(id, newRole);
                    setUsers(prev => prev.map(u => u._id === id ? updatedUser : u));
                    setModal(prev => ({ ...prev, isOpen: false }));
                } catch (err) {
                    setError(`Failed to ${action} user`);
                    setModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    if (loading) return <div className="text-white text-center mt-10">Loading Admin Dashboard...</div>;

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', position: 'relative' }}>
            <FishBackground />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <h1 style={{ color: 'white', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaUserShield /> Admin Dashboard
                </h1>

                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '10px', background: 'var(--accent-primary)', borderRadius: '10px' }}>
                                <FaUsers size={24} color="white" />
                            </div>
                            <div>
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Users</h3>
                                <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '10px', background: 'var(--accent-secondary)', borderRadius: '10px' }}>
                                <FaChartLine size={24} color="white" />
                            </div>
                            <div>
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Predictions</h3>
                                <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalPredictions}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {/* User Growth Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}
                    >
                        <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>User Registration Trend</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={stats.userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="_id" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Species Distribution Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}
                    >
                        <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Top Detected Species</h3>
                        {stats.speciesDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={stats.speciesDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                    >
                                        {stats.speciesDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No prediction data available</div>
                        )}
                    </motion.div>
                </div>

                {/* Users Table Header with Export */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'white', margin: 0 }}>User Management</h2>
                    <button
                        onClick={handleExport}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--accent-secondary)', border: 'none',
                            padding: '0.6rem 1.2rem', borderRadius: '8px',
                            color: 'white', cursor: 'pointer', fontWeight: 600
                        }}
                    >
                        <FaDownload /> Export CSV
                    </button>
                </div>

                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--glass-border)', overflowX: 'auto' }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Role</th>
                                <th style={{ padding: '1rem' }}>Date Joined</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{user.name}</td>
                                    <td style={{ padding: '1rem' }}>{user.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            background: user.role === 'admin' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                            fontSize: '0.8rem'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handleRoleClick(user._id, user.role)}
                                            style={{ background: 'none', border: 'none', color: user.role === 'admin' ? '#ef4444' : '#4ade80', cursor: 'pointer' }}
                                            title={user.role === 'admin' ? "Remove Admin" : "Make Admin"}
                                        >
                                            {user.role === 'admin' ? <FaUserMinus /> : <FaUserCheck />}
                                        </button>

                                        <button
                                            onClick={() => handleDeleteClick(user._id)}
                                            style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                                            title="Delete User"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>

            <ConfirmationModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
                confirmText={modal.confirmText}
                type={modal.type}
            />
        </div>
    );
};

export default AdminDashboard;
