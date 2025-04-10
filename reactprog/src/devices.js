import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './devices.css'
function DeviceList() {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axios.get('http://localhost:3000/device'); // Endpoint pour récupérer la liste des devices
                setDevices(response.data);
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };

        fetchDevices();
    }, []);

    return (
        <div className="Devices">
            <h1>Devices</h1>
            <ul className="device-list">
                {devices.map(device => (
                    <li key={device.id} className="device-item">
                        <h2>{device.name}</h2>
                        <p><strong>Type:</strong> {device.type}</p>
                        <p><strong>State:</strong> {device.state}</p>
                        <p><strong>Description:</strong> {device.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DeviceList;
