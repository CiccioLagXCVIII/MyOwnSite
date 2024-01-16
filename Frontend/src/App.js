import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Protect from './Componenti/Dashboard/Protected';
import PaginaProtetta from './Componenti/Dashboard/ProtectedPage';
import FormLogin from './Componenti/Form/FormLogin';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* La route /Login utilizza il componente FormLogin */}
        <Route path="/Login" element={<FormLogin />} />
        {/* La route /PaginaProtetta è protetta dal componente Protect */}
        <Route
          path="/ProtectedPage"
          element={<Protect component={<PaginaProtetta />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
