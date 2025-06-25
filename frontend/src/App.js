// src/App.js
import React from 'react';
import './App.css'; // Pode manter ou limpar, dependendo da sua necessidade
import Calculator from './components/Calculator'; // Importa o componente da calculadora

function App() {
  return (
    <div className="App">
      <Calculator /> {/* Renderiza sua calculadora aqui */}
    </div>
  );
}

export default App;