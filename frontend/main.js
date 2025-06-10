import { derivadaString, formatarDerivada } from './funcoes/derivada.js';
import { integralNumerica } from './funcoes/integral.js';
import { encontrar_pontos_criticos, classificar_ponto_critico } from './funcoes/ponto_critico.js';
import { avaliar } from './funcoes/avaliar.js';

let grafico = null;
let dadosGrafico = {
    funcaoOriginal: null,
    primeiraDerivada: null,
    segundaDerivada: null,
    pontosCriticos: []
};

// Função para alternar entre abas
window.switchTab = function(tabName) {
    // Remove active de todas as abas
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adiciona active na aba selecionada
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Limpa resultados ao trocar de aba
    document.getElementById('results').style.display = 'none';
    
    // Atualiza gráfico se necessário
    if (grafico) {
        grafico.destroy();
        grafico = null;
    }
};

// Função para processar string da função em termos
function processarFuncao(funcaoStr) {
    funcaoStr = funcaoStr.replace(/\s+/g, ''); // Remove espaços
    
    let termos = [];
    let inicio = 0;
    let dentro_parenteses = 0;
    
    for (let i = 0; i < funcaoStr.length; i++) {
        let char = funcaoStr[i];

        if (char === '(') {
            dentro_parenteses++;
        } else if (char === ')') {
            dentro_parenteses--;
        }
        
        if (i > 0 && dentro_parenteses === 0) {
            if ((char === '+' || char === '-') && funcaoStr[i-1] !== '^') {
                termos.push(funcaoStr.slice(inicio, i));
                inicio = i;
            }
        }
    }

    termos.push(funcaoStr.slice(inicio));
    
    // Filtra termos vazios
    termos = termos.filter(t => t.trim() !== '');
    
    return termos;
}

// Função para mostrar resultados
function mostrarResultados(conteudo) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = conteudo;
    resultsDiv.style.display = 'block';
}

// Função para mostrar erro
function mostrarErro(mensagem) {
    mostrarResultados(`<div class="error">${mensagem}</div>`);
}

// Função para calcular derivada
window.calcularDerivada = function() {
    const funcaoStr = document.getElementById('funcao-derivada').value.trim();
    const inicio = parseFloat(document.getElementById('inicio-intervalo').value);
    const fim = parseFloat(document.getElementById('fim-intervalo').value);
    
    if (!funcaoStr) {
        mostrarErro('Por favor, insira uma função.');
        return;
    }
    
    if (inicio >= fim) {
        mostrarErro('O início do intervalo deve ser menor que o fim.');
        return;
    }
    
    try {
        const termos = processarFuncao(funcaoStr);
        
        // Calcula derivadas
        const derivada = derivadaString(termos);
        const derivadaFormatada = formatarDerivada(derivada);
        
        const segunda_derivada = derivadaString(derivada);
        const segundaDerivadaFormatada = formatarDerivada(segunda_derivada);
        
        // Encontra pontos críticos
        const pontos_criticos = encontrar_pontos_criticos(derivada, inicio, fim);
        
        // Armazena dados para o gráfico
        dadosGrafico.funcaoOriginal = termos;
        dadosGrafico.primeiraDerivada = derivada;
        dadosGrafico.segundaDerivada = segunda_derivada;
        dadosGrafico.pontosCriticos = pontos_criticos;
        
        // Monta resultado
        let resultado = `
            <div class="result-item">
                <span class="result-label">Função Original:</span>
                <span class="result-value">f(x) = ${funcaoStr}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Primeira Derivada:</span>
                <span class="result-value">f'(x) = ${derivadaFormatada}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Segunda Derivada:</span>
                <span class="result-value">f''(x) = ${segundaDerivadaFormatada}</span>
            </div>
        `;
        
        if (pontos_criticos.length === 0) {
            resultado += `
                <div class="result-item">
                    <span class="result-label">Pontos Críticos:</span>
                    <span class="result-value">Nenhum encontrado no intervalo [${inicio}, ${fim}]</span>
                </div>
            `;
        } else {
            resultado += `<div class="result-item"><span class="result-label">Pontos Críticos:</span><span class="result-value"></span></div>`;
            
            const classificacao = classificar_ponto_critico(termos, pontos_criticos, segunda_derivada);
            classificacao.forEach(ponto => {
                resultado += `
                    <div class="result-item">
                        <span class="result-label">x = ${ponto.ponto.toFixed(6)}:</span>
                        <span class="result-value">${ponto.tipo} (f(x) = ${ponto.valor.toFixed(6)})</span>
                    </div>
                `;
            });
        }
        
        mostrarResultados(resultado);
        atualizarGrafico();
        
    } catch (error) {
        mostrarErro(`Erro ao processar a função: ${error.message}`);
    }
};

