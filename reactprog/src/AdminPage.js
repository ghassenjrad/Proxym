// AdminPage.js (extrait pertinent)

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { getDecodedToken, isAdmin } from './utils/auth';
import { useHistory } from 'react-router-dom';

// Do not decode token at module load time; use helpers inside the component to allow
// reactive checks and avoid SSR/window issues.

function AdminPage() {
    const history = useHistory();
    const [devices, setDevices] = useState([]);
    const [adminStatus, setAdminStatus] = useState(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    // Récupérer la liste des devices
    const fetchDevices = async () => {
        try {
            const response = await axios.get('http://localhost:3000/device');
            setDevices(response.data);
        } catch (err) {
            console.error('Error fetching devices:', err);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    // Quick check to set admin status on mount
    useEffect(() => {
        try {
            const decoded = getDecodedToken();
            setAdminStatus(isAdmin());
            console.log('Decoded token (on mount):', decoded);
        } catch (err) {
            console.error('Error checking admin status:', err);
            setAdminStatus(false);
        }
    }, []);

        // Admin: fetch all reservations
        const [adminReservations, setAdminReservations] = useState([]);

        const fetchAdminReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await axios.get('http://localhost:3000/reservation/admin/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAdminReservations(response.data);
            } catch (err) {
                console.error('Error fetching admin reservations:', err);
            }
        };

        useEffect(() => {
            if (adminStatus) fetchAdminReservations();
        }, [adminStatus]);

        const handleUpdateReservationStatus = async (idRes, status) => {
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:3000/reservation/admin/status', { idRes, status }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchAdminReservations();
            } catch (err) {
                console.error('Error updating reservation status:', err);
            }
        };

    
    // Ajouter un device
    const handleAddDevice = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Récupère le token stocké
            console.log('Token:', token);
            if (!token) {
                setError('You must be logged in as admin.');
                return;
            }

            const response = await axios.post(
                'http://localhost:3000/device/devices',
                { name, type, state, description },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // ⚡ Le token JWT dans le header
                    }
                }
            );

            console.log('Device added:', response.data);
            fetchDevices(); // Refresh la liste après ajout
            setName('');
            setType('');
            setState('');
            setDescription('');
            setError('');
        } catch (err) {
            console.error('Error adding device:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Error adding device');
            } else {
                setError('Error adding device');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        history.push('/login');
    };

    // Supprimer un device
    const handleDeleteDevice = async (id) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            if (!token) {
                console.error('No token found');
                return;
            }
            await axios.delete(`http://localhost:3000/device/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDevices();
        } catch (err) {
            console.error('Error deleting device:', err);
        }
    };

    return (
        <div className="AdminPage">
            <header className="admin-header">
                <div className="admin-title">Admin Dashboard</div>
                <div className="admin-actions">
                    <button className="btn btn-ghost" onClick={() => setAdminStatus(isAdmin())}>Test Admin</button>
                    <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <div className="admin-grid">
                <aside>
                    <div className="card">
                        <h3>Devices</h3>
                        <form className="add-device-form" onSubmit={handleAddDevice}>
                            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <input placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
                            <input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-primary" type="submit">Add Device</button>
                                <button type="button" className="btn btn-ghost" onClick={fetchDevices}>Refresh</button>
                            </div>
                        </form>

                        {error && <p className="error">{error}</p>}

                        <div className="device-list">
                            {devices.map((device) => (
                                <div className="item" key={device.id}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{device.name}</div>
                                        <div style={{ fontSize: 12, color: '#6b7280' }}>{device.type} • {device.state}</div>
                                    </div>
                                    <div>
                                        <button className="btn btn-ghost" onClick={() => handleDeleteDevice(device.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main>
                    {adminStatus && (
                        <div className="card">
                            <h3>Reservations</h3>
                            <table className="reservations-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Device</th>
                                        <th>User</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminReservations.map((r) => (
                                        <tr key={r.idRes}>
                                            <td>{r.idRes}</td>
                                            <td>{r.device?.name}</td>
                                            <td>{r.user?.name || r.user?.email}</td>
                                            <td>{new Date(r.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(r.endDate).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-badge ${r.status === 'Pending' ? 'status-pending' : r.status === 'Accepted' ? 'status-accepted' : 'status-rejected'}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-primary" onClick={() => handleUpdateReservationStatus(r.idRes, 'Accepted')}>Accept</button>
                                                <button className="btn btn-danger" style={{ marginLeft: 8 }} onClick={() => handleUpdateReservationStatus(r.idRes, 'Rejected')}>Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AdminPage;
