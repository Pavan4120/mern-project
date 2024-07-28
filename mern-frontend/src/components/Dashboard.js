import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'; // Import your custom CSS file
import logo from './logo.avif'; // Adjust the path as necessary

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">          <img src={logo} alt="Logo" className="img-fluid" style={{ width: '30%' }}/> {/* Display the logo */}
        </Link>
        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav">
            {username && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Employee List</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-employee">Create Employee</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        {username && (
          <span className="navbar-text ml-auto d-flex align-items-center">
            <span className="username">{username}</span>
            <button onClick={handleLogout} className="btn btn-link logout-btn">Logout</button>
          </span>
        )}
      </nav>
      <div className="mt-4">
        {/* <h2>Welcome, {username}</h2> */}
        {/* <h3>Employee List</h3> */}
        <EmployeeList />
      </div>
    </div>
  );
};

export default Dashboard;