// Função para calcular integral
window.calcularIntegral = function() {
    const funcaoStr = document.getElementById('funcao-integral').value.trim();
    const a = parseFloat(document.getElementById('limite-inferior').value);
    const b = parseFloat(document.getElementById('limite-superior').value);
    const n = parseInt(document.getElementById('num-intervalos').value);
    
    if (!funcaoStr) {
        mostrarErro('Por favor, insira uma função.');
        return;
    }
    
    if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
        mostrarErro('Entradas inválidas para a, b ou n.');
        return;
    }
    
    if (a >= b) {
        mostrarErro('O limite inferior deve ser menor que o superior.');
        return;
    }
    
    try {
        const resultados = integralNumerica(funcaoStr, a, b, n);
        
        let resultado = `
            <div class="result-item">
                <span class="result-label">Função:</span>
                <span class="result-value">f(x) = ${funcaoStr}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Intervalo:</span>
                <span class="result-value">[${a}, ${b}]</span>
            </div>
            <div class="result-item">
                <span class="result-label">Intervalos:</span>
                <span class="result-value">${n}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Riemann (Esquerda):</span>
                <span class="result-value">${resultados.riemannEsquerda.toFixed(6)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Riemann (Direita):</span>
                <span class="result-value">${resultados.riemannDireita.toFixed(6)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Riemann (Ponto Médio):</span>
                <span class="result-value">${resultados.riemannPontoMedio.toFixed(6)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Regra dos Trapézios:</span>
                <span class="result-value">${resultados.trapezio.toFixed(6)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Regra de Simpson:</span>
                <span class="result-value">${resultados.simpson.toFixed(6)}</span>
            </div>
        `;
        
        mostrarResultados(resultado);
        
        // Atualiza dados para o gráfico
        dadosGrafico.funcaoOriginal = processarFuncao(funcaoStr);
        dadosGrafico.limiteInferior = a;
        dadosGrafico.limiteSuperior = b;
        
        atualizarGraficoIntegral();
        
    } catch (error) {
        mostrarErro(`Erro ao calcular integrais: ${error.message}`);
    }
};

// Função para atualizar gráfico de derivadas
window.atualizarGrafico = function() {
    if (!dadosGrafico.funcaoOriginal) return;
    
    const xMin = parseFloat(document.getElementById('x-min').value);
    const xMax = parseFloat(document.getElementById('x-max').value);
    
    const pontos = [];
    const step = (xMax - xMin) / 200;
    
    for (let x = xMin; x <= xMax; x += step) {
        try {
            const y = avaliar(dadosGrafico.funcaoOriginal, x);
            if (isFinite(y) && Math.abs(y) < 1000) {
                pontos.push({ x: x, y: y });
            }
        } catch (e) {
            // Ignora pontos problemáticos
        }
    }
    
    const datasets = [{
        label: 'f(x)',
        data: pontos,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1
    }];
    
    // Adiciona pontos críticos se existirem
    if (dadosGrafico.pontosCriticos.length > 0) {
        const pontosCriticosData = dadosGrafico.pontosCriticos.map(x => ({
            x: x,
            y: avaliar(dadosGrafico.funcaoOriginal, x)
        }));
        
        datasets.push({
            label: 'Pontos Críticos',
            data: pontosCriticosData,
            backgroundColor: '#e74c3c',
            borderColor: '#e74c3c',
            pointRadius: 6,
            type: 'scatter'
        });
    }
    
    criarGrafico(datasets, 'Função e Pontos Críticos');
};

// Função para atualizar gráfico de integrais
window.atualizarGraficoIntegral = function() {
    if (!dadosGrafico.funcaoOriginal) return;
    
    const xMin = parseFloat(document.getElementById('x-min-int').value);
    const xMax = parseFloat(document.getElementById('x-max-int').value);
    
    const pontos = [];
    const step = (xMax - xMin) / 200;
    
    for (let x = xMin; x <= xMax; x += step) {
        try {
            const y = avaliar(dadosGrafico.funcaoOriginal, x);
            if (isFinite(y) && Math.abs(y) < 1000) {
                pontos.push({ x: x, y: y });
            }
        } catch (e) {
            // Ignora pontos problemáticos
        }
    }
    
    const datasets = [{
        label: 'f(x)',
        data: pontos,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1
    }];
    
    // Adiciona área de integração se os limites estão definidos
    if (dadosGrafico.limiteInferior !== undefined && dadosGrafico.limiteSuperior !== undefined) {
        const areaData = [];
        const areaStep = (dadosGrafico.limiteSuperior - dadosGrafico.limiteInferior) / 50;
        
        for (let x = dadosGrafico.limiteInferior; x <= dadosGrafico.limiteSuperior; x += areaStep) {
            try {
                const y = avaliar(dadosGrafico.funcaoOriginal, x);
                if (isFinite(y)) {
                    areaData.push({ x: x, y: y });
                }
            } catch (e) {
                // Ignora pontos problemáticos
            }
        }
        
        datasets.push({
            label: 'Área de Integração',
            data: areaData,
            backgroundColor: 'rgba(46, 204, 113, 0.3)',
            borderColor: '#2ecc71',
            borderWidth: 1,
            fill: 'origin'
        });
    }
    
    criarGrafico(datasets, 'Função e Área de Integração');
};

// Função auxiliar para criar gráfico
function criarGrafico(datasets, titulo) {
    const ctx = document.getElementById('grafico').getContext('2d');
    
    if (grafico) {
        grafico.destroy();
    }
    
    grafico = new Chart(ctx, {
        type: 'line',
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: true,
                        text: 'x'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'f(x)'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 1
                }
            }
        }
    });
}