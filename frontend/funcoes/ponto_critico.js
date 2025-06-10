import { avaliar } from "./avaliar.js";

export function encontrar_ponto_critico_bissecao(expressao, inicio, fim, tolerancia = 1e-8, max_iteracoes = 100) {
    let a = inicio;
    let b = fim;
    let fa = avaliar(expressao, a);
    let fb = avaliar(expressao, b);
    
    // Verifica valores infinitos ou NaN
    if (!isFinite(fa) || !isFinite(fb) || isNaN(fa) || isNaN(fb)) {
        return null;
    }
    
    // Verificamos se há mudança de sinal no intervalo
    if (fa * fb > 0) {
        return null;
    }
    
    let iteracao = 0;
    while ((b - a) > tolerancia && iteracao < max_iteracoes) {
        let c = (a + b) / 2;
        let fc = avaliar(expressao, c);
        
        // Verifica se fc é finito
        if (!isFinite(fc) || isNaN(fc) || Math.abs(fc) > 1e10) {
            return null;
        }
        
        // Se encontrarmos um valor próximo de zero, é um ponto crítico
        if (Math.abs(fc) < tolerancia) {
            return Number(c.toFixed(8));
        }
        
        // Verificamos em qual subintervalo está a mudança de sinal
        if (fa * fc < 0) {
            b = c;
            fb = fc;
        } else {
            a = c;
            fa = fc;
        }
        
        iteracao++;
    }
    
    return Number(((a + b) / 2).toFixed(8));
}

// Encontra todos os pontos críticos em um intervalo
export function encontrar_pontos_criticos(expressao, inicio, fim, granularidade = 0.1, tolerancia = 1e-6) {
    let pontos_criticos = [];
    
    // Ajusta granularidade baseada no tamanho do intervalo
    const tamanhoIntervalo = fim - inicio;
    if (tamanhoIntervalo > 10) {
        granularidade = Math.max(0.1, tamanhoIntervalo / 100);
    }
    
    for (let i = inicio; i < fim; i += granularidade) {
        let subInicio = i;
        let subFim = Math.min(i + granularidade, fim);
        
        // Evita problemas próximos a zero para certas funções
        if (Math.abs(subInicio) < 1e-10) {
            subInicio = subInicio < 0 ? -1e-10 : 1e-10;
        }
        if (Math.abs(subFim) < 1e-10) {
            subFim = subFim < 0 ? -1e-10 : 1e-10;
        }
        
        let valorInicio, valorFim;
        
        try {
            valorInicio = avaliar(expressao, subInicio);
            valorFim = avaliar(expressao, subFim);
        } catch (e) {
            continue; // Pula intervalos problemáticos
        }
        
        // Verifica se os valores são finitos e não muito grandes
        if (!isFinite(valorInicio) || !isFinite(valorFim) || 
            isNaN(valorInicio) || isNaN(valorFim) ||
            Math.abs(valorInicio) > 1e8 || Math.abs(valorFim) > 1e8) {
            continue;
        }
        
        // Verifica se há mudança de sinal ou valores próximos de zero
        if (valorInicio * valorFim <= 0 || 
            Math.abs(valorInicio) < tolerancia || 
            Math.abs(valorFim) < tolerancia) {
            
            let ponto = encontrar_ponto_critico_bissecao(expressao, subInicio, subFim, tolerancia);
            
            if (ponto !== null && ponto >= inicio && ponto <= fim) {
                try {
                    let valor_no_ponto = avaliar(expressao, ponto);
                    
                    // Verifica se é realmente um ponto crítico
                    if (isFinite(valor_no_ponto) && Math.abs(valor_no_ponto) < 1e-4) {
                        // Verifica se este ponto já não foi encontrado
                        if (!pontos_criticos.some(p => Math.abs(p - ponto) < tolerancia * 100)) {
                            pontos_criticos.push(ponto);
                        }
                    }
                } catch (e) {
                    // Ignora pontos problemáticos
                }
            }
        }
    }
    
    return pontos_criticos.sort((a, b) => a - b);
}

export function classificar_ponto_critico(funcaoOriginal, pontosCriticos, segundaDerivada) {
    let resultado = [];
    
    for (let ponto of pontosCriticos) {
        try {
            let valor_funcao = avaliar(funcaoOriginal, ponto);
            let valor_segunda_derivada = avaliar(segundaDerivada, ponto);
            
            // Verifica se a função tem valores válidos neste ponto
            if (!isFinite(valor_funcao) || isNaN(valor_funcao) || Math.abs(valor_funcao) > 1e8) {
                console.log(`x = ${ponto.toFixed(6)} é uma descontinuidade ou ponto problemático`);
                continue;
            }
            
            // Verifica se a segunda derivada é válida
            if (!isFinite(valor_segunda_derivada) || isNaN(valor_segunda_derivada)) {
                resultado.push({
                    ponto,
                    tipo: "Ponto crítico (teste inconclusivo)",
                    valor: valor_funcao
                });
                continue;
            }
            
            let tipo;
            if (Math.abs(valor_segunda_derivada) < 1e-6) {
                tipo = "Ponto de inflexão ou indeterminado";
            } else if (valor_segunda_derivada > 0) {
                tipo = "Mínimo local";
            } else {
                tipo = "Máximo local";
            }
            
            resultado.push({
                ponto,
                tipo,
                valor: valor_funcao
            });
            
            console.log(`x = ${ponto.toFixed(6)} (${tipo}), f(${ponto.toFixed(6)}) = ${valor_funcao.toFixed(6)}`);
            
        } catch (e) {
            console.log(`Erro ao classificar ponto x = ${ponto.toFixed(6)}: ${e.message}`);
        }
    }
    
    return resultado;
}