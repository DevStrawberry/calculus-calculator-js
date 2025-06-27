import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // Importa nosso provedor
import Calculator from './components/Calculator';
import ThemeStore from './components/ThemeStore'; // A nova página que vamos criar

function App() {
  return (
    // 1. Envolvemos tudo no ThemeProvider para que o estado do tema seja global
    <ThemeProvider>
      {/* 2. Envolvemos tudo no Router para habilitar a navegação */}
      <Router>
        <Routes>
          {/* Rota para a página principal (a calculadora) */}
          <Route path="/" element={<Calculator />} />
          
          {/* Rota para a nova página da loja de temas */}
          <Route path="/store" element={<ThemeStore />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;