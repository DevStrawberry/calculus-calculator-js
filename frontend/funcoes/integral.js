import { avaliar } from './avaliar.js';

// Função auxiliar para avaliar a função em um ponto x
export function avaliarFuncao(funcao, x) {
    try {
        // Se funcao for string, usa o sistema de avaliação próprio
        if (typeof funcao === 'string') {
            // Processa a string da função para o formato esperado
            const funcaoProcessada = funcao
                .replace(/\be\b/g, 'e^x')  // Substitui 'e' isolado por 'e^x'
                .replace(/\*\*/g, '^')     // Converte ** para ^
                .replace(/Math\.E/g, 'e^x'); // Converte Math.E para e^x
                
            return avaliar(funcaoProcessada, x);
        } else if (Array.isArray(funcao)) {
            return avaliar(funcao, x);
        }
        
        throw new Error('Formato de função não suportado');
    } catch (erro) {
        throw new Error(`Erro ao avaliar a função: ${erro.message}`);
    }
}

// Método de Riemann (esquerda, direita, ponto médio)
export function riemann(funcao, a, b, n, tipo = 'esquerda') {
    if (n <= 0) throw new Error("Número de subdivisões deve ser positivo");
    if (a >= b) throw new Error("Limite inferior deve ser menor que o superior");
    
    const dx = (b - a) / n;
    let soma = 0;
    
    for (let i = 0; i < n; i++) {
        let xi;
        switch (tipo) {
            case 'esquerda':
                xi = a + i * dx;
                break;
            case 'direita':
                xi = a + (i + 1) * dx;
                break;
            case 'pontoMedio':
                xi = a + (i + 0.5) * dx;
                break;
            default:
                throw new Error("Tipo deve ser 'esquerda', 'direita' ou 'pontoMedio'");
        }
        
        const valor = avaliarFuncao(funcao, xi);
        if (isFinite(valor)) {
            soma += valor;
        }
    }
    return soma * dx;
}

export function trapezio(funcao, a, b, n) {
    if (n <= 0) throw new Error("Número de subdivisões deve ser positivo");
    if (a >= b) throw new Error("Limite inferior deve ser menor que o superior");
    
    const dx = (b - a) / n;
    
    const fa = avaliarFuncao(funcao, a);
    const fb = avaliarFuncao(funcao, b);
    
    if (!isFinite(fa) || !isFinite(fb)) {
        throw new Error("Função não é finita nos extremos do intervalo");
    }
    
    let soma = (fa + fb) / 2;
    
    for (let i = 1; i < n; i++) {
        const xi = a + i * dx;
        const valor = avaliarFuncao(funcao, xi);
        if (isFinite(valor)) {
            soma += valor;
        }
    }
    return soma * dx;
}

export function simpson(funcao, a, b, n) {
    // n deve ser par para Simpson
    if (n % 2 !== 0) n++;

    const h = (b - a) / n;
    let soma = 0;
    
    const fa = avaliarFuncao(funcao, a);
    const fb = avaliarFuncao(funcao, b);
    
    if (!isFinite(fa) || !isFinite(fb)) {
        throw new Error("Função não é finita nos extremos do intervalo");
    }
    
    soma = fa + fb;
    
    // Termos ímpares (coeficiente 4)
    for (let i = 1; i < n; i += 2) {
        const xi = a + i * h;
        const valor = avaliarFuncao(funcao, xi);
        if (isFinite(valor)) {
            soma += 4 * valor;
        }
    }
    
    // Termos pares (coeficiente 2)
    for (let i = 2; i < n; i += 2) {
        const xi = a + i * h;
        const valor = avaliarFuncao(funcao, xi);
        if (isFinite(valor)) {
            soma += 2 * valor;
        }
    }
    
    return (h / 3) * soma;
}

export function integralNumerica(funcao, a, b, n) {
    try {
        return {
            riemannEsquerda: riemann(funcao, a, b, n, 'esquerda'),
            riemannDireita: riemann(funcao, a, b, n, 'direita'),
            riemannPontoMedio: riemann(funcao, a, b, n, 'pontoMedio'),
            trapezio: trapezio(funcao, a, b, n),
            simpson: simpson(funcao, a, b, n)
        };
    } catch (erro) {
        throw new Error(`Erro no cálculo da integral: ${erro.message}`);
    }
}