import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Calculator from './components/Calculator';
import ThemeStore from './components/ThemeStore';

function App() {
  return (
    <ThemeProvider>
      {/* 
        A LINHA MAIS IMPORTANTE DA CORREÇÃO ESTÁ AQUI:
        A prop 'basename' informa ao Router o caminho base da sua aplicação.
        Usar 'process.env.PUBLIC_URL' é a maneira correta, pois ele será 
        preenchido automaticamente com o valor do campo "homepage" do seu package.json 
        durante o build de produção.
      */}
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          {/* Agora o Router entenderá que esta rota é, na verdade, '.../CalculadoraDerivadaIntegral/' */}
          <Route path="/" element={<Calculator />} />
          
          {/* E esta rota é '.../CalculadoraDerivadaIntegral/store' */}
          <Route path="/store" element={<ThemeStore />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;