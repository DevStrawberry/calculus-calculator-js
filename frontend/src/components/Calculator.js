// frontend/src/components/Calculator.js (VERSÃO FINAL E COMPLETA)

import React, { useState, useEffect } from 'react';
import { performDerivativeAnalysis, performIntegralAnalysis, generateGraphData } from '../logic/calculatorEngine';
import FunctionGraph from './FunctionGraph';
import './Calculator.css';

function Calculator() {
    // --- ESTADOS PARA OS INPUTS ---
    const [operation, setOperation] = useState('derivative');
    const [expression, setExpression] = useState('x^3 - 3x');
    // Intervalo do Gráfico
    const [intervalStart, setIntervalStart] = useState('-2');
    const [intervalEnd, setIntervalEnd] = useState('2');
    // NOVOS ESTADOS PARA O INTERVALO DO PONTO CRÍTICO
    const [criticalStart, setCriticalStart] = useState('-10');
    const [criticalEnd, setCriticalEnd] = useState('10');
    // Inputs da Integral
    const [integralA, setIntegralA] = useState('0');
    const [integralB, setIntegralB] = useState('1');
    const [integralN, setIntegralN] = useState('1000');
    
    // --- ESTADOS PARA RESULTADOS, ERROS E GRÁFICO ---
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [graphData, setGraphData] = useState(null);

    // Efeito para gerar o gráfico quando a expressão ou o intervalo do GRÁFICO mudam
    useEffect(() => {
        const data = generateGraphData(expression, Number(intervalStart), Number(intervalEnd));
        setGraphData(data);
    }, [expression, intervalStart, intervalEnd]);

    // --- FUNÇÃO PARA CALCULAR ---
    const handleCalculate = () => {
        setResults(null);
        setError('');

        try {
            if (operation === 'derivative') {
                // USA OS NOVOS ESTADOS para a lógica de cálculo
                const derivativeResults = performDerivativeAnalysis(expression, Number(criticalStart), Number(criticalEnd));
                setResults({ type: 'derivative', data: derivativeResults });
            } else {
                const integralResults = performIntegralAnalysis(expression, Number(integralA), Number(integralB), Number(integralN));
                setResults({ type: 'integral', data: integralResults });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // --- FUNÇÕES PARA RENDERIZAR OS RESULTADOS ---
    const renderDerivativeResults = () => {
        if (!results || results.type !== 'derivative') return null;
        const { primeiraDerivada, segundaDerivada, pontosCriticos } = results.data;
        return (
            <>
                <p><strong>Primeira Derivada:</strong> f'(x) = {primeiraDerivada}</p>
                <p><strong>Segunda Derivada:</strong> f''(x) = {segundaDerivada}</p>
                <h3>Pontos Críticos</h3>
                {pontosCriticos && pontosCriticos.length > 0 ? (
                    <ul>
                        {pontosCriticos.map((ponto, index) => (
                            <li key={index}>{`Ponto: ${ponto.ponto}, Tipo: ${ponto.tipo}`}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum ponto crítico encontrado no intervalo.</p>
                )}
            </>
        );
    };

    const renderIntegralResults = () => {
        if (!results || results.type !== 'integral') return null;
        const data = results.data;
        return (
            <>
                <p><strong>Soma de Riemann (esquerda):</strong> {data.riemannEsquerda?.toFixed(6)}</p>
                <p><strong>Soma de Riemann (direita):</strong> {data.riemannDireita?.toFixed(6)}</p>
                <p><strong>Soma de Riemann (ponto médio):</strong> {data.riemannPontoMedio?.toFixed(6)}</p>
                <p><strong>Regra dos Trapézios:</strong> {data.trapezio?.toFixed(6)}</p>
                <p><strong>Regra de Simpson:</strong> {data.simpson?.toFixed(6)}</p>
            </>
        );
    };

    // --- A INTERFACE COMPLETA (JSX) ---
    return (
        <div className="calculator-container">
            <h1>Calculadora de Derivadas e Integrais</h1>
            
            <div className="operation-selection">
                <label><input type="radio" value="derivative" checked={operation === 'derivative'} onChange={(e) => setOperation(e.target.value)} /> Derivada</label>
                <label><input type="radio" value="integral" checked={operation === 'integral'} onChange={(e) => setOperation(e.target.value)} /> Integral</label>
            </div>

            <div className="input-group">
                <label htmlFor="expression">Função f(x) =</label>
                <input id="expression" type="text" value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="Use * para multiplicação, ex: 3*x" />
            </div>

            {operation === 'derivative' ? (
                <>
                    <div className="input-row">
                        <div className="input-group"><label>Início do Intervalo (Gráfico):</label><input type="number" value={intervalStart} onChange={(e) => setIntervalStart(e.target.value)} /></div>
                        <div className="input-group"><label>Fim do Intervalo (Gráfico):</label><input type="number" value={intervalEnd} onChange={(e) => setIntervalEnd(e.target.value)} /></div>
                    </div>
                    <div className="input-row">
                        <div className="input-group"><label>Início (Busca Ponto Crítico):</label><input type="number" value={criticalStart} onChange={(e) => setCriticalStart(e.target.value)} /></div>
                        <div className="input-group"><label>Fim (Busca Ponto Crítico):</label><input type="number" value={criticalEnd} onChange={(e) => setCriticalEnd(e.target.value)} /></div>
                    </div>
                </>
            ) : (
                <div className="input-row">
                    <div className="input-group"><label>Limite Inferior (a):</label><input type="number" value={integralA} onChange={(e) => setIntegralA(e.target.value)} /></div>
                    <div className="input-group"><label>Limite Superior (b):</label><input type="number" value={integralB} onChange={(e) => setIntegralB(e.target.value)} /></div>
                    <div className="input-group"><label>Intervalos (n):</label><input type="number" value={integralN} onChange={(e) => setIntegralN(e.target.value)} /></div>
                </div>
            )}
            
            <button onClick={handleCalculate} className="calculate-button">Calcular</button>

            <div className="graph-container">
                <FunctionGraph graphData={graphData} functionLabel={expression} />
            </div>

            <div className="result-display">
                {error && <p className="error-message">{error}</p>}
                {results && (
                    <>
                        <h2>Resultados Analíticos</h2>
                        {renderDerivativeResults()}
                        {renderIntegralResults()}
                    </>
                )}
            </div>
        </div>
    );
}

export default Calculator;