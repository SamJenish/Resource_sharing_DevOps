import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await axios.get(`${API_BASE_URL}/api/users`);
        setUsers(res.data);
      } else if (activeTab === 'resources') {
        const res = await axios.get(`${API_BASE_URL}/api/resources`);
        setResources(res.data);
      } else if (activeTab === 'bookings') {
        const res = await axios.get(`${API_BASE_URL}/api/bookings`);
        setBookings(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;

    switch (activeTab) {
      case 'users':
        return (
          <div>
            <h2>Users</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'resources':
        return (
          <div>
            <h2>Resources</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(resource => (
                  <tr key={resource.id}>
                    <td>{resource.id}</td>
                    <td>{resource.name}</td>
                    <td>{resource.type}</td>
                    <td>{resource.available ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'bookings':
        return (
          <div>
            <h2>Bookings</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Resource ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.user_id}</td>
                    <td>{booking.resource_id}</td>
                    <td>{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Smart Resource Management System</h1>
      </header>
      <nav>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'resources' ? 'active' : ''}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </button>
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </nav>
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
