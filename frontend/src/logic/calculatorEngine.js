// frontend/src/logic/calculatorEngine.js

// TODOS os imports devem estar aqui no topo, juntos.
import { derivadaString, formatarDerivada } from "./funcoes/derivada.js";
import { integralNumerica } from "./funcoes/integral.js";
import { encontrar_pontos_criticos, classificar_ponto_critico } from "./funcoes/ponto_critico.js";
import { create, all } from 'mathjs'; // <<< A LINHA PROBLEMÁTICA FOI MOVIDA PARA CÁ

// ------------------- O RESTO DO CÓDIGO COMEÇA AQUI -------------------

const math = create(all);

// Esta função de parsing é ótima! Vamos mantê-la.
function parseFunctionString(funcao) {
    if (!funcao) return [];
    
    funcao = funcao.replace(/\s+/g, ''); // Remove espaços

    let termos = [];
    let inicio = 0;
    let dentro_parenteses = 0;
    
    for (let i = 0; i < funcao.length; i++) {
        let char = funcao[i];

        if (char === '(') {
            dentro_parenteses++;
        } else if (char === ')') {
            dentro_parenteses--;
        }
        if (i > 0 && dentro_parenteses === 0) {
            if ((char === '+' || char === '-') && funcao[i-1] !== '^') {
                termos.push(funcao.slice(inicio, i));
                inicio = i;
            }
        }
    }
    termos.push(funcao.slice(inicio));
    
    return termos.filter(t => t.trim() !== '');
}

// Função "controladora" para a análise de derivadas.
export function performDerivativeAnalysis(funcao, inicioIntervalo, fimIntervalo) {
    // Validação de inputs
    if (!funcao) {
        throw new Error("A função não pode estar vazia.");
    }
    if (inicioIntervalo >= fimIntervalo) {
        throw new Error("O início do intervalo deve ser menor que o fim.");
    }

    const termos = parseFunctionString(funcao);
    if (termos.length === 0) {
        throw new Error("Não foi possível interpretar a função. Verifique a sintaxe.");
    }
    
    // Calcula as derivadas
    const primeiraDerivadaTermos = derivadaString(termos);
    const primeiraDerivadaFormatada = formatarDerivada(primeiraDerivadaTermos);
    
    const segundaDerivadaTermos = derivadaString(primeiraDerivadaTermos);
    const segundaDerivadaFormatada = formatarDerivada(segundaDerivadaTermos);

    // Encontra e classifica pontos críticos
    const pontosCriticosNumericos = encontrar_pontos_criticos(primeiraDerivadaTermos, inicioIntervalo, fimIntervalo);
    const pontosCriticosClassificados = classificar_ponto_critico(termos, pontosCriticosNumericos, segundaDerivadaTermos);
    
    // Retorna um objeto estruturado com todos os resultados.
    return {
        termos,
        primeiraDerivada: primeiraDerivadaFormatada,
        segundaDerivada: segundaDerivadaFormatada,
        pontosCriticos: pontosCriticosClassificados,
    };
}


// Função "controladora" para a análise de integrais.
export function performIntegralAnalysis(funcao, a, b, n) {
    // Validação de inputs
    if (!funcao) {
        throw new Error("A função não pode estar vazia.");
    }
    if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
        throw new Error("Os limites de integração e o número de intervalos devem ser números válidos.");
    }

    const resultados = integralNumerica(funcao, a, b, n);
    return resultados;
}

// NOVA FUNÇÃO PARA GERAR DADOS DO GRÁFICO
export function generateGraphData(funcao, min = -10, max = 10, steps = 200) {
    if (!funcao) {
        return { labels: [], data: [] };
    }

    const labels = []; // Eixo X
    const data = [];   // Eixo Y
    const stepSize = (max - min) / (steps - 1);
    
    try {
        // Tenta compilar a função uma vez para performance
        const node = math.parse(funcao);
        const code = node.compile();

        for (let i = 0; i < steps; i++) {
            const x = min + i * stepSize;
            labels.push(x.toFixed(2)); // Adiciona o ponto X

            // Define o valor de 'x' para a expressão e calcula
            const y = code.evaluate({ x: x });
            data.push(y); // Adiciona o ponto Y
        }
        
        return { labels, data };

    } catch (error) {
        console.error("Erro ao gerar dados do gráfico:", error);
        // Retorna vazio em caso de erro de parsing
        return { labels: [], data: [] };
    }
}