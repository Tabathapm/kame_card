import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AutenticacionProvider, useAuth } from './contexts/AuthContext';
import { PaginaAutenticacion } from './components/auth/AuthPage';
import { TableroJuego } from './components/juego/TableroJuego';
import { LoadingSpinner } from './components/LoadingSpinner';

const AppContent: React.FC = () => {
  const { autenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return autenticado ? <TableroJuego /> : <PaginaAutenticacion />;
};

function App() {
  return (
    <Router>
      <AutenticacionProvider>
        <AppContent />
      </AutenticacionProvider>
    </Router>
  );
}

export default App;