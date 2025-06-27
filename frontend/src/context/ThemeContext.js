import React, { createContext, useState, useEffect } from 'react';

// 1. Cria o Context
export const ThemeContext = createContext();

// 2. Cria o Provedor (um componente que vai "envolver" sua aplicação)
export const ThemeProvider = ({ children }) => {
    // A lógica de estado que antes estava em Calculator.js agora vive aqui.
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // O valor que será compartilhado com todos os componentes filhos
    const value = { theme, setTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};