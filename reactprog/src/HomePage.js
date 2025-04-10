import React, { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import logoIMG from '../src/media/logo.svg';

function HomePage() {
  const [devices, setDevices] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [activeTab, setActiveTab] = useState('devices');
  const [showReserveForm, setShowReserveForm] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const history = useHistory();

  const [popupOpen, setPopupOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);;


  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/device');
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setIsLoadingDevices(false);
      }
    };

    fetchDevices();
  }, []);

  const fetchUserReservations = async () => {
    try {
      setIsLoadingReservations(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      console.log('Token:', token);

      const response = await axios.get('http://localhost:3000/reservation/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserReservations(response.data);
    } catch (error) {
      console.error('Error fetching user reservations:', error);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const handleShowReservations = () => {
    setActiveTab('reservations');
    fetchUserReservations();
  };

  const handleShowDevices = () => {
    setActiveTab('devices');
  };

  const handleReserveClick = (device) => {
    setSelectedDevice(device);
    setShowReserveForm(true);
  };

  const handleReserveConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const { sub: userId } = jwtDecode(token);

      await axios.post('http://localhost:3000/reservation/create', {
        userId,
        deviceId: selectedDevice.id,
        startDate: dateRange[0],
        endDate: dateRange[1],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Reservation confirmed!');
      setShowReserveForm(false);
      setDateRange([new Date(), new Date()]);
      setSelectedDevice(null);
    } catch (error) {
      console.error('Error confirming reservation:', error);
      alert('Device already booked. Please change the date.');
    }
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const handleOverlayClick = () => {
    setShowReserveForm(false);
  };



  const handleCancelClick = (reservationId) => {
    setReservationToCancel(reservationId);
    setPopupOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/reservation/cancel', {
        userId: jwtDecode(token).sub,
        idRes: reservationToCancel,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUserReservations();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      alert('Failed to cancel the reservation.');
    } finally {
      setPopupOpen(false);
    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleChangeClick = (reservation) => {
    setSelectedReservation(reservation);
    setDateRange([new Date(reservation.startDate), new Date(reservation.endDate)]);
    setShowChangeForm(true);
  };

  const handleChangeConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const { sub: userId } = jwtDecode(token);

      await axios.put('http://localhost:3000/reservation/modifier', {
        userId,
        idRes: selectedReservation.idRes,
        deviceId: selectedReservation.device.id,
        newStartDate: dateRange[0],
        newEndDate: dateRange[1],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Reservation changed!');
      setShowChangeForm(false);
      setDateRange([new Date(), new Date()]);
      setSelectedReservation(null);
      fetchUserReservations();
    } catch (error) {
      console.error('Error changing reservation:', error);
      alert('Failed to change the reservation.');
    }
  };


  return (
    <div className="HomePage">
      <aside className="Aside">
        <a href="/home">
          <img src={logoIMG} alt="" />
        </a>
        <h2 className='Dashtitle'>Device Loan Dashboard</h2>
        <ul>
          <li className={activeTab === 'devices' ? 'active' : ''} onClick={handleShowDevices}>
            <svg data-id="8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2"><rect width="14" height="8" x="5" y="2" rx="2"></rect><rect width="20" height="8" x="2" y="14" rx="2"></rect><path d="M6 18h2"></path><path d="M12 18h6"></path></svg>
            <br />
            All Devices
          </li>
          <li className={activeTab === 'reservations' ? 'active' : ''} onClick={handleShowReservations}>
            <svg data-id="10" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
            <br />
            My Reservations
          </li>
          <li onClick={handleLogout}>
            <svg data-id="13" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
            <br />
            Logout
          </li>
        </ul>
      </aside>
      <main className="MainContent">
        <div className="Content">
          {activeTab === 'devices' && (
            <div className="DeviceTable">
              <h2>Available Devices</h2>
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Model</th>
                    <th>Platform</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.id}>
                      <td>{device.id}</td>
                      <td>{device.name}</td>
                      <td>{device.type}</td>
                      <td>
                        <button onClick={() => handleReserveClick(device)}>Book</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showReserveForm && (
                <div className="Overlay" onClick={handleOverlayClick}>
                  <div className="ReserveForm" onClick={(e) => e.stopPropagation()}>
                    <h2>Book {selectedDevice?.name}</h2>
                    <Calendar
                      selectRange
                      onChange={handleDateChange}
                      value={dateRange}
                    />
                    <div className="ButtonGroup">
                      <button onClick={handleReserveConfirm}>Confirm</button>
                      <button className="cancel" onClick={() => setShowReserveForm(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'reservations' && (
            <div className="ReservationList">
              <h2>My Reservations</h2>
              {isLoadingReservations ? (
                <p>Loading reservations...</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Reservation ID</th>
                      <th>Device Name</th>
                      <th>Device Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userReservations.map((reservation) => (
                      <tr key={reservation.idRes}>
                        <td>{reservation.idRes}</td>
                        <td>{reservation.device.name}</td>
                        <td>{reservation.device.type}</td>
                        <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
                        <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
                        <td>{reservation.status}</td>
                        <td>
                          <button className='ChangerReservationButton' onClick={() => handleChangeClick(reservation)}>Change</button>
                          <button className='CancelReservationButton' onClick={() => handleCancelClick(reservation.idRes)}>Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {popupOpen && (
            <div className="confirmation-popup-overlay" onClick={handleClosePopup}>
              <div className="confirmation-popup" onClick={(e) => e.stopPropagation()}>
                <h3>Are you sure you want to cancel this reservation?</h3>
                <div className="confirmation-buttons">
                  <button className="confirm-btn" onClick={handleConfirmCancel}>Confirm</button>
                  <button className="cancel-btn" onClick={handleClosePopup}>No</button>
                </div>
              </div>
            </div>
          )}

          {showChangeForm && (
            <div className="Overlay" onClick={handleOverlayClick}>
              <div className="ReserveForm" onClick={(e) => e.stopPropagation()}>
                <h2>Change Reservation for {selectedReservation?.device.name}</h2>
                <Calendar
                  selectRange
                  onChange={handleDateChange}
                  value={dateRange}
                />
                <div className="ButtonGroup">
                  <button onClick={handleChangeConfirm}>Confirm</button>
                  <button className="cancel" onClick={() => setShowChangeForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {popupOpen && (
            <div className="Overlay" onClick={handleOverlayClick}>
              <div className="Popup" onClick={(e) => e.stopPropagation()}>
                <div className="ButtonGroup">
                  <button className="confirm" onClick={handleConfirmCancel}>Confirm</button>
                  <button className="cancel" onClick={handleClosePopup}>No</button>
                </div>
              </div>
            </div>
          )}


        </div>
      </main>
    </div>
  );
}

export default HomePage;
