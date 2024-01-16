import React from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class FormRegistrazione extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nome: '',
      cognome: '',
      email: '',
      password: '',
    };
  }

  handleNomeChange = (event) => {
    const { value } = event.target;
    this.setState({ nome: value });
  };

  handleCognomeChange = (event) => {
    const { value } = event.target;
    this.setState({ cognome: value });
  };
  
  handleEmailChange = (event) => {
    const { value } = event.target;
    this.setState({ email: value });
  };
  
  handlePasswordChange = (event) => {
    const { value } = event.target;
    this.setState({ password: value });
  };
  

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      nome: this.state.nome,
      cognome: this.state.cognome,
      email: this.state.email,
      password: this.state.password,
    };

    try {
      const response = await axios.post('http://localhost:5000/registrazione', formData); //formData è un oggetto con chiavi 'nome', 'cognome', 'email', e 'password'.
      console.log('Server Dice:', response.data);
    } catch (error) {
      console.error('Errore durante la richiesta al server:', error);
    }
  };

  render() {
    return (
      <Container fluid style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Prima Row */}
        <Row style={{ backgroundColor: 'lightgreen', height: '15%' }}>
          <Col>
            <h2>Navbar</h2>
          </Col>
        </Row>

        {/* Seconda Row */}
        <Row className="justify-content-center align-items-center" style={{ flex: 1, padding: '5%', backgroundImage: 'linear-gradient(to bottom right, #726454, #e3cca4)' }}>
          <Col md={6} style={{ border: '2px solid #fff099', borderRadius: '3%', padding: '5%', boxShadow: '8px 8px #b0a39c', height: '100%' }}>
            <Form style={{ height: '90%' }} onSubmit={this.handleFormSubmit}>
              <Form.Group style={{ marginTop: '5%' }}>
                <Form.Label>Nome</Form.Label>
                <Form.Control style={{ backgroundColor: '#decfb9', border: '1px solid #fff099' }} placeholder="Nome" name="nome" value={this.state.nome} onChange={this.handleNomeChange} />
              </Form.Group>

              <Form.Group style={{ marginTop: '5%' }}>
                <Form.Label>Cognome</Form.Label>
                <Form.Control style={{ backgroundColor: '#decfb9', border: '1px solid #fff099' }} placeholder="Cognome" name="cognome" value={this.state.cognome} onChange={this.handleCognomeChange}/>
              </Form.Group>

              <Form.Group style={{ marginTop: '5%' }}>
                <Form.Label>E-Mail</Form.Label>
                <Form.Control style={{ backgroundColor: '#decfb9', border: '1px solid #fff099' }} type="email" placeholder="Enter email" name="email" value={this.state.email} onChange={this.handleEmailChange}/>
              </Form.Group>

              <Form.Group style={{ marginTop: '5%' }}>
                <Form.Label>Password</Form.Label>
                <Form.Control style={{ backgroundColor: '#decfb9', border: '1px solid #fff099' }} type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handlePasswordChange}/>
              </Form.Group>

              <Button type="submit" variant="outline-secondary" style={{ marginTop: '5%' }}>Registrazione</Button>
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
}

export default FormRegistrazione;
