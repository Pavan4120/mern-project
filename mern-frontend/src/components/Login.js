import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './logo.avif'; // Adjust the path as necessary

const Login = () => {
  const [f_userName, setUsername] = useState('');
  const [f_Pwd, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { f_userName, f_Pwd });
      if (response.data.userName) {
        localStorage.setItem('username', response.data.userName);
        navigate('/dashboard');
      } else {
        alert('Invalid login details');
      }
    } catch (error) {
      alert('Invalid login details');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="img-fluid" style={{ width: '30%' }}/> {/* Display the logo */}
          </div>
          <div className="card">
            <div className="card-header text-center">
              <h3>Login</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="f_userName">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="f_userName"
                    value={f_userName}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="f_Pwd">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="f_Pwd"
                    value={f_Pwd}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
