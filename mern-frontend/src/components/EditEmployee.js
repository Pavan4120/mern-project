import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Image, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditEmployee.css'; // Import your custom CSS file

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/employees/${id}`)
      .then(response => {
        setEmployee(response.data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleImageChange = (e) => {
    setEmployee({ ...employee, f_Image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in employee) {
      formData.append(key, employee[key]);
    }

    axios.put(`http://localhost:5000/employees/${id}`, formData)
      .then(() => navigate('/dashboard'))
      .catch(error => console.error(error));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">Edit Employee</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formImage" className="mb-3">
                <Form.Label>Image</Form.Label>
                <Image src={`http://localhost:5000/${employee.f_Image}`} alt="employee" width="100" className="mb-2" />
                <Form.Control type="file" name="f_Image" onChange={handleImageChange} />
              </Form.Group>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="f_Name" value={employee.f_Name || ''} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="f_Email" value={employee.f_Email || ''} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formMobile" className="mb-3">
                <Form.Label>Mobile No</Form.Label>
                <Form.Control type="text" name="f_Mobile" value={employee.f_Mobile || ''} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formDesignation" className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control type="text" name="f_Designation" value={employee.f_Designation || ''} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formGender" className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Control type="text" name="f_Gender" value={employee.f_Gender || ''} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group controlId="formCourse" className="mb-3">
                <Form.Label>Course</Form.Label>
                <Form.Control type="text" name="f_Course" value={employee.f_Course || ''} onChange={handleInputChange} />
              </Form.Group>
              <Button variant="primary" type="submit" className="btn-block">Save Changes</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditEmployee;
