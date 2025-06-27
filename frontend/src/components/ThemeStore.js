import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import './ThemeStore.css';

// Lista de temas disponíveis. Você pode expandir isso facilmente.
const themes = [
    { id: 'light', name: 'Claro (Padrão)', colors: ['#f4f7f9', '#ffffff', '#007bff'] },
    { id: 'dark', name: 'Escuro (Padrão)', colors: ['#121212', '#1e1e1e', '#0d6efd'] },
    { id: 'pokedex', name: 'Pokédex', colors: ['#d32f2f', '#dcdcdc', '#00bcd4'] },
    { id: 'oceanic', name: 'Oceânico', colors: ['#e0f7fa', '#ffffff', '#00838f'] },
    { id: 'sunset', name: 'Pôr do Sol', colors: ['#fff3e0', '#ffffff', '#ff6f00'] },
];

function ThemeStore() {
    // Usamos o useContext para acessar a função 'setTheme' do nosso estado global
    const { setTheme } = useContext(ThemeContext);

    return (
        <div className="theme-store-container">
            <h1>Loja de Temas</h1>
            <p>Selecione um tema para personalizar sua experiência.</p>
            
            <div className="theme-list">
                {themes.map((theme) => (
                    <div key={theme.id} className="theme-card" onClick={() => setTheme(theme.id)}>
                        <h3>{theme.name}</h3>
                        <div className="theme-preview">
                            {theme.colors.map((color, index) => (
                                <div key={index} className="color-swatch" style={{ backgroundColor: color }}></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Link to="/" className="back-link">
                ← Voltar para a Calculadora
            </Link>
        </div>
    );
}

export default ThemeStore;