import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const FormLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    const formData = {
      email: email,
      password: password,
    };
  
    try {
      const response = await axios.post('http://localhost:5000/login', formData, { withCredentials: true });
      console.log("Client: Server Dice: ", response.data);
      console.log("Client:  Login Fatto");
  
      // Controlla se l'autenticazione è avvenuta con successo prima di reindirizzare
      if (response.data.authenticated) {
        navigate('/PaginaProtetta');
      } else {
        console.log('Form Login: Autenticazione non riuscita', response.data);
        // Puoi gestire ulteriori azioni qui in caso di autenticazione fallita
      }
    } catch (error) {
      console.log('Server Errore:', error);
      // Puoi gestire ulteriori azioni qui in caso di errore
    }
  };
  

  return (
    <Container fluid style={{ height: '100vh' }}>
      {/* Prima Row */}
      <Row style={{ backgroundColor: 'lightgreen', height: '15%' }}>
        <Col>
          <h2>Navbar</h2>
        </Col>
      </Row>

      {/* Seconda Row */}
      <Row className="d-flex justify-content-center align-items-center" style={{ height: '70%', padding:'5%', backgroundImage: 'linear-gradient(to bottom right, #726454, #e3cca4)' }}>
        <Col md={6} style={{ backgroundColor:'	#d6c2ac', border:'2px solid #fff099', borderRadius:'3%', padding:'5%', boxShadow: '8px 8px #b0a39c' }}>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formBasicEmail" style={{marginTop:'5%'}}>
              <Form.Label>Email address</Form.Label>
              <Form.Control style={{ backgroundColor:'#decfb9', border:'1px solid #fff099'}} type="email" placeholder="Enter email" value={email} onChange={handleEmailChange}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword" style={{marginTop:'5%'}}>
              <Form.Label>Password</Form.Label>
              <Form.Control style={{ backgroundColor:'#decfb9', border:'1px solid #fff099'}} type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
            </Form.Group>

            <Button type="submit" variant="outline-secondary" style={{ marginTop: '5%' }}>Login</Button>
          </Form>
        </Col>
      </Row>

      {/* Terza Row */}
      <Row style={{ backgroundColor: 'lightgreen', height: '15%' }}>
        <Col>
          <h2>Footer</h2>
        </Col>
      </Row>
    </Container>
  );
}

export default FormLogin;
