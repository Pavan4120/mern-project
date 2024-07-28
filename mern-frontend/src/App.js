import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import your App.css for styling
import CreateEmployee from './components/CreateEmployee'; // Assuming you have a CreateEmployee component
import EditEmployee from './components/EditEmployee';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-employee" element={<ProtectedRoute><CreateEmployee /></ProtectedRoute>} />
        <Route path="/edit-employee/:id" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
