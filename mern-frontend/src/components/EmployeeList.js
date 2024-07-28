import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(5); // Items per page for pagination
  const [sortConfig, setSortConfig] = useState({ key: 'f_Name', direction: 'ascending' });
  const [totalEmployees, setTotalEmployees] = useState(0);

  const fetchEmployees = useCallback(async () => {
    const response = await axios.get('http://localhost:5000/employees', {
      params: {
        search,
        sort: sortConfig.key,
        order: sortConfig.direction,
        page: activePage,
        limit: itemsPerPage
      }
    });
    setEmployees(response.data.employees);
    setTotalEmployees(response.data.total);
  }, [search, sortConfig, activePage, itemsPerPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/employees/${id}`)
      .then(() => fetchEmployees())
      .catch(error => console.error(error));
  };

  const handleToggleActive = (id) => {
    const employee = employees.find(emp => emp.f_Id === id);
    axios.put(`http://localhost:5000/employees/${id}`, { f_Active: !employee.f_Active })
      .then(() => fetchEmployees())
      .catch(error => console.error(error));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalEmployees / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <Pagination>
        {pageNumbers.map(number => (
          <Pagination.Item key={number} active={number === activePage} onClick={() => setActivePage(number)}>
            {number}
          </Pagination.Item>
        ))}
      </Pagination>
    );
  };

  return (
    <div>
      <Form.Group controlId="formSearch">
        <Form.Control type="text" placeholder="Search" value={search} onChange={handleSearch} />
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('f_Name')}>Name</th>
            <th onClick={() => handleSort('f_Email')}>Email</th>
            <th onClick={() => handleSort('f_Mobile')}>Mobile</th>
            <th onClick={() => handleSort('f_Designation')}>Designation</th>
            <th onClick={() => handleSort('f_Gender')}>Gender</th>
            <th onClick={() => handleSort('f_Course')}>Course</th>
            <th onClick={() => handleSort('f_CreateDate')}>Date</th>
            <th>Image</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee._id}>
                <td>
                <img src={`http://localhost:5000/${employee.f_Image}`} alt={employee.f_Name} style={{ width: '50px', height: '50px' }} />
              </td>
              <td>{employee.f_Name}</td>
              <td>{employee.f_Email}</td>
              <td>{employee.f_Mobile}</td>
              <td>{employee.f_Designation}</td>
              <td>{employee.f_Gender}</td>
              <td>{employee.f_Course}</td>
              <td>{new Date(employee.f_CreateDate).toLocaleDateString()}</td>
              <td>
                <Button 
                  variant={employee.f_Active ? 'success' : 'secondary'} 
                  onClick={() => handleToggleActive(employee.f_Id)}
                >
                  {employee.f_Active ? 'Active' : 'Inactive'}
                </Button>
              </td>
              <td>
                <Link to={`/edit-employee/${employee.f_Id}`} className="btn btn-primary">Edit</Link>
                <Button variant="danger" onClick={() => handleDelete(employee.f_Id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {renderPagination()}
    </div>
  );
};

export default EmployeeList;
