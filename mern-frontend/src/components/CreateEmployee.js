import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreateEmployee.css'; // Import your custom CSS file

const CreateEmployee = () => {
  const [employee, setEmployee] = useState({
    f_Image: '',
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: '',
    f_Gender: '',
    f_Course: []
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const newCourses = checked
        ? [...employee.f_Course, value]
        : employee.f_Course.filter(course => course !== value);
      setEmployee({ ...employee, f_Course: newCourses });
    } else {
      setEmployee({ ...employee, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.f_Email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!/^\d+$/.test(employee.f_Mobile)) {
      alert('Please enter a valid mobile number');
      return;
    }

    try {
      const formData = new FormData();
      for (const key in employee) {
        if (key === 'f_Course') {
          formData.append(key, JSON.stringify(employee[key]));
        } else {
          formData.append(key, employee[key]);
        }
      }
      await axios.post('http://localhost:5000/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">Create Employee</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formImage" className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" name="f_Image" onChange={(e) => setEmployee({ ...employee, f_Image: e.target.files[0] })} accept=".jpg,.png" required />
              </Form.Group>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="f_Name" value={employee.f_Name} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="f_Email" value={employee.f_Email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="formMobile" className="mb-3">
                <Form.Label>Mobile No</Form.Label>
                <Form.Control type="text" name="f_Mobile" value={employee.f_Mobile} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="formDesignation" className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control as="select" name="f_Designation" value={employee.f_Designation} onChange={handleChange} required>
                  <option value="">Select Designation</option>
                  <option value="HR">HR</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formGender" className="mb-3">
                <Form.Label>Gender</Form.Label>
                <div>
                  <Form.Check type="radio" label="Male" name="f_Gender" value="M" checked={employee.f_Gender === 'M'} onChange={handleChange} required inline />
                  <Form.Check type="radio" label="Female" name="f_Gender" value="F" checked={employee.f_Gender === 'F'} onChange={handleChange} required inline />
                </div>
              </Form.Group>
              <Form.Group controlId="formCourse" className="mb-3">
                <Form.Label>Course</Form.Label>
                <div>
                  <Form.Check type="checkbox" label="MCA" name="f_Course" value="MCA" checked={employee.f_Course.includes('MCA')} onChange={handleChange} inline />
                  <Form.Check type="checkbox" label="BCA" name="f_Course" value="BCA" checked={employee.f_Course.includes('BCA')} onChange={handleChange} inline />
                  <Form.Check type="checkbox" label="BSC" name="f_Course" value="BSC" checked={employee.f_Course.includes('BSC')} onChange={handleChange} inline />
                </div>
              </Form.Group>
              <Button variant="primary" type="submit" className="btn-block">Create</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateEmployee;
