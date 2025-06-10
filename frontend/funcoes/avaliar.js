export function avaliarTermo(termo, x) {
    // Remove espaços e normaliza o termo
    termo = termo.trim();
    
    // Polinomial: ax^n
    if (/^-?\d*\.?\d*x\^-?\d+(\.\d+)?$/.test(termo)) {
        const match = termo.match(/^(-?\d*\.?\d*)x\^(-?\d+(\.\d+)?)$/);
        let coefStr = match[1];
        
        // Trata coeficientes vazios ou apenas sinais
        const coef = coefStr === '' || coefStr === '+' ? 1 :
                     coefStr === '-' ? -1 :
                     parseFloat(coefStr);
        
        const exp = parseFloat(match[2]);
        
        // Verifica divisão por zero para expoentes negativos
        if (exp < 0 && x === 0) {
            return NaN;
        }
        
        return coef * Math.pow(x, exp);

    // Linear: ax ou x
    } else if (/^-?\d*\.?\d*x$/.test(termo)) {
        let coefStr = termo.replace('x', '');
        
        const coef = coefStr === '' || coefStr === '+' ? 1 :
                     coefStr === '-' ? -1 :
                     parseFloat(coefStr);
        
        return coef * x;

    // Exponencial: ae^x ou ae^(x)
    } else if (/^-?\d*\.?\d*e\^\(?[a-zA-Z0-9+\-*/^]*\)?$/.test(termo)) {
        const match = termo.match(/^(-?\d*\.?\d*)?e\^\(?([^)]*)\)?$/);
        if (!match) return 0;

        const coefStr = match[1];
        let coef = 1;
        
        if (coefStr === '-') coef = -1;
        else if (coefStr && coefStr !== '+') coef = parseFloat(coefStr);

        // Para e^x simples
        const argumento = match[2] || 'x';
        if (argumento === 'x' || argumento === '') {
            return coef * Math.exp(x);
        }
        
        // Para outros argumentos, assumimos que é uma constante multiplicando x
        try {
            const fatorX = parseFloat(argumento) || 1;
            return coef * Math.exp(fatorX * x);
        } catch (e) {
            return coef * Math.exp(x);
        }

    // Constante: número puro
    } else if (/^-?\d+(\.\d+)?$/.test(termo)) {
        return parseFloat(termo);
    }

    // Funções trigonométricas básicas
    if (/^-?\d*\.?\d*sin\(x\)$/.test(termo)) {
        const coefMatch = termo.match(/^(-?\d*\.?\d*)sin\(x\)$/);
        const coef = coefMatch[1] === '' || coefMatch[1] === '+' ? 1 :
                     coefMatch[1] === '-' ? -1 :
                     parseFloat(coefMatch[1]) || 1;
        return coef * Math.sin(x);
    }
    
    if (/^-?\d*\.?\d*cos\(x\)$/.test(termo)) {
        const coefMatch = termo.match(/^(-?\d*\.?\d*)cos\(x\)$/);
        const coef = coefMatch[1] === '' || coefMatch[1] === '+' ? 1 :
                     coefMatch[1] === '-' ? -1 :
                     parseFloat(coefMatch[1]) || 1;
        return coef * Math.cos(x);
    }

    return 0; // Termo não reconhecido
}

export function avaliar(expressao, x) {
    // Se a expressão for uma string, convertemos para um array de termos
    let termos = Array.isArray(expressao) ? expressao : expressaoParaTermos(expressao);
    
    let resultado = 0;
    
    for (let termoOriginal of termos) {
        let termo = termoOriginal.trim();
        let sinal = 1;

        // Determina o sinal do termo
        if (termo.startsWith('+')) {
            termo = termo.slice(1);
        } else if (termo.startsWith('-')) {
            sinal = -1;
            termo = termo.slice(1);
        }

        // Verifica se o termo está entre parênteses
        if (/^\(.*\)$/.test(termo)) {
            termo = termo.slice(1, -1);
            let subTermos = expressaoParaTermos(termo);

            // Avalia recursivamente os subtermos
            for (let subTermo of subTermos) {
                let subSinal = 1;
                let subTermoLimpo = subTermo.trim();
                
                if (subTermoLimpo.startsWith('+')) {
                    subTermoLimpo = subTermoLimpo.slice(1);
                } else if (subTermoLimpo.startsWith('-')) {
                    subSinal = -1;
                    subTermoLimpo = subTermoLimpo.slice(1);
                }
                
                resultado += sinal * subSinal * avaliarTermo(subTermoLimpo, x);
            }
        } else {
            resultado += sinal * avaliarTermo(termo, x);
        }
    }

    return resultado;
}

// Função auxiliar para converter uma expressão em string para termos
export function expressaoParaTermos(expressao) {
    if (typeof expressao !== 'string') {
        return Array.isArray(expressao) ? expressao : [expressao.toString()];
    }
    
    expressao = expressao.replace(/\s+/g, ''); // Remove espaços
    
    let termos = [];
    let inicio = 0;
    let dentro_parenteses = 0;

    for (let i = 0; i < expressao.length; i++) {
        const char = expressao[i];
        
        if (char === '(') {
            dentro_parenteses++;
        } else if (char === ')') {
            dentro_parenteses--;
        } else if ((char === '+' || char === '-') && i > 0 && dentro_parenteses === 0) {
            // Verifica se não é parte de um expoente
            if (expressao[i-1] !== '^') {
                termos.push(expressao.slice(inicio, i));
                inicio = i;
            }
        }
    }

    termos.push(expressao.slice(inicio));
    
    // Filtra termos vazios e remove espaços
    return termos.filter(t => t.trim() !== '').map(t => t.trim());
}