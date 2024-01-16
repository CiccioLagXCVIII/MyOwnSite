import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const Protect = ({ component: Component }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Funzione per verificare l'autenticazione
    const checkAuth = async () => {
      try {
        // Chiamata API per verificare l'autenticazione
        const response = await axios.get('http://localhost:5000/checkAuth', { withCredentials: true });
        console.log('CheckAuth Response:', response);
        // Se l'autenticazione è riuscita, imposta lo stato a true
        if (response.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Protect: Errore durante la verifica dell\'autenticazione', error.response);
        setAuthenticated(false);
      }
    };

    // Chiamare la funzione di verifica dell'autenticazione al caricamento del componente
    checkAuth();
  }, []);

  // Se l'autenticazione è avvenuta con successo, rendi il componente interno
  // Altrimenti, reindirizza a /Login
  return authenticated ? <Component /> : <Navigate to="/Login" />;
};

export default Protect;
